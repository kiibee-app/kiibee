"use client";

import { useCallback, useMemo, useState } from "react";
import {
  emptyPasswords,
  viewerProfileData,
} from "@/utils/dummyData/profile.data";
import { PasswordState } from "@/utils/creatorProfile";
import { ViewerProfileField } from "@/utils/profile";

export const useViewerProfile = () => {
  const { name, email } = viewerProfileData;
  const initialForm = useMemo(
    () => ({
      name,
      email,
    }),
    [name, email],
  );

  const [form, setForm] = useState(initialForm);
  const [saved, setSaved] = useState(initialForm);

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState<PasswordState>(emptyPasswords);
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] =
    useState<boolean>(false);

  const dirty = useMemo(() => {
    const formChanged = JSON.stringify(form) !== JSON.stringify(saved);
    const passwordChanged = Object.values(passwords).some(Boolean);
    return formChanged || passwordChanged;
  }, [form, saved, passwords]);

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

  const handleSave = useCallback(() => {
    if (!dirty) return;

    setSaved(form);
    resetPasswords();
    setShowPassword(false);
  }, [dirty, form, resetPasswords]);

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
    dirty,
    passwords,
    showPassword,
    setShowPassword,
    showPasswordSuccessModal,
    setShowPasswordSuccessModal,
    onChange,
    onPasswordChange,
    handleSave,
    handlePasswordClose,
    handlePasswordSave,
    isPasswordFormValid,
  };
};
