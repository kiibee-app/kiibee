"use client";

import { useState } from "react";
import { getPostLoginPath, useLogin } from "./useLogin";
import { useAuthSession } from "./useAuthSession";
import { useAuthForm } from "./useAuthForm";
import { loginFormBase } from "./authFormConfigs";
import {
  AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
  REMEMBERED_AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth/storageKeys";

export function useLoginForm() {
  const { setSession } = useAuthSession();
  const [remember, setRemember] = useState(false);
  const form = useAuthForm({
    ...loginFormBase,
    useMutation: useLogin,
    onSuccess: (response, { router }) => {
      setSession(response);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("authForm.errors.emailRequired"),
        emailInvalid: t("authForm.errors.emailInvalid"),
        passwordRequired: t("authForm.errors.passwordRequired"),
      }),
    [t],
  );

  type LoginFormValues = ReturnType<typeof schema.parse>;

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { isValid },
  } = methods;

  const handleFieldChange = (field: keyof LoginFormValues, value: string) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    clearErrors(field);
    if (formError) setFormError("");
  };

  const togglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setFormError("");

    try {
      const response = await login(values);

      if (response.success === false) {
        setFormError(response.message || t("authForm.errors.submitFailed"));
        return;
      }

      setSession(response, {
        maxAgeSeconds: remember
          ? REMEMBERED_AUTH_SESSION_COOKIE_MAX_AGE_SECONDS
          : AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
      });
      router.push(getPostLoginPath(response));
    },
  });

  return {
    ...form,
    remember,
    setRemember,
    handleFieldChange: form.updateField,
    isPasswordVisible: form.passwordVisibility as boolean,
    togglePassword: form.togglePassword,
  };
}
