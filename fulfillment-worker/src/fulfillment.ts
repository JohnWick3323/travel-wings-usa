import type SftpClient from "ssh2-sftp-client";
import { config } from "./config.js";
import { logger } from "./logger.js";
import { parseCsv, deriveCarrier } from "./csv-parser.js";
import { connect, disconnect, listCsvFiles, downloadFile, moveFile } from "./sftp.js";
import {
  findOrderByName,
  getFulfillmentOrders,
  findOpenPrintRoyalFulfillmentOrders,
  createFulfillment,
} from "./shopify.js";
import path from "node:path";

async function processFile(sftp: SftpClient, filePath: string): Promise<void> {
  const fileName = path.posix.basename(filePath);
  logger.info("Processing CSV", { file: fileName });

  // 1. Download and parse CSV
  const content = await downloadFile(sftp, filePath);
  const record = parseCsv(content, fileName);
  logger.info("Parsed CSV", {
    trackingNumber: record.trackingNumber,
    orderNumber: record.orderNumber,
    shippingMethod: record.shippingMethod,
  });

  // 2. Find the Shopify order
  const order = await findOrderByName(record.orderNumber);
  if (!order) {
    throw new Error(`Shopify order not found for "${record.orderNumber}"`);
  }
  logger.info("Found Shopify order", { orderId: order.id, orderName: order.name });

  // 3. Get fulfillment orders
  const fulfillmentOrders = await getFulfillmentOrders(order.id);

  // 4. Filter to open Print Royal fulfillment orders
  const printRoyalFOs = findOpenPrintRoyalFulfillmentOrders(fulfillmentOrders, config.podLocationName);

  if (printRoyalFOs.length === 0) {
    // Check if already fulfilled
    const allPrintRoyal = fulfillmentOrders.filter(
      (fo) => fo.assignedLocation.name === config.podLocationName,
    );
    if (allPrintRoyal.length > 0 && allPrintRoyal.every((fo) => fo.status === "CLOSED")) {
      logger.warn("All Print Royal fulfillment orders already fulfilled, skipping", {
        orderName: order.name,
      });
      await moveFile(sftp, filePath, config.sftp.processedDir);
      return;
    }
    throw new Error(
      `No open fulfillment orders for "${config.podLocationName}" on order ${order.name}. ` +
        `Found statuses: ${fulfillmentOrders.map((fo) => `${fo.assignedLocation.name}=${fo.status}`).join(", ")}`,
    );
  }

  // 5. Create fulfillment with tracking
  const carrier = deriveCarrier(record.shippingMethod);
  const foIds = printRoyalFOs.map((fo) => fo.id);
  await createFulfillment(foIds, record.trackingNumber, carrier);

  // 6. Move to processed
  await moveFile(sftp, filePath, config.sftp.processedDir);
  logger.info("Successfully fulfilled and moved CSV", {
    orderName: order.name,
    trackingNumber: record.trackingNumber,
    file: fileName,
  });
}

export async function runPollCycle(): Promise<void> {
  logger.info("Starting poll cycle");
  let sftp: SftpClient | null = null;

  try {
    sftp = await connect();
    const csvFiles = await listCsvFiles(sftp);

    if (csvFiles.length === 0) {
      logger.info("No CSV files found in incoming directory");
      return;
    }

    logger.info(`Found ${csvFiles.length} CSV file(s) to process`);

    for (const filePath of csvFiles) {
      try {
        await processFile(sftp, filePath);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error("Failed to process CSV", {
          file: path.posix.basename(filePath),
          error: message,
        });

        try {
          await moveFile(sftp, filePath, config.sftp.errorDir);
        } catch (moveError) {
          const moveMsg = moveError instanceof Error ? moveError.message : String(moveError);
          logger.error("Failed to move file to error directory", {
            file: path.posix.basename(filePath),
            error: moveMsg,
          });
        }
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Poll cycle failed", { error: message });
  } finally {
    if (sftp) {
      await disconnect();
    }
    logger.info("Poll cycle complete");
  }
}
