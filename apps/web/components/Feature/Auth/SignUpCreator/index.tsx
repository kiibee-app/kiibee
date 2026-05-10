"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useCreatorRequest } from "@/hooks/auth/useCreatorRequest";
import FormField from "@/components/UI/FormField";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import {
  ADDRESS_FIELDS,
  CONTACT_FIELDS,
  CONTENT_FIELD,
  CreatorFieldConfig,
  EMAIL_FIELD,
  NAME_FIELDS,
  WORK_LINK_FIELD,
} from "@/utils/authCreatorForm";
import {
  Checkbox,
  CheckboxRow,
  ConsentText,
  ContentWrap,
  Form,
  FormIntro,
  FormMessage,
  FormTitle,
  FullRow,
  Grid,
  HelpText,
  LinkRow,
  LoginLink,
  LogoWrap,
  SubmitButton,
  TernaryRow,
  TermsLink,
} from "./styles";
import Image from "@/components/UI/SafeImage";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import { MonoText } from "@/components/UI/Monotext";
import { ALERT } from "@/utils/common";
import { PATHS } from "@/utils/path";
import { createCreatorRequestSchema } from "@/lib/validation/schema";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";

export default function SignUpCreatorSection() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formMessage, setFormMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "success">("error");
  const { getErrorMessage, applyFieldErrors } = useApiErrorMessage();
  const creatorRequest = useCreatorRequest();
  const schema = useMemo(
    () =>
      createCreatorRequestSchema({
        firstNameRequired: t("authCreator.form.firstName"),
        lastNameRequired: t("authCreator.form.lastName"),
        emailRequired: t("authForm.errors.emailRequired"),
        emailInvalid: t("authForm.errors.emailInvalid"),
        addressRequired: t("authCreator.form.address"),
        cityRequired: t("authCreator.form.city"),
        postalCodeRequired: t("authCreator.form.postalCode"),
        workLinkRequired: t("authCreator.form.workLink"),
        workLinkInvalid: t("authCreator.form.workLinkInvalid"),
        contentDescriptionRequired: t("authCreator.form.contentLabel"),
        consentRequired: t("authCreator.form.consentPrefix"),
      }),
    [t],
  );
  type CreatorRequestValues = ReturnType<typeof schema.parse>;
  const methods = useForm<CreatorRequestValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      cvr: "",
      address: "",
      city: "",
      postalCode: "",
      workLink: "",
      contentDescription: "",
      agreed: false,
    },
  });
  const {
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { isValid, errors },
  } = methods;
  const agreedValue = useWatch({
    control: methods.control,
    name: "agreed",
    defaultValue: false,
  });

  const updateField = (
    field: keyof CreatorRequestValues,
    value: string | boolean,
  ) => {
    setValue(field, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setFormMessage("");
  };

  const onSubmit = async (values: CreatorRequestValues) => {
    try {
      const response = await creatorRequest.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim() || undefined,
        cvr: values.cvr.trim() || undefined,
        address: values.address.trim(),
        city: values.city.trim(),
        postalCode: values.postalCode.trim(),
        exampleWorkLink: values.workLink.trim(),
        contentDescription: values.contentDescription.trim(),
      });

      if (!response.success) {
        throw new Error(response.message || t("authForm.errors.submitFailed"));
      }

      toast.success(
        response.message || "Creator application submitted successfully",
      );
      setMessageTone("success");
      setFormMessage(
        response.message || "Creator application submitted successfully",
      );
      reset();
      router.push(PATHS.AUTH_CREATOR_REQUEST_SENT);
    } catch (error) {
      applyFieldErrors(error, setError);
      setMessageTone("error");
      setFormMessage(getErrorMessage(error, "authForm.errors.submitFailed"));
    }
  };

  const normalizeFieldValue = (value: string | string[]) =>
    Array.isArray(value) ? value.join(" ") : value;

  const renderField = (field: CreatorFieldConfig) => (
    <FormField<CreatorRequestValues>
      key={field.key}
      id={`creator-${field.key}`}
      name={field.key}
      label={t(field.labelKey)}
      labelFontStyle="Body_Regular"
      labelMarginTop="0"
      type={field.type}
      placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
      onChange={(value) => updateField(field.key, normalizeFieldValue(value))}
      required={field.required}
    />
  );

  return (
    <ContentWrap>
      <AuthBackButton href="/auth/signup" />
      <LogoWrap>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
      </LogoWrap>

      <FormTitle>
        <MonoText $use="H4_Medium">{t("authCreator.title")}</MonoText>
      </FormTitle>
      <FormIntro>
        <MonoText $use="Body_Regular">{t("authCreator.subtitle")}</MonoText>
      </FormIntro>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid>{NAME_FIELDS.map((field) => renderField(field))}</Grid>

          <FullRow>{renderField(EMAIL_FIELD)}</FullRow>

          <Grid>
            {CONTACT_FIELDS.map((field) =>
              field.key === "cvr" ? (
                <div key={field.key}>
                  {renderField(field)}
                  <HelpText>{t("authCreator.form.cvrHelp")}</HelpText>
                </div>
              ) : (
                renderField(field)
              ),
            )}
          </Grid>

          <TernaryRow>
            {ADDRESS_FIELDS.map((field) => renderField(field))}
          </TernaryRow>

          <FullRow>{renderField(WORK_LINK_FIELD)}</FullRow>

          <FullRow>{renderField(CONTENT_FIELD)}</FullRow>

          <CheckboxRow>
            <Checkbox
              id="creator-consent"
              type="checkbox"
              checked={Boolean(agreedValue)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                updateField("agreed", event.target.checked)
              }
            />
            <ConsentText htmlFor="creator-consent">
              <MonoText $use="Body_Small">
                {t("authCreator.form.consentPrefix")}
                <TermsLink href="#">{t("authCreator.form.terms")}</TermsLink>
                {t("authCreator.form.and")}
                <TermsLink href="#">{t("authCreator.form.privacy")}</TermsLink>
              </MonoText>
            </ConsentText>
          </CheckboxRow>

          {(formMessage || errors.agreed?.message) && (
            <FormMessage $tone={messageTone} role={ALERT}>
              {formMessage || String(errors.agreed?.message)}
            </FormMessage>
          )}

          <SubmitButton
            type="submit"
            disabled={!isValid || creatorRequest.isPending}
            isLoading={creatorRequest.isPending}
          >
            {t("authCreator.form.submit")}
          </SubmitButton>
        </Form>
      </FormProvider>

      <LinkRow>
        <MonoText $use="Body_Medium">{t("authCreator.haveAccount")}</MonoText>
        <LoginLink href="/auth/login">
          <MonoText $use="Body_Medium">{t("authCreator.login")}</MonoText>
        </LoginLink>
      </LinkRow>
    </ContentWrap>
  );
}
