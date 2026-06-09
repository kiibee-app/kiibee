import type { LoginUser } from "@/hooks/auth/useLogin";
import { authStorage } from "@/lib/auth/authStorage";
import {
  PROFILE_FIELD_MAP,
  type CreatorProfileBodyKey,
} from "@/utils/profileFieldMap";
import { isString, toTrimmedString } from "@/utils/Constants";
import { isBrowser } from "@/utils/ui";

export type Passwords = {
  current: string;
  next: string;
  confirm: string;
};

export type ProfileForm = {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  cvr: string;
  address: string;
  city: string;
  postal: string;
  reg: string;
  account: string;
  email: string;
};

export type PasswordState = {
  current: string;
  next: string;
  confirm: string;
};

export const emptyPasswords: PasswordState = {
  current: "",
  next: "",
  confirm: "",
};

export type PaymentKeys = "reg" | "account";
export type CompanyKeys =
  | "company"
  | "phone"
  | "cvr"
  | "address"
  | "city"
  | "postal";

export const FORM_KEYS = {
  firstName: "firstName",
  lastName: "lastName",
  company: "company",
  phone: "phone",
  cvr: "cvr",
  address: "address",
  city: "city",
  postal: "postal",
  reg: "reg",
  account: "account",
} as const;

export type FormKeys = (typeof FORM_KEYS)[keyof typeof FORM_KEYS];

export type CreatorBoot = Pick<ProfileForm, "firstName" | "lastName" | "email">;

export const EMPTY_CREATOR_PROFILE_FORM: ProfileForm = {
  firstName: "",
  lastName: "",
  company: "",
  phone: "",
  cvr: "",
  address: "",
  city: "",
  postal: "",
  reg: "",
  account: "",
  email: "",
};

export const EMPTY_CREATOR_BOOT: CreatorBoot = {
  firstName: EMPTY_CREATOR_PROFILE_FORM.firstName,
  lastName: EMPTY_CREATOR_PROFILE_FORM.lastName,
  email: EMPTY_CREATOR_PROFILE_FORM.email,
};

export type CreatorProfilePatchBody = Partial<
  Record<CreatorProfileBodyKey, string>
> & {
  avatarUrl?: string | null;
};

const trim = (value: string) => value.trim();

const str = toTrimmedString;

export function buildCreatorProfilePatchBody(
  form: ProfileForm,
  saved: ProfileForm,
  avatarDirty: boolean,
  avatarImage: string | null,
): CreatorProfilePatchBody {
  const body = PROFILE_FIELD_MAP.reduce<CreatorProfilePatchBody>(
    (acc, [formKey, bodyKey]) => {
      const current = trim(form[formKey]);
      const previous = trim(saved[formKey]);

      if (current !== previous) {
        acc[bodyKey] = current;
      }

      return acc;
    },
    {},
  );

  if (avatarDirty) {
    body.avatarUrl = avatarImage ?? null;
  }

  return body;
}

export function applyCreatorProfileResponseToForm(
  form: ProfileForm,
  data?: CreatorProfilePatchBody,
): ProfileForm {
  const next = { ...form };

  for (const [formKey, bodyKey] of PROFILE_FIELD_MAP) {
    const value = data?.[bodyKey];
    if (isString(value)) {
      next[formKey] = value.trim();
    }
  }

  return next;
}

export const getAvatarUrl = (avatarUrl?: string | null): string | null => {
  if (!isString(avatarUrl)) return null;
  return avatarUrl.length > 0 ? avatarUrl : null;
};

export const toOptionalString = (value: string): string | undefined =>
  value || undefined;

const WHITESPACE_REGEX = /\s+/;

export function parseCreatorNameFromFullName(
  fullName: string,
): Pick<ProfileForm, "firstName" | "lastName"> {
  const parts = fullName.split(WHITESPACE_REGEX).filter(Boolean);
  return {
    firstName: parts[0] ?? EMPTY_CREATOR_BOOT.firstName,
    lastName: parts.slice(1).join(" "),
  };
}

export function readCreatorBoot(): CreatorBoot {
  if (!isBrowser) {
    return EMPTY_CREATOR_BOOT;
  }

  const user = authStorage.getUser() as LoginUser | null;
  const email = str(user?.email);

  const storedFirst = str(user?.firstName);
  const storedLast = str(user?.lastName);
  if (storedFirst || storedLast) {
    return {
      ...EMPTY_CREATOR_BOOT,
      firstName: storedFirst,
      lastName: storedLast,
      email,
    };
  }

  const fullName = str(user?.fullName);
  if (fullName) {
    return {
      ...EMPTY_CREATOR_BOOT,
      ...parseCreatorNameFromFullName(fullName),
      email,
    };
  }

  return { ...EMPTY_CREATOR_BOOT, email };
}

export function displayCreatorName(
  form: Pick<ProfileForm, "firstName" | "lastName">,
): string {
  return [form.firstName, form.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

const CREATOR_PROFILE_UTILS = {
  FORM_KEYS,
  EMPTY_CREATOR_PROFILE_FORM,
  EMPTY_CREATOR_BOOT,
  buildCreatorProfilePatchBody,
  getAvatarUrl,
  toOptionalString,
};

export default CREATOR_PROFILE_UTILS;

export type SocialIconComponent = React.ComponentType<{
  width: number;
  height: number;
  color: string;
}>;

export type SocialIconEntry = {
  domains: string[];
  Icon: SocialIconComponent;
};

const URL_PROTOCOL_REGEX = /^(https?:\/\/)?(www\.)?/;
const URL_TRAILING_SLASH_REGEX = /\/$/;

export function getDisplayUrl(url: string): string {
  return url
    .replace(URL_PROTOCOL_REGEX, "")
    .replace(URL_TRAILING_SLASH_REGEX, "");
}

export function matchSocialPlatform(
  url: string,
  entries: SocialIconEntry[],
): SocialIconEntry | undefined {
  const lowercase = url.toLowerCase();
  return entries.find(({ domains }) =>
    domains.some((d) => lowercase.includes(d)),
  );
}
