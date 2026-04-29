import type { TFunction } from "i18next";
import { SETTINGS } from "@/utils/translationKeys";

export const EXPORT_TYPE_OPTIONS = (t: TFunction) => [
  {
    value: "users-email-signups",
    label: t(SETTINGS.export.exportTypeUsersEmailSignups),
  },
  {
    value: "sales",
    label: t(SETTINGS.export.exportTypeSales),
  },
  {
    value: "views",
    label: t(SETTINGS.export.exportTypeViews),
  },
];
