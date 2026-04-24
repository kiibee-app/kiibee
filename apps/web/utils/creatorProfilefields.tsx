import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { FORM_KEYS } from "@/utils/creatorProfile";
import {
  Optional,
  OptionalSmall,
} from "@/components/Feature/Dashboard/CreatorProfile/styles";

export const getProfileFields = (t: (k: string) => string) => [
  {
    key: FORM_KEYS.firstName,
    label: t(CREATOR_PROFILE.firstName),
  },
  {
    key: FORM_KEYS.lastName,
    label: t(CREATOR_PROFILE.lastName),
  },
];

export const getPasswordFields = (t: (key: string) => string) => [
  {
    key: "current",
    label: t(CREATOR_PROFILE.currentPassword),
  },
  {
    key: "next",
    label: t(CREATOR_PROFILE.newPassword),
  },
  {
    key: "confirm",
    label: t(CREATOR_PROFILE.confirmPassword),
  },
];

export const getPaymentFields = (t: (key: string) => string) => [
  {
    key: "reg",
    label: t(CREATOR_PROFILE.regLabel),
  },
  {
    key: "account",
    label: t(CREATOR_PROFILE.accountLabel),
  },
];

export const getCompanyFields = (t: (key: string) => string) => [
  {
    key: FORM_KEYS.company,
    label: (
      <>
        {t(CREATOR_PROFILE.companyName)}
        <Optional> ({t("common.optional")})</Optional>
      </>
    ),
    placeholder: t(CREATOR_PROFILE.companyPlaceholder),
  },
  {
    key: FORM_KEYS.phone,
    label: t(CREATOR_PROFILE.phone),
  },
  {
    key: FORM_KEYS.cvr,
    label: (
      <>
        {t(CREATOR_PROFILE.cvr)}
        <OptionalSmall> ({t("common.optional")})</OptionalSmall>
      </>
    ),
    placeholder: t(CREATOR_PROFILE.cvrPlaceholder),
  },
  {
    key: FORM_KEYS.address,
    label: t(CREATOR_PROFILE.address),
  },
  {
    key: FORM_KEYS.city,
    label: t(CREATOR_PROFILE.city),
  },
  {
    key: FORM_KEYS.postal,
    label: t(CREATOR_PROFILE.postal),
  },
];
