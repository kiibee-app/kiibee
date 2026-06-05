"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { mergeStoredLoginUser } from "@/hooks/auth/useLogin";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { usePatchAPI } from "@/lib/http/api/patchApi";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { useProfileBase } from "@/hooks/useProfileBase";
import { ViewerProfileField } from "@/utils/profile";
import {
  EMPTY_VIEWER_BOOTSTRAP,
  subscribeViewerBootstrap,
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
  const { getErrorMessage } = useApiErrorMessage();

  const [form, setForm] = useState<ViewerProfileForm>(() => ({
    name: EMPTY_VIEWER_BOOTSTRAP.name,
    email: EMPTY_VIEWER_BOOTSTRAP.email,
  }));
  const [saved, setSaved] = useState<ViewerProfileForm>(() => ({
    name: EMPTY_VIEWER_BOOTSTRAP.name,
    email: EMPTY_VIEWER_BOOTSTRAP.email,
  }));
  const [downloadsCount, setDownloadsCount] = useState<number>(0);
  const [showProfileSavedModal, setShowProfileSavedModal] = useState(false);

  const base = useProfileBase({
    form,
    saved,
    savedEmail: saved.email,
  });

  const { isProfileChangedRef, setAvatarImage, setSavedAvatarUrl } = base;

  const updateProfile = usePatchAPI<
    UpdateViewerProfileResponse,
    UpdateViewerProfileBody
  >(API.auth.userProfile);

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
  }, [setAvatarImage, setSavedAvatarUrl]);

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
  }, [
    profileQuery.data,
    isProfileChangedRef,
    setAvatarImage,
    setSavedAvatarUrl,
  ]);

  const onChange = useCallback(
    (key: ViewerProfileField) => (value: string | string[]) => {
      setForm((prev) => ({
        ...prev,
        [key]: String(value),
      }));
    },
    [],
  );

  const handleSave = async () => {
    if (
      !base.isProfileChanged ||
      updateProfile.isPending ||
      base.isUploadingAvatar
    ) {
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
    if (base.avatarDirty) {
      base.setIsUploadingAvatar(true);
      try {
        uploadedAvatarUrl = await resolveProfileAvatarUrl(base.avatarImage);
        patchBody.avatarUrl = uploadedAvatarUrl;
      } catch (error) {
        toast.error(
          getErrorMessage(error, "dashboard.viewerProfile.saveError"),
        );
        return;
      } finally {
        base.setIsUploadingAvatar(false);
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
              : (uploadedAvatarUrl ?? base.avatarImage ?? null);

        const nextForm: ViewerProfileForm = {
          name: nextName,
          email:
            typeof data?.email === "string" && data.email.trim().length > 0
              ? data.email.trim()
              : form.email.trim(),
        };

        setSaved(nextForm);
        setForm(nextForm);
        base.setSavedAvatarUrl(nextAvatar);
        base.setAvatarImage(nextAvatar);

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

      base.resetPasswords();
      base.setShowPassword(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "dashboard.viewerProfile.saveError"));
    }
  };

  return {
    form,
    avatarImage: base.avatarImage,
    setAvatarImage: base.setAvatarImage,
    downloadsCount,
    isProfileChanged: base.isProfileChanged,
    passwords: base.passwords,
    showPassword: base.showPassword,
    setShowPassword: base.setShowPassword,
    showPasswordSuccessModal: base.showPasswordSuccessModal,
    setShowPasswordSuccessModal: base.setShowPasswordSuccessModal,
    showProfileSavedModal,
    setShowProfileSavedModal,
    onChange,
    onPasswordChange: base.onPasswordChange,
    handleSave,
    handlePasswordClose: base.handlePasswordClose,
    handlePasswordSave: base.handlePasswordSave,
    handleForgotPassword: base.handleForgotPassword,
    forgotPwNotice: base.forgotPwNotice,
    dismissForgotPwNotice: base.dismissForgotPwNotice,
    passwordFieldErrors: base.passwordFieldErrors,
    isSavingProfile: updateProfile.isPending || base.isUploadingAvatar,
    isChangingPassword: base.isChangingPassword,
    isLoadingProfile: profileQuery.isLoading,
    canSubmitPassword: base.canSubmitPassword,
  };
};
