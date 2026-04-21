"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  Title,
  Card,
  Row,
  Avatar,
  Name,
  Fields,
  TwoColumnRow,
  Action,
  Button,
  SecondaryButton,
  HeaderRow,
  MonoText,
  SectionTitle,
  PaymentText,
  Optional,
  InlineLabel,
  EmailText,
} from "./styles";
import InputField from "@/components/UI/InputFields";

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

  const onPasswordChange = (field: keyof typeof passwords) => (val: string) =>
    setPasswords((p) => ({ ...p, [field]: val }));

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
    // After successful save, update saved snapshot and clear password inputs
    setSaved({ ...form });
    setPasswords({ current: "", next: "", confirm: "" });
    setShowPassword(false);
  };

  return (
    <Container>
      <HeaderRow>
        <Title>My account</Title>
        <div style={{ display: "flex", gap: 12 }}>
          <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
          <Button
            onClick={handleSave}
            disabled={!dirty}
            style={{ opacity: dirty ? 1 : 0.6 }}
          >
            Save
          </Button>
        </div>
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
            label="First name"
            value={form.firstName}
            onChange={onChange("firstName")}
          />

          <InputField
            label="Last name"
            value={form.lastName}
            onChange={onChange("lastName")}
            labelMarginTop="16px"
          />

          <Action>
            <InlineLabel>Password</InlineLabel>
            <Button onClick={() => setShowPassword((s) => !s)}>
              Change password
            </Button>
          </Action>

          {showPassword && (
            <div style={{ marginTop: 12, maxWidth: 420 }}>
              <InputField
                label="Current password"
                type="password"
                value={passwords.current}
                onChange={(v) => onPasswordChange("current")(String(v))}
              />
              <InputField
                label="New password"
                type="password"
                value={passwords.next}
                onChange={(v) => onPasswordChange("next")(String(v))}
                labelMarginTop="12px"
              />
              <InputField
                label="Confirm password"
                type="password"
                value={passwords.confirm}
                onChange={(v) => onPasswordChange("confirm")(String(v))}
                labelMarginTop="12px"
              />
            </div>
          )}
        </Fields>
      </Card>

      <Card>
        <SectionTitle>
          Company Name<Optional>(optional)</Optional>
        </SectionTitle>
        <Fields>
          <InputField
            label="Company name"
            placeholder="Enter company name"
            value={form.company}
            onChange={onChange("company")}
            labelFontStyle="Body_Regular"
          />

          <InputField
            label="Phone number"
            value={form.phone}
            onChange={onChange("phone")}
            labelMarginTop="16px"
            labelFontStyle="Body_Regular"
          />

          <InputField
            label={
              <>
                CVR<Optional> (optional)</Optional>
              </>
            }
            placeholder="8 digits - only if you run a business"
            value={form.cvr}
            onChange={onChange("cvr")}
            labelMarginTop="16px"
            labelFontStyle="Body_Regular"
          />

          <InputField
            label="Address"
            value={form.address}
            onChange={onChange("address")}
            labelMarginTop="16px"
            labelFontStyle="Body_Regular"
          />

          <TwoColumnRow>
            <InputField
              label="City"
              value={form.city}
              onChange={onChange("city")}
              labelFontStyle="Body_Regular"
            />
            <InputField
              label="Postal code"
              value={form.postal}
              onChange={onChange("postal")}
              labelFontStyle="Body_Regular"
            />
          </TwoColumnRow>
        </Fields>
      </Card>

      <Card>
        <SectionTitle>Payment information</SectionTitle>
        <PaymentText>
          We need your payment information so we can pay out your earnings.
        </PaymentText>

        <Fields>
          <TwoColumnRow>
            <InputField
              label="Reg. no."
              value={form.reg}
              onChange={onChange("reg")}
              labelFontStyle="Body_Regular"
            />
            <InputField
              label="Account no."
              value={form.account}
              onChange={onChange("account")}
              labelFontStyle="Body_Regular"
            />
          </TwoColumnRow>
        </Fields>
      </Card>
    </Container>
  );
}
