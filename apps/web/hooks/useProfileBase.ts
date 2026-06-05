"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import type {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
} from "@/hooks/auth/useForgetPassword";
import { API } from "@/lib/http/api/endpoints";
import { usePatchAPI } from "@/lib/http/api/patchApi";
import { usePostAPI } from "@/lib/http/api/postApi";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { createResetPasswordSchema } from "@/lib/validation/schema";
import { emptyPasswords } from "@/utils/dummyData/profile.data";
import { PasswordState } from "@/utils/creatorProfile";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { FORM_MESSAGE_TONE } from "@/utils/ui";
import {
  type ChangePasswordBody,
  type ChangePasswordResponse,
  type ForgotPwNotice,
} from "@/utils/viewerProfile";

type UseProfileBaseOptions<FormType> = {
  form: FormType;
  saved: FormType;
  savedEmail: string;
};

export const useProfileBase = <FormType>({
  form,
  saved,
  savedEmail,
}: UseProfileBaseOptions<FormType>) => {
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

  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState<PasswordState>(emptyPasswords);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState(false);
  const [forgotPwNotice, setForgotPwNotice] = useState<ForgotPwNotice>(null);
  const [passwordSubmitAttempted, setPasswordSubmitAttempted] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<keyof PasswordState, boolean>>
  >({});

  const passwordFieldErrors = useMemo(() => {
    const shouldShowError = (field: keyof PasswordState) =>
      touched[field] || passwordSubmitAttempted;

    const parsed = passwordSchema.safeParse(passwords);

    if (parsed.success) {
      return {} as Partial<Record<keyof PasswordState, string>>;
    }

    const fe = parsed.error.flatten().fieldErrors;

    return (Object.keys(passwords) as (keyof PasswordState)[]).reduce(
      (acc, key) => {
        acc[key] = shouldShowError(key) ? fe[key]?.[0] : undefined;
        return acc;
      },
      {} as Partial<Record<keyof PasswordState, string>>,
    );
  }, [passwordSchema, passwords, touched, passwordSubmitAttempted]);

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

  const changePasswordMutation = usePatchAPI<
    ChangePasswordResponse,
    ChangePasswordBody
  >(API.auth.changePassword);
  const forgetPasswordMutation = usePostAPI<
    ForgetPasswordResponse,
    ForgetPasswordPayload
  >(API.auth.forgetPassword);

  const onPasswordChange = useCallback(
    (field: keyof PasswordState, value?: string) => {
      setPasswords((prev) => ({
        ...prev,
        [field]: value ?? "",
      }));

      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    },
    [],
  );

  const resetPasswords = useCallback(() => {
    setPasswords(emptyPasswords);
    setPasswordSubmitAttempted(false);
  }, []);

  const handlePasswordClose = useCallback(() => {
    setShowPassword(false);
    resetPasswords();
  }, [resetPasswords]);

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

  const dismissForgotPwNotice = useCallback(() => {
    setForgotPwNotice(null);
  }, []);

  const handleForgotPassword = useCallback(async () => {
    const email = savedEmail.trim().toLowerCase();
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
  }, [forgetPasswordMutation, getErrorMessage, resetPasswords, savedEmail, t]);

  const { current: pwCurrent, next: pwNext, confirm: pwConfirm } = passwords;

  const isPasswordFilled = useMemo(() => {
    return (
      pwCurrent.trim().length > 0 &&
      pwNext.trim().length > 0 &&
      pwConfirm.trim().length > 0
    );
  }, [pwCurrent, pwNext, pwConfirm]);

  const isPasswordFormValid = useMemo(() => {
    return passwordSchema.safeParse(passwords).success;
  }, [passwordSchema, passwords]);

  const canSubmitPassword = isPasswordFilled && isPasswordFormValid;

  return {
    passwords,
    showPassword,
    setShowPassword,
    showPasswordSuccessModal,
    setShowPasswordSuccessModal,
    forgotPwNotice,
    passwordFieldErrors,
    avatarImage,
    setAvatarImage,
    savedAvatarUrl,
    setSavedAvatarUrl,
    avatarDirty,
    isUploadingAvatar,
    setIsUploadingAvatar,
    isProfileChanged,
    isProfileChangedRef,
    onPasswordChange,
    resetPasswords,
    handlePasswordClose,
    handlePasswordSave,
    handleForgotPassword,
    dismissForgotPwNotice,
    isPasswordFilled,
    isPasswordFormValid,
    canSubmitPassword,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
