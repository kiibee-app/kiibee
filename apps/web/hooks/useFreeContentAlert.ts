"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { storage } from "@/utils/storage";

const FREE_CONTENT_ALERT_KEY = "free_content_warning_last_toast";
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export function useFreeContentAlert(hasFreeContent: boolean) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!hasFreeContent) return;

    try {
      const lastShown = storage.get(FREE_CONTENT_ALERT_KEY);
      const now = Date.now();

      if (!lastShown || now - Number(lastShown) >= SIX_HOURS_MS) {
        toast.warning(
          t(
            "contents.admissionRequirements.freeContentToastWarning",
            "You have free content. Please set payment or access code to publish or maintain it public.",
          ),
          {
            toastId: "free-content-6h-warning-toast",
            autoClose: 8000,
          },
        );
        storage.set(FREE_CONTENT_ALERT_KEY, String(now));
      }
    } catch {}
  }, [hasFreeContent, t]);
}
