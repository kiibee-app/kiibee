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
import { emptyPasswords } from "@/utils/dummyData/profile.data";
import { PasswordState } from "@/utils/creatorProfile";
import { ViewerProfileField } from "@/utils/profile";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { FORM_MESSAGE_TONE } from "@/utils/ui";
import {
  EMPTY_VIEWER_BOOTSTRAP,
  subscribeViewerBootstrap,
  type ChangePasswordBody,
  type ChangePasswordResponse,
  type ForgotPwNotice,
  type ViewerBootstrap,
} from "@/utils/viewerProfile";
import { resolveProfileAvatarUrl } from "@/utils/image";

type ViewerProfileForm = {
  name: string;
  email: string;
};

type ViewerProfileResponseData = {
  id?: string;
  email?: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  role?: string;
  isEmailVerified?: boolean;
  status?: string;
  downloadsCount?: number;
};

type GetViewerProfileResponse = {
  success?: boolean;
  message?: string;
  data?: ViewerProfileResponseData;
};

export type UpdateViewerProfileBody = {
  fullName?: string;
  email?: string;
  avatarUrl?: string | null;
};

export type UpdateViewerProfileResponse = {
  success?: boolean;
  message?: string;
  data?: ViewerProfileResponseData;
};

export const useViewerProfile = () => {
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

  const [form, setForm] = useState<ViewerProfileForm>(() => ({
    name: EMPTY_VIEWER_BOOTSTRAP.name,
    email: EMPTY_VIEWER_BOOTSTRAP.email,
  }));
  const [saved, setSaved] = useState<ViewerProfileForm>(() => ({
    name: EMPTY_VIEWER_BOOTSTRAP.name,
    email: EMPTY_VIEWER_BOOTSTRAP.email,
  }));
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [downloadsCount, setDownloadsCount] = useState<number>(0);

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState<PasswordState>(emptyPasswords);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState<boolean>(false);
  const [showProfileSavedModal, setShowProfileSavedModal] = useState(false);
  const [forgotPwNotice, setForgotPwNotice] = useState<ForgotPwNotice>(null);
  const [passwordSubmitAttempted, setPasswordSubmitAttempted] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
    UpdateViewerProfileResponse,
    UpdateViewerProfileBody
  >(API.auth.userProfile);
  const changePasswordMutation = usePatchAPI<
    ChangePasswordResponse,
    ChangePasswordBody
  >(API.auth.changePassword);
  const forgetPasswordMutation = usePostAPI<
    ForgetPasswordResponse,
    ForgetPasswordPayload
  >(API.auth.forgetPassword);

  const profileQuery = useGetAPI<GetViewerProfileResponse>(
    API.auth.userProfile,
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    return subscribeViewerBootstrap((b: ViewerBootstrap) => {
      setForm({ name: b.name, email: b.email });
      setSaved({ name: b.name, email: b.email });
      setSavedAvatarUrl(b.avatarUrl);
      setAvatarImage(b.avatarUrl);
      setDownloadsCount(b.downloadsCount);
    });
  }, []);

  useEffect(() => {
    const profile = profileQuery.data?.data;
    if (!profile) return;

    queueMicrotask(() => {
      const nextName =
        typeof profile.fullName === "string" ? profile.fullName.trim() : "";
      const nextEmail =
        typeof profile.email === "string" ? profile.email.trim() : "";
      const nextAvatar =
        profile.avatarUrl === null
          ? null
          : typeof profile.avatarUrl === "string" &&
              profile.avatarUrl.length > 0
            ? profile.avatarUrl
            : null;
      const nextDownloads = Number(profile.downloadsCount ?? 0);
      const safeDownloads = Number.isFinite(nextDownloads) ? nextDownloads : 0;

      if (!isProfileChangedRef.current) {
        const nextForm: ViewerProfileForm = {
          name: nextName,
          email: nextEmail,
        };
        setForm(nextForm);
        setSaved(nextForm);
        setAvatarImage(nextAvatar);
        setSavedAvatarUrl(nextAvatar);
      }
      setDownloadsCount(safeDownloads);

      mergeStoredLoginUser({
        fullName: nextName,
        email: nextEmail,
        avatarUrl: nextAvatar,
        downloadsCount: safeDownloads,
      });
    });
  }, [profileQuery.data]);

  const onChange = useCallback(
    (key: ViewerProfileField) => (value: string | string[]) => {
      setForm((prev) => ({
        ...prev,
        [key]: String(value),
      }));
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

  const handleSave = async () => {
    if (!isProfileChanged || updateProfile.isPending || isUploadingAvatar) {
      return;
    }

    const patchBody: UpdateViewerProfileBody = {};
    if (form.name.trim() !== saved.name.trim()) {
      patchBody.fullName = form.name.trim();
    }
    if (form.email.trim().toLowerCase() !== saved.email.trim().toLowerCase()) {
      patchBody.email = form.email.trim().toLowerCase();
    }

    let uploadedAvatarUrl: string | null | undefined;
    if (avatarDirty) {
      setIsUploadingAvatar(true);
      try {
        uploadedAvatarUrl = await resolveProfileAvatarUrl(avatarImage);
        patchBody.avatarUrl = uploadedAvatarUrl;
      } catch (error) {
        toast.error(
          getErrorMessage(error, "dashboard.viewerProfile.saveError"),
        );
        return;
      } finally {
        setIsUploadingAvatar(false);
      }
    }

    const needsPatch = Object.keys(patchBody).length > 0;

    try {
      if (needsPatch) {
        const res = await updateProfile.mutateAsync(patchBody);

        const data = res.data;
        const nextName =
          typeof data?.fullName === "string" && data.fullName.trim().length > 0
            ? data.fullName.trim()
            : form.name.trim();
        const nextAvatar =
          data?.avatarUrl === null
            ? null
            : typeof data?.avatarUrl === "string" && data.avatarUrl.length > 0
              ? data.avatarUrl
              : (uploadedAvatarUrl ?? avatarImage ?? null);

        const nextForm: ViewerProfileForm = {
          name: nextName,
          email:
            typeof data?.email === "string" && data.email.trim().length > 0
              ? data.email.trim()
              : form.email.trim(),
        };

        setSaved(nextForm);
        setForm(nextForm);
        setSavedAvatarUrl(nextAvatar);
        setAvatarImage(nextAvatar);

        mergeStoredLoginUser({
          fullName: nextName,
          email: nextForm.email,
          avatarUrl: nextAvatar,
        });

        setShowProfileSavedModal(true);
      } else {
        setSaved(form);
        setShowProfileSavedModal(true);
      }

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

  return {
    form,
    avatarImage,
    setAvatarImage,
    downloadsCount,
    isProfileChanged,
    passwords,
    showPassword,
    setShowPassword,
    showPasswordSuccessModal,
    setShowPasswordSuccessModal,
    showProfileSavedModal,
    setShowProfileSavedModal,
    onChange,
    onPasswordChange,
    handleSave,
    handlePasswordClose,
    handlePasswordSave,
    handleForgotPassword,
    forgotPwNotice,
    dismissForgotPwNotice,
    passwordFieldErrors,
    isSavingProfile: updateProfile.isPending || isUploadingAvatar,
    isChangingPassword: changePasswordMutation.isPending,
    isLoadingProfile: profileQuery.isLoading,
  };
};
