"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createLoginFormSchema } from "@/lib/validation/auth";

export function useLoginFormSchema() {
  const { t } = useTranslation();

  return useMemo(
    () =>
      createLoginFormSchema({
        emailRequired: t("authForm.errors.emailRequired"),
        emailInvalid: t("authForm.errors.emailInvalid"),
        passwordRequired: t("authForm.errors.passwordRequired"),
      }),
    [t],
  );
}
