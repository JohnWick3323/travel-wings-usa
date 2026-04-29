import { config } from "./config.js";
import { logger } from "./logger.js";
import { runPollCycle } from "./fulfillment.js";

const intervalMs = config.pollIntervalMinutes * 60 * 1000;

logger.info("Fulfillment worker starting", {
  store: config.shopify.storeDomain,
  sftpHost: config.sftp.host,
  incomingDir: config.sftp.incomingDir,
  processedDir: config.sftp.processedDir,
  errorDir: config.sftp.errorDir,
  podLocation: config.podLocationName,
  pollIntervalMinutes: config.pollIntervalMinutes,
});

// Run immediately on startup
await runPollCycle();

// Then schedule recurring polls
const timer = setInterval(async () => {
  await runPollCycle();
}, intervalMs);

logger.info(`Next poll in ${config.pollIntervalMinutes} minute(s)`);

// Graceful shutdown
function shutdown() {
  logger.info("Shutting down fulfillment worker");
  clearInterval(timer);
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
