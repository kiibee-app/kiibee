"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LeftArrowIcon } from "@/assets/icons";
import InputField from "@/components/UI/InputFields";
import { INPUT_TYPE } from "@/utils/ui";
import {
  BackButton,
  BrandMark,
  Checkbox,
  CheckboxRow,
  ConsentText,
  ContentWrap,
  Form,
  FormIntro,
  FormTitle,
  FullRow,
  Grid,
  HelpText,
  LinkRow,
  LoginLink,
  SubmitButton,
  TernaryRow,
  TermsLink,
  TopBar,
} from "./styles";

type CreatorFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cvr: string;
  address: string;
  city: string;
  postalCode: string;
  workLink: string;
  contentDescription: string;
  agreed: boolean;
};

const INITIAL_FORM: CreatorFormValues = {
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
};

export default function SignUpCreatorSection() {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<CreatorFormValues>(INITIAL_FORM);

  const isSubmitEnabled = useMemo(() => {
    return (
      Boolean(formValues.firstName.trim()) &&
      Boolean(formValues.lastName.trim()) &&
      Boolean(formValues.email.trim()) &&
      Boolean(formValues.address.trim()) &&
      Boolean(formValues.city.trim()) &&
      Boolean(formValues.postalCode.trim()) &&
      Boolean(formValues.contentDescription.trim()) &&
      formValues.agreed
    );
  }, [formValues]);

  const updateField = (
    field: keyof CreatorFormValues,
    value: string | boolean,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSubmitEnabled) {
      return;
    }
  };

  return (
    <ContentWrap>
      <TopBar>
        <BackButton href="/auth" aria-label={t("authCreator.backAria", "Back")}>
          <LeftArrowIcon width={10} height={18} />
        </BackButton>
      </TopBar>

      <BrandMark aria-hidden="true">k</BrandMark>

      <FormTitle>
        {t("authCreator.title", "Request to become a Kiibee creator")}
      </FormTitle>
      <FormIntro>
        {t(
          "authCreator.subtitle",
          "We're excited you want to join Kiibee! Before getting started, please fill out the form below. We review all creator requests to ensure high-quality content on the platform.",
        )}
      </FormIntro>

      <Form onSubmit={handleSubmit}>
        <Grid>
          <InputField
            id="creator-first-name"
            label={t("authCreator.form.firstName", "First name")}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            value={formValues.firstName}
            onChange={(value) =>
              updateField(
                "firstName",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
            required
          />
          <InputField
            id="creator-last-name"
            label={t("authCreator.form.lastName", "Last name")}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            value={formValues.lastName}
            onChange={(value) =>
              updateField(
                "lastName",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
            required
          />
        </Grid>

        <FullRow>
          <InputField
            id="creator-email"
            label={t("authCreator.form.email", "Email address")}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            type={INPUT_TYPE.EMAIL}
            value={formValues.email}
            onChange={(value) =>
              updateField(
                "email",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
            required
          />
        </FullRow>

        <Grid>
          <InputField
            id="creator-phone"
            label={t("authCreator.form.phone", "Phone number (optional)")}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            type={INPUT_TYPE.TEL}
            value={formValues.phone}
            onChange={(value) =>
              updateField(
                "phone",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
          />
          <div>
            <InputField
              id="creator-cvr"
              label={t("authCreator.form.cvr", "CVR (optional)")}
              labelFontStyle="Body_Title7"
              labelMarginTop="0"
              value={formValues.cvr}
              onChange={(value) =>
                updateField(
                  "cvr",
                  Array.isArray(value) ? value.join(" ") : value,
                )
              }
            />
            <HelpText>
              {t(
                "authCreator.form.cvrHelp",
                "8 digits - only if you run a business",
              )}
            </HelpText>
          </div>
        </Grid>

        <TernaryRow>
          <InputField
            id="creator-address"
            label={t("authCreator.form.address", "Address")}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            value={formValues.address}
            onChange={(value) =>
              updateField(
                "address",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
            required
          />
          <InputField
            id="creator-city"
            label={t("authCreator.form.city", "City")}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            value={formValues.city}
            onChange={(value) =>
              updateField(
                "city",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
            required
          />
          <InputField
            id="creator-postal"
            label={t("authCreator.form.postalCode", "Postal code")}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            value={formValues.postalCode}
            onChange={(value) =>
              updateField(
                "postalCode",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
            required
          />
        </TernaryRow>

        <FullRow>
          <InputField
            id="creator-work-link"
            label={t(
              "authCreator.form.workLink",
              "Link to example work (YouTube, WeTransfer, etc.)",
            )}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            value={formValues.workLink}
            onChange={(value) =>
              updateField(
                "workLink",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
          />
        </FullRow>

        <FullRow>
          <InputField
            id="creator-content-description"
            label={t(
              "authCreator.form.contentLabel",
              "Tell us about your content",
            )}
            labelFontStyle="Body_Title7"
            labelMarginTop="0"
            type={INPUT_TYPE.TEXTAREA}
            placeholder={t(
              "authCreator.form.contentPlaceholder",
              "Tell us a bit about your content and what you'd like to share on Kiibee.",
            )}
            value={formValues.contentDescription}
            onChange={(value) =>
              updateField(
                "contentDescription",
                Array.isArray(value) ? value.join(" ") : value,
              )
            }
            required
          />
        </FullRow>

        <CheckboxRow>
          <Checkbox
            id="creator-consent"
            type="checkbox"
            checked={formValues.agreed}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateField("agreed", event.target.checked)
            }
          />
          <ConsentText htmlFor="creator-consent">
            {t("authCreator.form.consentPrefix", "I agree to Kiibee's")}{" "}
            <TermsLink href="#">
              {t("authCreator.form.terms", "Terms of Use")}
            </TermsLink>{" "}
            {t("authCreator.form.and", "and")}{" "}
            <TermsLink href="#">
              {t("authCreator.form.privacy", "Privacy Policy")}
            </TermsLink>
          </ConsentText>
        </CheckboxRow>

        <SubmitButton type="submit" disabled={!isSubmitEnabled}>
          {t("authCreator.form.submit", "Submit request")}
        </SubmitButton>
      </Form>

      <LinkRow>
        {t("authCreator.haveAccount", "Already have an account?")}{" "}
        <LoginLink href="/auth/login">
          {t("authCreator.login", "Log in")}
        </LoginLink>
      </LinkRow>
    </ContentWrap>
  );
}
