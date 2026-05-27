import { isBrowser } from "@/utils/ui";

export const storage = {
  set(key: string, value: string) {
    if (!isBrowser) return;
    window.localStorage.setItem(key, value);
  },

  get(key: string) {
    if (!isBrowser) return null;
    return window.localStorage.getItem(key);
  },

  remove(key: string) {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  },
};
