import { z } from "zod";

type metaType = Record<string, unknown> | string | number |
  z.ZodError | z.ZodIssue | z.ZodError[] | z.ZodIssue[] |
  unknown | null;

// logger is used by both the client and server
export const logger = {
  info: (message: string, meta?: metaType) => {
    console.log(`INFO: ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
  },
  error: (message: string, meta?: metaType) => {
    console.error(`ERROR: ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
  },
  debug: (message: string, meta?: metaType) => {
    console.debug(`DEBUG: ${message}`, meta ? JSON.stringify(meta, null, 2) : "");
  }
};

