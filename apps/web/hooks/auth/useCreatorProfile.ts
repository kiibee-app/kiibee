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
import {
  applyCreatorProfileResponseToForm,
  buildCreatorProfilePatchBody,
  displayCreatorName,
  EMPTY_CREATOR_PROFILE_FORM,
  getAvatarUrl,
  PasswordState,
  toOptionalString,
  type ProfileForm,
} from "@/utils/creatorProfile";
import {
  mapCreatorProfileToForm,
  type GetCreatorProfileResponse,
  type UpdateCreatorProfileBody,
  type UpdateCreatorProfileResponse,
} from "@/hooks/auth/creatorProfileApi";
import { emptyPasswords } from "@/utils/dummyData/profile.data";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { FORM_MESSAGE_TONE } from "@/utils/ui";
import {
  type ChangePasswordBody,
  type ChangePasswordResponse,
  type ForgotPwNotice,
} from "@/utils/viewerProfile";
import { sanitizeDigitsOnlyField } from "@/utils/numericInput";

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
  const [forgotPwNotice, setForgotPwNotice] = useState<ForgotPwNotice>(null);
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
      const nextAvatar = getAvatarUrl(profile.user?.avatarUrl);

      if (!isProfileChangedRef.current) {
        setForm(nextForm);
        setSaved(nextForm);
        setAvatarImage(nextAvatar);
        setSavedAvatarUrl(nextAvatar);
      }

      mergeStoredLoginUser({
        fullName: toOptionalString(displayCreatorName(nextForm)),
        email: toOptionalString(nextForm.email),
        avatarUrl: nextAvatar,
        firstName: toOptionalString(nextForm.firstName),
        lastName: toOptionalString(nextForm.lastName),
      });
    });
  }, [profileQuery.data]);

  const onChange = useCallback(
    (key: keyof ProfileForm) => (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : String(value);
      const nextValue =
        key === "phone" || key === "cvr" || key === "postal"
          ? sanitizeDigitsOnlyField(key === "postal" ? "postal" : key, text)
          : text;
      setForm((prev) => ({ ...prev, [key]: nextValue }));
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
      return false;
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
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error, "dashboard.viewerProfile.passwordChangeError"),
      );
      return false;
    }
  }, [
    changePasswordMutation,
    getErrorMessage,
    passwordSchema,
    passwords,
    resetPasswords,
    t,
  ]);

  const handleSave = async () => {
    if (!isProfileChanged || updateProfile.isPending) return;

    const hasPasswordInput = Object.values(passwords).some(Boolean);
    const patchBody = buildCreatorProfilePatchBody(
      form,
      saved,
      avatarDirty,
      avatarImage,
    );

    if (Object.keys(patchBody).length === 0) {
      if (hasPasswordInput) {
        await handlePasswordSave();
        return;
      }
      setSaved(form);
      resetPasswords();
      setShowPassword(false);
      return;
    }

    try {
      const res = await updateProfile.mutateAsync(patchBody);
      const data = res.data;

      const nextForm = applyCreatorProfileResponseToForm(form, data);

      const nextAvatar =
        data?.avatarUrl !== undefined
          ? getAvatarUrl(data.avatarUrl)
          : avatarDirty
            ? (avatarImage ?? null)
            : savedAvatarUrl;

      setSaved(nextForm);
      setForm(nextForm);
      setSavedAvatarUrl(nextAvatar);
      setAvatarImage(nextAvatar);

      const displayName = displayCreatorName(nextForm);
      mergeStoredLoginUser({
        fullName: toOptionalString(displayName),
        email: toOptionalString(nextForm.email),
        avatarUrl: nextAvatar,
        firstName: toOptionalString(nextForm.firstName),
        lastName: toOptionalString(nextForm.lastName),
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

  const dismissForgotPwNotice = useCallback(() => {
    setForgotPwNotice(null);
  }, []);

  const handleForgotPassword = useCallback(async () => {
    const email = saved.email.trim().toLowerCase();
    if (!email) {
      setShowPassword(false);
      resetPasswords();
      setForgotPwNotice({
        variant: FORM_MESSAGE_TONE.ERROR,
        message: t("dashboard.viewerProfile.forgotPasswordNoEmail"),
      });
      throw new Error("missing-email");
    }
    try {
      await forgetPasswordMutation.mutateAsync({ email });
      setShowPassword(false);
      resetPasswords();
      setForgotPwNotice({
        variant: FORM_MESSAGE_TONE.SUCCESS,
        email,
      });
    } catch (error) {
      setShowPassword(false);
      resetPasswords();
      setForgotPwNotice({
        variant: FORM_MESSAGE_TONE.ERROR,
        message: getErrorMessage(error, "forgotPassword.submitFailed"),
      });
      throw error;
    }
  }, [forgetPasswordMutation, getErrorMessage, resetPasswords, saved.email, t]);

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
    forgotPwNotice,
    dismissForgotPwNotice,
    passwordFieldErrors,
    isSavingProfile: updateProfile.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isLoadingProfile: profileQuery.isLoading,
  };
};
