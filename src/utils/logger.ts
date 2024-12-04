export const logger = {
    info: (message: string, meta?: Record<string, unknown> | string | number) => {
      console.log(`INFO: ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
    },
    error: (message: string, meta?: Record<string, unknown> | string | number) => {
      console.error(`ERROR: ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
    },
  };
  