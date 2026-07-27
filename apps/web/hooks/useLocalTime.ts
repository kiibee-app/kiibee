import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_OPTIONS } from "@/utils/formatDate";

export const useLocalTime = () => {
  const { i18n } = useTranslation();

  const formatTime = useCallback(
    (
      value: string | Date | number | null | undefined,
      options?: Intl.DateTimeFormatOptions,
    ) => {
      if (value === null || value === undefined || value === "") return "";

      const date = value instanceof Date ? value : new Date(value);

      if (isNaN(date.getTime())) return "";

      const mergedOptions: Intl.DateTimeFormatOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
      };

      const locale = i18n.language || undefined;

      try {
        return new Intl.DateTimeFormat(locale, mergedOptions).format(date);
      } catch (error) {
        console.error("Error formatting time:", error);
        try {
          return new Intl.DateTimeFormat(undefined, mergedOptions).format(date);
        } catch {
          return date.toISOString();
        }
      }
    },
    [i18n.language],
  );

  return { formatTime };
};
