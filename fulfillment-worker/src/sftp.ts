import SftpClient from "ssh2-sftp-client";
import path from "node:path";
import { config } from "./config.js";
import { logger } from "./logger.js";

let client: SftpClient | null = null;

export async function connect(): Promise<SftpClient> {
  const sftp = new SftpClient();
  await sftp.connect({
    host: config.sftp.host,
    port: config.sftp.port,
    username: config.sftp.username,
    password: config.sftp.password,
  });
  client = sftp;
  logger.info("SFTP connected", { host: config.sftp.host });
  return sftp;
}

export async function disconnect(): Promise<void> {
  if (client) {
    await client.end();
    client = null;
    logger.info("SFTP disconnected");
  }
}

export async function listCsvFiles(sftp: SftpClient): Promise<string[]> {
  const dir = config.sftp.incomingDir;
  const listing = await sftp.list(dir);
  return listing
    .filter((item) => item.type === "-" && item.name.toLowerCase().endsWith(".csv"))
    .map((item) => path.posix.join(dir, item.name));
}

export async function downloadFile(sftp: SftpClient, remotePath: string): Promise<string> {
  const buffer = await sftp.get(remotePath);
  if (Buffer.isBuffer(buffer)) {
    return buffer.toString("utf-8");
  }
  if (typeof buffer === "string") {
    return buffer;
  }
  throw new Error(`Unexpected response type when downloading ${remotePath}`);
}

export async function ensureDir(sftp: SftpClient, dirPath: string): Promise<void> {
  const exists = await sftp.exists(dirPath);
  if (!exists) {
    await sftp.mkdir(dirPath, true);
    logger.info("Created SFTP directory", { path: dirPath });
  }
}

export async function moveFile(sftp: SftpClient, fromPath: string, toDir: string): Promise<string> {
  await ensureDir(sftp, toDir);
  const fileName = path.posix.basename(fromPath);
  const destPath = path.posix.join(toDir, fileName);

  // If a file with the same name already exists, add a timestamp suffix
  const exists = await sftp.exists(destPath);
  let finalPath = destPath;
  if (exists) {
    const ext = path.posix.extname(fileName);
    const base = path.posix.basename(fileName, ext);
    finalPath = path.posix.join(toDir, `${base}_${Date.now()}${ext}`);
  }

  await sftp.rename(fromPath, finalPath);
  logger.info("Moved file on SFTP", { from: fromPath, to: finalPath });
  return finalPath;
}
