"use client";

import { useEffect } from "react";
import { mergeStoredLoginUser } from "@/hooks/auth/useLogin";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import type { LoginUser } from "@/hooks/auth/useLogin";
import type { ProfileForm } from "@/utils/creatorProfile";
import { USER_STORAGE_KEY } from "@/utils/viewerProfile";

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

export function readCreatorBootstrapFromStorage(): Pick<
  ProfileForm,
  "firstName" | "lastName" | "email"
> {
  if (typeof window === "undefined") {
    return { firstName: "", lastName: "", email: "" };
  }

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    const user = raw ? (JSON.parse(raw) as LoginUser) : null;
    const email = str(user?.email);

    const storedFirst = str(user?.firstName);
    const storedLast = str(user?.lastName);
    if (storedFirst || storedLast) {
      return { firstName: storedFirst, lastName: storedLast, email };
    }

    const fullName = str(user?.fullName);
    if (fullName) {
      const parts = fullName.split(/\s+/).filter(Boolean);
      return {
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" "),
        email,
      };
    }

    return { firstName: "", lastName: "", email };
  } catch {
    return { firstName: "", lastName: "", email: "" };
  }
}

export function buildCreatorProfilePatchBody(
  form: ProfileForm,
  saved: ProfileForm,
  avatarDirty: boolean,
  avatarImage: string | null,
): UpdateCreatorProfileBody {
  const body: UpdateCreatorProfileBody = {};

  if (form.firstName.trim() !== saved.firstName.trim()) {
    body.firstName = form.firstName.trim();
  }
  if (form.lastName.trim() !== saved.lastName.trim()) {
    body.lastName = form.lastName.trim();
  }
  if (form.company.trim() !== saved.company.trim()) {
    body.companyName = form.company.trim();
  }
  if (form.phone.trim() !== saved.phone.trim()) {
    body.phone = form.phone.trim();
  }
  if (form.cvr.trim() !== saved.cvr.trim()) {
    body.cvr = form.cvr.trim();
  }
  if (form.address.trim() !== saved.address.trim()) {
    body.address = form.address.trim();
  }
  if (form.city.trim() !== saved.city.trim()) {
    body.city = form.city.trim();
  }
  if (form.postal.trim() !== saved.postal.trim()) {
    body.postalCode = form.postal.trim();
  }
  if (form.reg.trim() !== saved.reg.trim()) {
    body.regNumber = form.reg.trim();
  }
  if (form.account.trim() !== saved.account.trim()) {
    body.accountNumber = form.account.trim();
  }
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
    const displayName = displayCreatorName(form);
    const avatarUrl =
      profile.user?.avatarUrl === null
        ? null
        : typeof profile.user?.avatarUrl === "string" &&
            profile.user.avatarUrl.length > 0
          ? profile.user.avatarUrl
          : null;

    mergeStoredLoginUser({
      email: form.email || undefined,
      fullName: displayName || undefined,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      avatarUrl,
    });
  }, [profileQuery.data]);

  return profileQuery;
}
