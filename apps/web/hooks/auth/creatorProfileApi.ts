import {
  parseCreatorNameFromFullName,
  type CreatorProfilePatchBody,
  type ProfileForm,
} from "@/utils/creatorProfile";
import { toTrimmedString as str } from "@/utils/Constants";

export {
  applyCreatorProfileResponseToForm,
  buildCreatorProfilePatchBody,
  displayCreatorName,
  EMPTY_CREATOR_BOOT,
  EMPTY_CREATOR_PROFILE_FORM,
  getAvatarUrl,
  readCreatorBoot,
  toOptionalString,
} from "@/utils/creatorProfile";

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

export type {
  CreatorProfilePatchBody,
  CreatorProfilePatchBody as UpdateCreatorProfileBody,
} from "@/utils/creatorProfile";

export type UpdateCreatorProfileResponse = {
  success?: boolean;
  message?: string;
  data?: CreatorProfilePatchBody;
};

export function mapCreatorProfileToForm(
  data: CreatorProfileApiData,
): ProfileForm {
  const user = data.user;
  const info = data.creatorInfo;
  const bank = data.bankAccount;

  let firstName = str(user?.firstName);
  let lastName = str(user?.lastName);

  if (!firstName && !lastName) {
    const parsed = parseCreatorNameFromFullName(str(user?.fullName));
    firstName = parsed.firstName;
    lastName = parsed.lastName;
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
