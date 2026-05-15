"use client";

import { useEffect } from "react";
import { mergeStoredLoginUser } from "@/hooks/auth/useLogin";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import type { LoginUser } from "@/hooks/auth/useLogin";
import type { ProfileForm } from "@/utils/creatorProfile";
import { PROFILE_FIELD_MAP } from "@/utils/profileFieldMap";
import { USER_STORAGE_KEY } from "@/utils/viewerProfile";

const trim = (value: string) => value.trim();

export const getAvatarUrl = (avatarUrl?: string | null): string | null => {
  if (typeof avatarUrl !== "string") return null;
  return avatarUrl.length > 0 ? avatarUrl : null;
};

export const toOptionalString = (value: string): string | undefined =>
  value || undefined;

export type CreatorProfileUser = {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string;
  avatarUrl?: string | null;
};

export type CreatorProfileInfo = {
  companyName?: string | null;
  phone?: string | null;
  cvr?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
};

export type CreatorProfileBankAccount = {
  registrationNumber?: string | null;
  accountNumber?: string | null;
};

export type CreatorProfileApiData = {
  user?: CreatorProfileUser | null;
  creatorInfo?: CreatorProfileInfo | null;
  bankAccount?: CreatorProfileBankAccount | null;
};

export type GetCreatorProfileResponse = {
  success?: boolean;
  message?: string;
  data?: CreatorProfileApiData;
};

export type UpdateCreatorProfileBody = {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  companyName?: string;
  phone?: string;
  cvr?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  regNumber?: string;
  accountNumber?: string;
};

export type UpdateCreatorProfileResponse = {
  success?: boolean;
  message?: string;
  data?: UpdateCreatorProfileBody;
};

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

export const EMPTY_CREATOR_BOOT: Pick<
  ProfileForm,
  "firstName" | "lastName" | "email"
> = {
  firstName: EMPTY_CREATOR_PROFILE_FORM.firstName,
  lastName: EMPTY_CREATOR_PROFILE_FORM.lastName,
  email: EMPTY_CREATOR_PROFILE_FORM.email,
};

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function mapCreatorProfileToForm(
  data: CreatorProfileApiData,
): ProfileForm {
  const user = data.user;
  const info = data.creatorInfo;
  const bank = data.bankAccount;

  let firstName = str(user?.firstName);
  let lastName = str(user?.lastName);

  if (!firstName && !lastName) {
    const parts = str(user?.fullName).split(/\s+/).filter(Boolean);
    firstName = parts[0] ?? "";
    lastName = parts.slice(1).join(" ");
  }

  return {
    firstName,
    lastName,
    email: str(user?.email),
    company: str(info?.companyName),
    phone: str(info?.phone),
    cvr: str(info?.cvr),
    address: str(info?.address),
    city: str(info?.city),
    postal: str(info?.postalCode),
    reg: str(bank?.registrationNumber),
    account: str(bank?.accountNumber),
  };
}

export function readCreatorBoot(): Pick<
  ProfileForm,
  "firstName" | "lastName" | "email"
> {
  if (typeof window === "undefined") {
    return EMPTY_CREATOR_BOOT;
  }

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    const user = raw ? (JSON.parse(raw) as LoginUser) : null;
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
      const parts = fullName.split(/\s+/).filter(Boolean);
      return {
        ...EMPTY_CREATOR_BOOT,
        firstName: parts[0] ?? EMPTY_CREATOR_BOOT.firstName,
        lastName: parts.slice(1).join(" "),
        email,
      };
    }

    return { ...EMPTY_CREATOR_BOOT, email };
  } catch {
    return EMPTY_CREATOR_BOOT;
  }
}

export function applyCreatorProfileResponseToForm(
  form: ProfileForm,
  data?: UpdateCreatorProfileBody,
): ProfileForm {
  const next = { ...form };

  for (const [formKey, bodyKey] of PROFILE_FIELD_MAP) {
    const value = data?.[bodyKey];
    if (typeof value === "string") {
      next[formKey] = value.trim();
    }
  }

  return next;
}

export function buildCreatorProfilePatchBody(
  form: ProfileForm,
  saved: ProfileForm,
  avatarDirty: boolean,
  avatarImage: string | null,
): UpdateCreatorProfileBody {
  const body = PROFILE_FIELD_MAP.reduce<UpdateCreatorProfileBody>(
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

export function displayCreatorName(form: ProfileForm): string {
  return [form.firstName, form.lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

export function useCreatorDashboardProfileSync() {
  const profileQuery = useGetAPI<GetCreatorProfileResponse>(
    API.auth.creatorProfile,
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    const profile = profileQuery.data?.data;
    if (!profile) return;

    const form = mapCreatorProfileToForm(profile);

    mergeStoredLoginUser({
      email: toOptionalString(form.email),
      fullName: toOptionalString(displayCreatorName(form)),
      firstName: toOptionalString(form.firstName),
      lastName: toOptionalString(form.lastName),
      avatarUrl: getAvatarUrl(profile.user?.avatarUrl),
    });
  }, [profileQuery.data]);

  return profileQuery;
}
