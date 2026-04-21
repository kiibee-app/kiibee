"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Title,
  Card,
  Row,
  Avatar,
  Name,
  Fields,
  Action,
  Button,
  SecondaryButton,
  HeaderRow,
  MonoText,
  InlineLabel,
  EmailText,
  HeaderActions,
} from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import InputField from "@/components/UI/InputFields";
import PasswordSection from "./PasswordSection";
import CompanySection from "./CompanySection";
import PaymentSection from "./PaymentSection";
import { INPUT_VARIANTS } from "@/utils/Constants";

type Props = {
  name?: string;
  email?: string;
};

const getInitial = (email = "") =>
  email ? email.charAt(0).toUpperCase() : "?";

export default function CreatorProfile({
  name = "Lena Petersen",
  email = "lena@gmail.com",
}: Props) {
  const initial = useMemo(
    () => ({
      firstName: "Lena",
      lastName: "Jakobssen",
      company: "",
      phone: "+4567321145",
      cvr: "45672345",
      address: "Jagtvej 17",
      city: "Copenhagen",
      postal: "2400",
      reg: "3120",
      account: "5555",
      email,
    }),
    [email],
  );

  const [form, setForm] = useState(() => ({ ...initial }));
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const { t } = useTranslation();

  const [saved, setSaved] = useState(() => ({ ...initial }));

  const dirty = useMemo(() => {
    return (
      JSON.stringify(form) !== JSON.stringify(saved) ||
      passwords.current !== "" ||
      passwords.next !== "" ||
      passwords.confirm !== ""
    );
  }, [form, passwords, saved]);

  const onChange = (key: keyof typeof form) => (value: string | string[]) => {
    setForm((s) => ({ ...s, [key]: String(value) }));
  };

  const handleCancel = () => {
    setForm({ ...saved });
    setPasswords({ current: "", next: "", confirm: "" });
    setShowPassword(false);
  };

  const handleSave = () => {
    if (!dirty) return;
    console.log("Saving", {
      ...form,
      passwords: showPassword ? passwords : undefined,
    });
    setSaved({ ...form });
    setPasswords({ current: "", next: "", confirm: "" });
    setShowPassword(false);
  };

  return (
    <Container>
      <HeaderRow>
        <Title>{t(CREATOR_PROFILE.title)}</Title>
        <HeaderActions>
          <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
          <Button onClick={handleSave} disabled={!dirty}>
            Save
          </Button>
        </HeaderActions>
      </HeaderRow>

      <Card>
        <Row>
          <Avatar>
            <MonoText $use="Heading2">{getInitial(email)}</MonoText>
          </Avatar>

          <div>
            <Name>{name}</Name>
            <EmailText $use="Body_Medium">{email}</EmailText>
          </div>
        </Row>

        <Fields>
          <InputField
            label={t(CREATOR_PROFILE.firstName)}
            value={form.firstName}
            onChange={onChange("firstName")}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
          />

          <InputField
            label={t(CREATOR_PROFILE.lastName)}
            value={form.lastName}
            onChange={onChange("lastName")}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            labelMarginTop="16px"
          />

          <Action>
            <InlineLabel>{t(CREATOR_PROFILE.passwordLabel)}</InlineLabel>
            <Button onClick={() => setShowPassword((s) => !s)}>
              {t(CREATOR_PROFILE.changePassword)}
            </Button>
          </Action>

          {showPassword && (
            <PasswordSection
              passwords={passwords}
              onPasswordChange={(field, val) =>
                setPasswords((p) => ({ ...p, [field]: val ?? "" }))
              }
            />
          )}
        </Fields>
      </Card>
      <CompanySection form={form} onChange={onChange} t={t} />
      <PaymentSection form={form} onChange={onChange} t={t} />
    </Container>
  );
}
