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
      if (!value) return "";

      const date = value instanceof Date ? value : new Date(value);

      if (Number.isNaN(date.getTime())) return "";

      return new Intl.DateTimeFormat(i18n.language, {
        ...DEFAULT_OPTIONS,
        ...options,
      }).format(date);
    },
    [i18n.language],
  );

  return { formatTime };
};
