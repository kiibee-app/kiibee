"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { SuccessCheckIcon } from "@/assets/icons";
import FormField from "@/components/UI/FormField";
import {
  getSupportContactFields,
  type ContactFormField,
} from "@/utils/supportContact";
import { createSupportContactSchema } from "@/lib/validation/schema";
import { sanitizeDigits, SUPPORT_FIELD } from "@/utils/numericFields";
import { useSupportContact } from "@/hooks/support/useSupportContact";
import { normalizeApiError } from "@/lib/http/errors/apiError";
import {
  ContactBlock,
  ContactList,
  Content,
  Description,
  EmailLink,
  FieldSlot,
  Form,
  FormActions,
  FormCard,
  FormGrid,
  InlineLink,
  Panel,
  ResourceCopy,
  Section,
  SuccessCard,
  SuccessState,
  SuccessText,
  SuccessTitle,
  SubmitButton,
  Title,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

export default function SupportContact() {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutateAsync: submitSupportContact, isPending: isSubmitting } =
    useSupportContact();
  const fields = useMemo(() => getSupportContactFields(t), [t]);
  const schema = useMemo(
    () =>
      createSupportContactSchema({
        firstNameRequired: t("supportPage.form.errors.firstNameRequired"),
        emailRequired: t("supportPage.form.errors.emailRequired"),
        emailInvalid: t("supportPage.form.errors.emailInvalid"),
        phoneInvalid: t("supportPage.form.errors.phoneInvalid"),
        messageRequired: t("supportPage.form.errors.messageRequired"),
      }),
    [t],
  );
  type SupportContactValues = ReturnType<typeof schema.parse>;
  const methods = useForm<SupportContactValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      phoneNumber: "",
      email: "",
      message: "",
    },
  });
  const {
    handleSubmit,
    setValue,
    formState: { isValid },
  } = methods;
  const emailValue = useWatch({
    control: methods.control,
    name: "email",
    defaultValue: "",
  });

  const updateField = (
    field: ContactFormField,
    nextValue: string | string[],
  ) => {
    let normalizedValue = Array.isArray(nextValue)
      ? nextValue.join(", ")
      : nextValue;

    if (field === SUPPORT_FIELD.PHONE_NUMBER) {
      normalizedValue = sanitizeDigits(normalizedValue);
    }

    setValue(field, normalizedValue as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: SupportContactValues) => {
    try {
      const response = await submitSupportContact({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim() || undefined,
        companyName: values.companyName.trim() || undefined,
        phoneNumber: values.phoneNumber.trim() || undefined,
        email: values.email.trim(),
        message: values.message.trim(),
      });
      toast.success(response.message || t("supportPage.form.submitSuccess"));
      setIsSuccess(true);
    } catch (error) {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message || t("supportPage.form.submitError"));
    }
  };

  return (
    <Section>
      <Panel>
        {isSuccess ? (
          <SuccessState>
            <SuccessCard>
              <SuccessCheckIcon size={48} color={COLORS.primary.GREEN_100} />
              <SuccessTitle>{t("supportPage.success.title")}</SuccessTitle>
              <SuccessText>
                {t("supportPage.success.description", {
                  email: emailValue,
                })}
              </SuccessText>
            </SuccessCard>
          </SuccessState>
        ) : (
          <>
            <Content>
              <Title>
                <MonoText $use="Heading2">{t("supportPage.title")}</MonoText>
              </Title>
              <Description>
                <MonoText $use="Body_Regular">
                  {t("supportPage.description")}
                </MonoText>
              </Description>
              <ResourceCopy>
                <MonoText $use="Body_Regular">
                  {t("supportPage.resourcesLead")}{" "}
                  <InlineLink href="/tutorial-videos">
                    {t("supportPage.tutorialVideos")}
                  </InlineLink>{" "}
                  {t("supportPage.resourcesMiddle")}{" "}
                  <InlineLink href="#">
                    {t("supportPage.userGuides")}
                  </InlineLink>{" "}
                  {t("supportPage.resourcesEnd")}
                </MonoText>
              </ResourceCopy>

              <ContactList>
                <ContactBlock>
                  <MonoText $use="Heading3">
                    {t("supportPage.supportTitle")}
                  </MonoText>
                  <EmailLink href={`mailto:${t("supportPage.supportEmail")}`}>
                    <MonoText $use="H5_Medium">
                      {t("supportPage.supportEmail")}
                    </MonoText>
                  </EmailLink>
                </ContactBlock>

                <ContactBlock>
                  <MonoText $use="Heading3">
                    {t("supportPage.salesTitle")}
                  </MonoText>
                  <EmailLink href={`mailto:${t("supportPage.salesEmail")}`}>
                    <MonoText $use="H5_Medium">
                      {t("supportPage.salesEmail")}
                    </MonoText>
                  </EmailLink>
                </ContactBlock>
              </ContactList>
            </Content>

            <FormCard>
              <FormProvider {...methods}>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <FormGrid>
                    {fields.map((field) => (
                      <FieldSlot key={field.key} $full={field.full}>
                        <FormField<SupportContactValues>
                          id={`support-${field.key}`}
                          name={field.key as ContactFormField}
                          label={field.label}
                          labelFontStyle="Body_Regular"
                          labelMarginTop="0"
                          placeholder={field.placeholder}
                          type={field.type}
                          inputMode={field.inputMode}
                          required={field.required}
                          autoComplete={field.autoComplete}
                          onChange={(nextValue) =>
                            updateField(
                              field.key as ContactFormField,
                              nextValue,
                            )
                          }
                          max={field.max}
                        />
                      </FieldSlot>
                    ))}
                  </FormGrid>

                  <FormActions>
                    <SubmitButton
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      isLoading={isSubmitting}
                    >
                      {t("supportPage.form.submit")}
                    </SubmitButton>
                  </FormActions>
                </Form>
              </FormProvider>
            </FormCard>
          </>
        )}
      </Panel>
    </Section>
  );
}
