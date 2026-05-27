import { isBrowser } from "@/utils/ui";

const safeStorage = isBrowser ? window.localStorage : null;

export const storage = {
  set(key: string, value: string) {
    safeStorage?.setItem(key, value);
  },

  get(key: string) {
    return safeStorage?.getItem(key) ?? null;
  },

  remove(key: string) {
    safeStorage?.removeItem(key);
  },
};
