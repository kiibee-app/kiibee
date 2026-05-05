"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import InputField from "@/components/UI/InputFields";
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
import { useLoginFormSchema } from "@/utils/useLoginFormSchema";
import type { LoginFormErrors } from "@/utils/authLoginFormSchema";
import { ALERT } from "@/utils/common";
import {
  getPostLoginPath,
  persistLoginSession,
  useLogin,
} from "@/hooks/auth/useLogin";
import { PATHS } from "@/utils/path";
import { INPUT_TYPE } from "@/utils/ui";

export default function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState("");
  const loginSchema = useLoginFormSchema();
  const { mutateAsync: login, isPending } = useLogin();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedValues = loginSchema.safeParse({
      email,
      password,
    });

    if (!parsedValues.success) {
      const flattenedErrors = parsedValues.error.flatten().fieldErrors;
      if (isMounted.current) {
        setFieldErrors({
          email: flattenedErrors.email?.[0],
          password: flattenedErrors.password?.[0],
        });
        setFormError(t("authForm.errors.fixHighlightedFields"));
      }
      return;
    }

    if (isMounted.current) {
      setFormError("");
      setFieldErrors({});
    }

    try {
      const response = await login(parsedValues.data);

      if (response.success === false) {
        if (isMounted.current) {
          setFormError(response.message || t("authForm.errors.submitFailed"));
        }
        return;
      }

      persistLoginSession(response);
      router.push(getPostLoginPath(response));
    } catch (error) {
      if (isMounted.current) {
        setFormError(
          error instanceof Error
            ? error.message
            : t("authForm.errors.submitFailed"),
        );
      }
    }
  };

  const handleEmailChange = (nextValue: string) => {
    setEmail(nextValue);
    if (fieldErrors.email || formError) {
      if (isMounted.current) {
        setFieldErrors((prev) => ({ ...prev, email: undefined }));
        setFormError("");
      }
    }
  };

  const handlePasswordChange = (nextValue: string) => {
    setPassword(nextValue);
    if (fieldErrors.password || formError) {
      if (isMounted.current) {
        setFieldErrors((prev) => ({ ...prev, password: undefined }));
        setFormError("");
      }
    }
  };

  return (
    <Wrapper>
      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
        <Title>
          <MonoText $use="H4_Medium">{t("authForm.title")}</MonoText>
        </Title>
        <Form onSubmit={handleSubmit}>
          <InputField
            id="login-email"
            type="email"
            placeholder={t("authForm.emailLabel")}
            value={email}
            onChange={(nextValue) => handleEmailChange(nextValue as string)}
            autoComplete="email"
            hasError={Boolean(fieldErrors.email)}
            errorText={fieldErrors.email}
          />
          <InputField
            id="login-password"
            type={isPasswordVisible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
            placeholder={t("authForm.passwordLabel")}
            value={password}
            onChange={(nextValue) => handlePasswordChange(nextValue as string)}
            autoComplete="current-password"
            icon={isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
            onIconClick={() => setIsPasswordVisible((prev) => !prev)}
            hasError={Boolean(fieldErrors.password)}
            errorText={fieldErrors.password}
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
            disabled={isPending}
          >
            {t("authForm.submit")}
          </GenericButton>
        </Form>
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
