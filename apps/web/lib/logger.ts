import { isProduction, LOG_PREFIX } from "@/utils/common";

export const logger = {
  error: (...args: unknown[]) => {
    if (!isProduction) console.error(LOG_PREFIX, ...args);
  },
  warn: (...args: unknown[]) => {
    if (!isProduction) console.warn(LOG_PREFIX, ...args);
  },
  info: (...args: unknown[]) => {
    if (!isProduction) console.info(LOG_PREFIX, ...args);
  },
  debug: (...args: unknown[]) => {
    if (!isProduction) console.debug(LOG_PREFIX, ...args);
  },
};
