"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SuccessCheckIcon } from "@/assets/icons";
import InputField from "@/components/UI/InputFields";
import {
  getSupportContactFields,
  INITIAL_FORM,
  type ContactFormErrors,
  type ContactFormField,
  validateForm,
} from "@/utils/supportContact";
import {
  ContactBlock,
  ContactList,
  ContactTitle,
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
  SuccessIcon,
  SuccessState,
  SuccessText,
  SuccessTitle,
  SubmitButton,
  Title,
} from "./styles";

export default function SupportContact() {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const fields = useMemo(() => getSupportContactFields(t), [t]);

  const isRequiredFieldsFilled =
    Boolean(formValues.firstName.trim()) &&
    Boolean(formValues.email.trim()) &&
    Boolean(formValues.message.trim());

  const updateField = (
    field: ContactFormField,
    nextValue: string | string[],
  ) => {
    const normalizedValue = Array.isArray(nextValue)
      ? nextValue.join(", ")
      : nextValue;

    const updatedValues = { ...formValues, [field]: normalizedValue };
    setFormValues(updatedValues);

    if (submitted) {
      setErrors(validateForm(updatedValues, t));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues, t);
    setErrors(nextErrors);
    setSubmitted(true);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setIsSuccess(true);
  };

  return (
    <Section>
      <Panel>
        {isSuccess ? (
          <SuccessState>
            <SuccessCard>
              <SuccessIcon>
                <SuccessCheckIcon />
              </SuccessIcon>
              <SuccessTitle>{t("supportPage.success.title")}</SuccessTitle>
              <SuccessText>
                {t("supportPage.success.description", {
                  email: formValues.email,
                })}
              </SuccessText>
            </SuccessCard>
          </SuccessState>
        ) : (
          <>
            <Content>
              <Title>{t("supportPage.title")}</Title>
              <Description>{t("supportPage.description")}</Description>
              <ResourceCopy>
                {t("supportPage.resourcesLead")}{" "}
                <InlineLink href="/tutorial-videos">
                  {t("supportPage.tutorialVideos")}
                </InlineLink>{" "}
                {t("supportPage.resourcesMiddle")}{" "}
                <InlineLink href="#">{t("supportPage.userGuides")}</InlineLink>{" "}
                {t("supportPage.resourcesEnd")}
              </ResourceCopy>

              <ContactList>
                <ContactBlock>
                  <ContactTitle>{t("supportPage.supportTitle")}</ContactTitle>
                  <EmailLink href={`mailto:${t("supportPage.supportEmail")}`}>
                    {t("supportPage.supportEmail")}
                  </EmailLink>
                </ContactBlock>

                <ContactBlock>
                  <ContactTitle>{t("supportPage.salesTitle")}</ContactTitle>
                  <EmailLink href={`mailto:${t("supportPage.salesEmail")}`}>
                    {t("supportPage.salesEmail")}
                  </EmailLink>
                </ContactBlock>
              </ContactList>
            </Content>

            <FormCard>
              <Form onSubmit={handleSubmit}>
                <FormGrid>
                  {fields.map((field) => (
                    <FieldSlot key={field.key} $full={field.full}>
                      <InputField
                        id={`support-${field.key}`}
                        label={field.label}
                        labelFontStyle="Body_Title7"
                        labelMarginTop="0"
                        placeholder={field.placeholder}
                        value={formValues[field.key as ContactFormField]}
                        type={field.type}
                        required={field.required}
                        autoComplete={field.autoComplete}
                        hasError={Boolean(
                          submitted && errors[field.key as ContactFormField],
                        )}
                        errorText={
                          submitted ? errors[field.key as ContactFormField] : ""
                        }
                        onChange={(nextValue) =>
                          updateField(field.key as ContactFormField, nextValue)
                        }
                        max={field.max}
                      />
                    </FieldSlot>
                  ))}
                </FormGrid>

                <FormActions>
                  <SubmitButton
                    type="submit"
                    disabled={!isRequiredFieldsFilled}
                  >
                    {t("supportPage.form.submit")}
                  </SubmitButton>
                </FormActions>
              </Form>
            </FormCard>
          </>
        )}
      </Panel>
    </Section>
  );
}
