import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const config = {
  shopify: {
    storeDomain: required("SHOPIFY_STORE_DOMAIN"),
    accessToken: required("SHOPIFY_ADMIN_ACCESS_TOKEN"),
    apiVersion: optional("SHOPIFY_API_VERSION", "2025-04"),
  },
  sftp: {
    host: required("SFTP_HOST"),
    port: parseInt(optional("SFTP_PORT", "22"), 10),
    username: required("SFTP_USERNAME"),
    password: required("SFTP_PASSWORD"),
    incomingDir: optional("SFTP_INCOMING_DIR", "/from_print"),
    processedDir: optional("SFTP_PROCESSED_DIR", "/processed_shopify_fullfilment"),
    errorDir: optional("SFTP_ERROR_DIR", "/error_fullfilment"),
  },
  podLocationName: optional("POD_LOCATION_NAME", "Print Royal GmbH"),
  pollIntervalMinutes: parseInt(optional("POLL_INTERVAL_MINUTES", "60"), 10),
} as const;
