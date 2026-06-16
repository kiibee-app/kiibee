import type { CreatorLayoutKey } from "@/utils/creatorChannel";
import type { AppearanceFormValues } from "@/utils/appearanceApi";

export type AppearanceFormErrors = Partial<
  Record<keyof AppearanceFormValues, string>
>;

export type AppearanceFormContextValue = {
  values: AppearanceFormValues;
  errors: AppearanceFormErrors;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  updateField: <K extends keyof AppearanceFormValues>(
    key: K,
    value: AppearanceFormValues[K],
  ) => void;
  clearFieldError: (key: keyof AppearanceFormValues) => void;
  validateField: (key: keyof AppearanceFormValues) => void;
  setLayout: (layout: CreatorLayoutKey) => void;
  saveAppearance: () => Promise<void>;
  cancelAppearance: () => void;
};
