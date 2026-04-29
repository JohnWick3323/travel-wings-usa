function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info(message: string, data?: Record<string, unknown>) {
    console.log(JSON.stringify({ level: "info", time: timestamp(), message, ...data }));
  },

  warn(message: string, data?: Record<string, unknown>) {
    console.warn(JSON.stringify({ level: "warn", time: timestamp(), message, ...data }));
  },

  error(message: string, data?: Record<string, unknown>) {
    console.error(JSON.stringify({ level: "error", time: timestamp(), message, ...data }));
  },
};
