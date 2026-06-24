"use client";

import { useCallback, useMemo, useState } from "react";
import { FORM_FIELDS } from "@/utils/appearance";
import {
  areAppearanceValuesEqual,
  type AppearanceFormValues,
} from "@/utils/appearanceApi";
import type { CreatorLayoutKey } from "@/utils/creatorChannel";

type Params = {
  serverValues: AppearanceFormValues;
  setSelectedLayout: (layout: CreatorLayoutKey) => void;
  syncErrors: (nextValues: AppearanceFormValues) => void;
};

export function useAppearanceDraft({
  serverValues,
  setSelectedLayout,
  syncErrors,
}: Params) {
  const [draft, setDraft] = useState<AppearanceFormValues | null>(null);

  const values = useMemo(() => draft ?? serverValues, [draft, serverValues]);

  const hasUnsavedChanges = useMemo(
    () => draft !== null && !areAppearanceValuesEqual(draft, serverValues),
    [draft, serverValues],
  );

  const updateValues = useCallback(
    (updater: (current: AppearanceFormValues) => AppearanceFormValues) => {
      setDraft((prev) => {
        const nextValues = updater(prev ?? serverValues);
        syncErrors(nextValues);
        return nextValues;
      });
    },
    [serverValues, syncErrors],
  );

  const updateField = useCallback(
    <K extends keyof AppearanceFormValues>(
      key: K,
      value: AppearanceFormValues[K],
    ) => {
      updateValues((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [updateValues],
  );

  const setLayout = useCallback(
    (layout: CreatorLayoutKey) => {
      setSelectedLayout(layout);
      updateValues((current) => ({
        ...current,
        [FORM_FIELDS.LAYOUT]: layout,
      }));
    },
    [setSelectedLayout, updateValues],
  );

  const resetDraft = useCallback(() => {
    setDraft(null);
  }, []);

  return {
    values,
    hasUnsavedChanges,
    updateField,
    setLayout,
    resetDraft,
  };
}
