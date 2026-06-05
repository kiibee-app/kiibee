"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { mergeStoredLoginUser } from "@/hooks/auth/useLogin";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { usePatchAPI } from "@/lib/http/api/patchApi";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import {
  applyCreatorProfileResponseToForm,
  buildCreatorProfilePatchBody,
  displayCreatorName,
  EMPTY_CREATOR_PROFILE_FORM,
  getAvatarUrl,
  toOptionalString,
  type ProfileForm,
} from "@/utils/creatorProfile";
import { resolveProfileAvatarUrl } from "@/utils/image";
import {
  mapCreatorProfileToForm,
  type GetCreatorProfileResponse,
  type UpdateCreatorProfileBody,
  type UpdateCreatorProfileResponse,
} from "@/hooks/auth/creatorProfileApi";
import { useProfileBase } from "@/hooks/useProfileBase";
import {
  applyDigitsOnlyInput,
  CREATOR_PROFILE_DIGITS_ONLY_SET,
} from "@/utils/numericFields";

export const useCreatorProfile = () => {
  const { t } = useTranslation();
  const { getErrorMessage } = useApiErrorMessage();

  const [form, setForm] = useState<ProfileForm>(EMPTY_CREATOR_PROFILE_FORM);
  const [saved, setSaved] = useState<ProfileForm>(EMPTY_CREATOR_PROFILE_FORM);

  const base = useProfileBase({
    form,
    saved,
    savedEmail: saved.email,
  });

  const { isProfileChangedRef, setAvatarImage, setSavedAvatarUrl } = base;

  const updateProfile = usePatchAPI<
    UpdateCreatorProfileResponse,
    UpdateCreatorProfileBody
  >(API.auth.creatorProfile);

  const queryClient = useQueryClient();
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
  }, [
    profileQuery.data,
    isProfileChangedRef,
    setAvatarImage,
    setSavedAvatarUrl,
  ]);

  const onChange = useCallback(
    (key: keyof ProfileForm) => (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : String(value);
      setForm((prev) => ({
        ...prev,
        [key]: applyDigitsOnlyInput(key, text, CREATOR_PROFILE_DIGITS_ONLY_SET),
      }));
    },
    [],
  );

  const handleCancel = useCallback(() => {
    setForm(saved);
    setAvatarImage(base.savedAvatarUrl);
    base.resetPasswords();
    base.setShowPassword(false);
  }, [base, saved, setAvatarImage]);

  const handleSave = async () => {
    if (
      !base.isProfileChanged ||
      updateProfile.isPending ||
      base.isUploadingAvatar
    ) {
      return;
    }

    const hasPasswordInput = Object.values(base.passwords).some(Boolean);

    let avatarForPatch: string | null = base.avatarImage;
    if (base.avatarDirty) {
      base.setIsUploadingAvatar(true);
      try {
        avatarForPatch = await resolveProfileAvatarUrl(base.avatarImage);
      } catch (error) {
        toast.error(
          getErrorMessage(error, "dashboard.viewerProfile.saveError"),
        );
        return;
      } finally {
        base.setIsUploadingAvatar(false);
      }
    }

    const patchBody = buildCreatorProfilePatchBody(
      form,
      saved,
      base.avatarDirty,
      avatarForPatch,
    );

    if (Object.keys(patchBody).length === 0) {
      if (hasPasswordInput) {
        await base.handlePasswordSave();
        return;
      }
      setSaved(form);
      base.resetPasswords();
      base.setShowPassword(false);
      return;
    }

    try {
      const res = await updateProfile.mutateAsync(patchBody);
      const data = res.data;

      const nextForm = applyCreatorProfileResponseToForm(form, data);

      const nextAvatar =
        data?.avatarUrl !== undefined
          ? getAvatarUrl(data.avatarUrl)
          : base.avatarDirty
            ? (avatarForPatch ?? null)
            : base.savedAvatarUrl;

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

      void queryClient.invalidateQueries({
        queryKey: [API.auth.creatorProfile],
      });

      toast.success(t("dashboard.viewerProfile.saveSuccess"));
      base.resetPasswords();
      base.setShowPassword(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "dashboard.viewerProfile.saveError"));
    }
  };

  const displayName = useMemo(() => displayCreatorName(form), [form]);

  return {
    form,
    displayName,
    avatarImage: base.avatarImage,
    setAvatarImage: base.setAvatarImage,
    isProfileChanged: base.isProfileChanged,
    passwords: base.passwords,
    showPassword: base.showPassword,
    setShowPassword: base.setShowPassword,
    showPasswordSuccessModal: base.showPasswordSuccessModal,
    setShowPasswordSuccessModal: base.setShowPasswordSuccessModal,
    onChange,
    onPasswordChange: base.onPasswordChange,
    handleCancel,
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
