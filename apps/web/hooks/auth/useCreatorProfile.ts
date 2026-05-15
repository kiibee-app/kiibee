"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
} from "@/hooks/auth/useForgetPassword";
import { mergeStoredLoginUser } from "@/hooks/auth/useLogin";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { usePatchAPI } from "@/lib/http/api/patchApi";
import { usePostAPI } from "@/lib/http/api/postApi";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { createResetPasswordSchema } from "@/lib/validation/schema";
import type { ProfileForm } from "@/utils/creatorProfile";
import { PasswordState } from "@/utils/creatorProfile";
import {
  buildCreatorProfilePatchBody,
  displayCreatorName,
  EMPTY_CREATOR_PROFILE_FORM,
  mapCreatorProfileToForm,
  type GetCreatorProfileResponse,
  type UpdateCreatorProfileBody,
  type UpdateCreatorProfileResponse,
} from "@/hooks/auth/creatorProfileApi";
import { emptyPasswords } from "@/utils/dummyData/profile.data";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import {
  type ChangePasswordBody,
  type ChangePasswordResponse,
  type ForgotPasswordNotice,
} from "@/utils/viewerProfile";

export const useCreatorProfile = () => {
  const { t } = useTranslation();
  const { getErrorMessage } = useApiErrorMessage();

  const passwordSchema = useMemo(
    () =>
      createResetPasswordSchema(
        {
          currentRequired: t(CREATOR_PROFILE.currentPassword),
          nextRequired: t(CREATOR_PROFILE.newPassword),
          confirmRequired: t(CREATOR_PROFILE.confirmPassword),
          confirmMismatch: t("viewerSignup.form.passwordMismatch"),
          newMustDifferFromCurrent: t(CREATOR_PROFILE.newPasswordSameAsCurrent),
        },
        {
          nextMinLength: {
            min: 6,
            message: t("dashboard.viewerProfile.passwordMinLength"),
          },
        },
      ),
    [t],
  );

  const [form, setForm] = useState<ProfileForm>(EMPTY_CREATOR_PROFILE_FORM);
  const [saved, setSaved] = useState<ProfileForm>(EMPTY_CREATOR_PROFILE_FORM);
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState<PasswordState>(emptyPasswords);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState(false);
  const [forgotPasswordNotice, setForgotPasswordNotice] =
    useState<ForgotPasswordNotice>(null);
  const [passwordSubmitAttempted, setPasswordSubmitAttempted] = useState(false);

  const passwordFieldErrors = useMemo(() => {
    if (!passwordSubmitAttempted) {
      return {} as Partial<Record<keyof PasswordState, string>>;
    }
    const parsed = passwordSchema.safeParse(passwords);
    if (parsed.success) {
      return {} as Partial<Record<keyof PasswordState, string>>;
    }
    const fe = parsed.error.flatten().fieldErrors;
    return {
      ...(fe.current?.[0] ? { current: fe.current[0] } : {}),
      ...(fe.next?.[0] ? { next: fe.next[0] } : {}),
      ...(fe.confirm?.[0] ? { confirm: fe.confirm[0] } : {}),
    };
  }, [passwordSchema, passwords, passwordSubmitAttempted]);

  const avatarDirty = avatarImage !== savedAvatarUrl;

  const isProfileChanged = useMemo(() => {
    const formChanged = JSON.stringify(form) !== JSON.stringify(saved);
    const passwordChanged = Object.values(passwords).some(Boolean);
    return formChanged || passwordChanged || avatarDirty;
  }, [form, saved, passwords, avatarDirty]);

  const isProfileChangedRef = useRef(isProfileChanged);

  useEffect(() => {
    isProfileChangedRef.current = isProfileChanged;
  }, [isProfileChanged]);

  const updateProfile = usePatchAPI<
    UpdateCreatorProfileResponse,
    UpdateCreatorProfileBody
  >(API.auth.creatorProfile);
  const changePasswordMutation = usePatchAPI<
    ChangePasswordResponse,
    ChangePasswordBody
  >(API.auth.changePassword);
  const forgetPasswordMutation = usePostAPI<
    ForgetPasswordResponse,
    ForgetPasswordPayload
  >(API.auth.forgetPassword);

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

    queueMicrotask(() => {
      const nextForm = mapCreatorProfileToForm(profile);
      const nextAvatar =
        profile.user?.avatarUrl === null
          ? null
          : typeof profile.user?.avatarUrl === "string" &&
              profile.user.avatarUrl.length > 0
            ? profile.user.avatarUrl
            : null;

      if (!isProfileChangedRef.current) {
        setForm(nextForm);
        setSaved(nextForm);
        setAvatarImage(nextAvatar);
        setSavedAvatarUrl(nextAvatar);
      }

      const displayName = displayCreatorName(nextForm);
      mergeStoredLoginUser({
        fullName: displayName || undefined,
        email: nextForm.email || undefined,
        avatarUrl: nextAvatar,
        firstName: nextForm.firstName,
        lastName: nextForm.lastName,
      });
    });
  }, [profileQuery.data]);

  const onChange = useCallback(
    (key: keyof ProfileForm) => (value: string | string[]) => {
      setForm((prev) => ({ ...prev, [key]: String(value) }));
    },
    [],
  );

  const onPasswordChange = useCallback(
    (field: keyof PasswordState, value?: string) => {
      setPasswords((prev) => ({
        ...prev,
        [field]: value ?? "",
      }));
    },
    [],
  );

  const resetPasswords = useCallback(() => {
    setPasswords(emptyPasswords);
    setPasswordSubmitAttempted(false);
  }, []);

  const handleCancel = useCallback(() => {
    setForm(saved);
    setAvatarImage(savedAvatarUrl);
    resetPasswords();
    setShowPassword(false);
  }, [resetPasswords, saved, savedAvatarUrl]);

  const handleSave = async () => {
    if (!isProfileChanged || updateProfile.isPending) return;

    const patchBody = buildCreatorProfilePatchBody(
      form,
      saved,
      avatarDirty,
      avatarImage,
    );

    if (Object.keys(patchBody).length === 0) {
      setSaved(form);
      resetPasswords();
      setShowPassword(false);
      return;
    }

    try {
      const res = await updateProfile.mutateAsync(patchBody);
      const data = res.data;

      const nextForm: ProfileForm = {
        ...form,
        firstName:
          typeof data?.firstName === "string"
            ? data.firstName.trim()
            : form.firstName.trim(),
        lastName:
          typeof data?.lastName === "string"
            ? data.lastName.trim()
            : form.lastName.trim(),
        company:
          typeof data?.companyName === "string"
            ? data.companyName.trim()
            : form.company.trim(),
        phone:
          typeof data?.phone === "string"
            ? data.phone.trim()
            : form.phone.trim(),
        cvr: typeof data?.cvr === "string" ? data.cvr.trim() : form.cvr.trim(),
        address:
          typeof data?.address === "string"
            ? data.address.trim()
            : form.address.trim(),
        city:
          typeof data?.city === "string" ? data.city.trim() : form.city.trim(),
        postal:
          typeof data?.postalCode === "string"
            ? data.postalCode.trim()
            : form.postal.trim(),
        reg:
          typeof data?.regNumber === "string"
            ? data.regNumber.trim()
            : form.reg.trim(),
        account:
          typeof data?.accountNumber === "string"
            ? data.accountNumber.trim()
            : form.account.trim(),
      };

      const nextAvatar =
        data?.avatarUrl === null
          ? null
          : typeof data?.avatarUrl === "string" && data.avatarUrl.length > 0
            ? data.avatarUrl
            : avatarDirty
              ? (avatarImage ?? null)
              : savedAvatarUrl;

      setSaved(nextForm);
      setForm(nextForm);
      setSavedAvatarUrl(nextAvatar);
      setAvatarImage(nextAvatar);

      const displayName = displayCreatorName(nextForm);
      mergeStoredLoginUser({
        fullName: displayName || undefined,
        email: nextForm.email || undefined,
        avatarUrl: nextAvatar,
        firstName: nextForm.firstName,
        lastName: nextForm.lastName,
      });

      toast.success(t("dashboard.viewerProfile.saveSuccess"));
      resetPasswords();
      setShowPassword(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "dashboard.viewerProfile.saveError"));
    }
  };

  const handlePasswordClose = useCallback(() => {
    setShowPassword(false);
    resetPasswords();
  }, [resetPasswords]);

  const dismissForgotPasswordNotice = useCallback(() => {
    setForgotPasswordNotice(null);
  }, []);

  const handleForgotPassword = useCallback(async () => {
    const email = saved.email.trim().toLowerCase();
    if (!email) {
      setShowPassword(false);
      resetPasswords();
      setForgotPasswordNotice({
        variant: "error",
        message: t("dashboard.viewerProfile.forgotPasswordNoEmail"),
      });
      throw new Error("missing-email");
    }
    try {
      await forgetPasswordMutation.mutateAsync({ email });
      setShowPassword(false);
      resetPasswords();
      setForgotPasswordNotice({ variant: "success", email });
    } catch (error) {
      setShowPassword(false);
      resetPasswords();
      setForgotPasswordNotice({
        variant: "error",
        message: getErrorMessage(error, "forgotPassword.submitFailed"),
      });
      throw error;
    }
  }, [forgetPasswordMutation, getErrorMessage, resetPasswords, saved.email, t]);

  const handlePasswordSave = useCallback(async () => {
    const parsed = passwordSchema.safeParse(passwords);
    if (!parsed.success) {
      setPasswordSubmitAttempted(true);
      const first = parsed.error.flatten().fieldErrors;
      const msg =
        first.current?.[0] ??
        first.next?.[0] ??
        first.confirm?.[0] ??
        t("dashboard.viewerProfile.passwordChangeError");
      toast.error(msg);
      return;
    }

    const { current, next, confirm } = parsed.data;

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: current.trim(),
        password: next.trim(),
        confirmPassword: confirm.trim(),
      });
      resetPasswords();
      setShowPassword(false);
      setShowPasswordSuccessModal(true);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "dashboard.viewerProfile.passwordChangeError"),
      );
    }
  }, [
    changePasswordMutation,
    getErrorMessage,
    passwordSchema,
    passwords,
    resetPasswords,
    t,
  ]);

  const displayName = useMemo(() => displayCreatorName(form), [form]);

  return {
    form,
    displayName,
    avatarImage,
    setAvatarImage,
    isProfileChanged,
    passwords,
    showPassword,
    setShowPassword,
    showPasswordSuccessModal,
    setShowPasswordSuccessModal,
    onChange,
    onPasswordChange,
    handleCancel,
    handleSave,
    handlePasswordClose,
    handlePasswordSave,
    handleForgotPassword,
    forgotPasswordNotice,
    dismissForgotPasswordNotice,
    passwordFieldErrors,
    isSavingProfile: updateProfile.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isLoadingProfile: profileQuery.isLoading,
  };
};
