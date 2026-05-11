"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import FormField from "@/components/UI/FormField";
import {
  Card,
  FormMessage,
  FooterText,
  Form,
  OptionsRow,
  RememberLabel,
  SignUpLink,
  Title,
  Wrapper,
  ForgotLink,
} from "./styles";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import Image from "@/components/UI/SafeImage";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { createLoginSchema } from "@/lib/validation/schema";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { ALERT } from "@/utils/common";
import { getPostLoginPath, useLogin } from "@/hooks/auth/useLogin";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { PATHS } from "@/utils/path";
import { INPUT_TYPE } from "@/utils/ui";

export default function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [formError, setFormError] = useState("");
  const { getErrorMessage, applyFieldErrors } = useApiErrorMessage();
  const { mutateAsync: login, isPending } = useLogin();
  const { setSession } = useAuthSession();
  const loginSchema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("authForm.errors.emailRequired"),
        emailInvalid: t("authForm.errors.emailInvalid"),
        passwordRequired: t("authForm.errors.passwordRequired"),
      }),
    [t],
  );
  type LoginFormValues = ReturnType<typeof loginSchema.parse>;
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    setError,
    formState: { isValid },
    clearErrors,
  } = methods;

  const onSubmit = async (values: LoginFormValues) => {
    setFormError("");
    try {
      const response = await login(values);

      if (response.success === false) {
        setFormError(response.message || t("authForm.errors.submitFailed"));
        return;
      }

      setSession(response);
      router.push(getPostLoginPath(response));
    } catch (error) {
      applyFieldErrors(error, setError);
      setFormError(getErrorMessage(error, "authForm.errors.submitFailed"));
    }
  };

  const handleFieldChange = (field: "email" | "password", value: string) => {
    methods.setValue(field, value, { shouldValidate: true, shouldDirty: true });
    clearErrors(field);
    if (formError) {
      setFormError("");
    }
  };

  return (
    <Wrapper>
      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
        <Title>
          <MonoText $use="H4_Medium">{t("authForm.title")}</MonoText>
        </Title>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormField<LoginFormValues>
              id="login-email"
              name="email"
              type="email"
              placeholder={t("authForm.emailLabel")}
              onChange={(nextValue) =>
                handleFieldChange("email", String(nextValue))
              }
              autoComplete="email"
            />
            <FormField<LoginFormValues>
              id="login-password"
              name="password"
              type={isPasswordVisible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
              placeholder={t("authForm.passwordLabel")}
              onChange={(nextValue) =>
                handleFieldChange("password", String(nextValue))
              }
              autoComplete="current-password"
              icon={isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
              onIconClick={() => setIsPasswordVisible((prev) => !prev)}
            />
            <OptionsRow>
              <RememberLabel>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((prev) => !prev)}
                />
                {t("authForm.remember")}
              </RememberLabel>
            </OptionsRow>
            {formError && <FormMessage role={ALERT}>{formError}</FormMessage>}
            <GenericButton
              type="submit"
              isLoading={isPending}
              disabled={!isValid}
            >
              {t("authForm.submit")}
            </GenericButton>
          </Form>
        </FormProvider>
        <ForgotLink href="/auth/forget-password">
          <MonoText $use="Body_Small">{t("authForm.forgot")}</MonoText>
        </ForgotLink>
        <FooterText>
          <MonoText $use="Body_Medium"> {t("authForm.footer")}</MonoText>
          <SignUpLink href={PATHS.AUTH_SIGNUP}>
            <MonoText $use="Body_Medium">{t("authForm.signUp")}</MonoText>
          </SignUpLink>
        </FooterText>
      </Card>
    </Wrapper>
  );
}
