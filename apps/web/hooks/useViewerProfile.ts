"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { mergeStoredLoginUser, type LoginUser } from "@/hooks/auth/useLogin";
import { API } from "@/lib/http/api/endpoints";
import { useGetAPI } from "@/lib/http/api/getApi";
import { usePatchAPI } from "@/lib/http/api/patchApi";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { AUTH_STORAGE_KEYS } from "@/lib/auth/authSession";
import { emptyPasswords } from "@/utils/dummyData/profile.data";
import { PasswordState } from "@/utils/creatorProfile";
import { ViewerProfileField } from "@/utils/profile";

const IMAGE_DATA_PREFIX = /^data:image\//;

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

  const bootstrap = useMemo(() => readViewerBootstrapFromStorage(), []);
  const initialForm = useMemo<ViewerProfileForm>(
    () => ({ name: bootstrap.name, email: bootstrap.email }),
    [bootstrap.email, bootstrap.name],
  );

  const [form, setForm] = useState<ViewerProfileForm>(initialForm);
  const [saved, setSaved] = useState<ViewerProfileForm>(initialForm);
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(
    bootstrap.avatarUrl,
  );
  const [avatarImage, setAvatarImage] = useState<string | null>(
    bootstrap.avatarUrl,
  );
  const [downloadsCount, setDownloadsCount] = useState<number>(
    bootstrap.downloadsCount,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState<PasswordState>(emptyPasswords);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState<boolean>(false);
  const [showProfileSavedModal, setShowProfileSavedModal] = useState(false);

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
  const profileQuery = useGetAPI<GetViewerProfileResponse>(
    API.auth.userProfile,
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
  }, []);

  const handleSave = async () => {
    if (!isProfileChanged || updateProfile.isPending) return;

    const patchBody: UpdateViewerProfileBody = {};
    if (form.name.trim() !== saved.name.trim()) {
      patchBody.fullName = form.name.trim();
    }
    if (form.email.trim().toLowerCase() !== saved.email.trim().toLowerCase()) {
      patchBody.email = form.email.trim().toLowerCase();
    }
    if (avatarDirty) {
      patchBody.avatarUrl = avatarImage ?? null;
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
              : (avatarImage ?? null);

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
    setShowPasswordSuccessModal(true);
  }, [resetPasswords]);

  const handlePasswordSave = useCallback(() => {
    resetPasswords();
    setShowPassword(false);
  }, [resetPasswords]);

  const isPasswordFormValid = useMemo(() => {
    return Object.values(passwords).every((val) => val.trim().length > 0);
  }, [passwords]);

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
    isPasswordFormValid,
    isSavingProfile: updateProfile.isPending,
    isLoadingProfile: profileQuery.isLoading,
  };
};

const readViewerBootstrapFromStorage = () => {
  if (typeof window === "undefined") {
    return {
      name: "",
      email: "",
      avatarUrl: null as string | null,
      downloadsCount: 0,
    };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEYS.user);
    const user = raw ? (JSON.parse(raw) as LoginUser) : null;

    const name =
      typeof user?.fullName === "string" && user.fullName.trim().length > 0
        ? user.fullName.trim()
        : "";
    const email =
      typeof user?.email === "string" && user.email.trim().length > 0
        ? user.email.trim()
        : "";
    const avatarUrl =
      typeof user?.avatarUrl === "string" &&
      user.avatarUrl.trim().length > 0 &&
      IMAGE_DATA_PREFIX.test(user.avatarUrl)
        ? user.avatarUrl.trim()
        : null;
    const downloadsCount = Number(user?.downloadsCount ?? 0);

    return {
      name,
      email,
      avatarUrl,
      downloadsCount: Number.isFinite(downloadsCount) ? downloadsCount : 0,
    };
  } catch {
    return {
      name: "",
      email: "",
      avatarUrl: null as string | null,
      downloadsCount: 0,
    };
  }
};
