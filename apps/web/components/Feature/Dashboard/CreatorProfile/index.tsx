"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Title,
  Card,
  Row,
  Avatar,
  Fields,
  Action,
  Button,
  SecondaryButton,
  HeaderRow,
  InlineLabel,
  HeaderActions,
  NameBlock,
} from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import InputField from "@/components/UI/InputFields";
import PasswordSection from "./PasswordSection";
import CompanySection from "./CompanySection";
import PaymentSection from "./PaymentSection";
import { INPUT_VARIANTS, VARIANT } from "@/utils/Constants";
import {
  createInitialProfileData,
  emptyPasswords,
} from "@/utils/dummyData/profile.data";
import { PasswordState, ProfileForm } from "@/types/creatorProfile";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

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
  const { t } = useTranslation();

  const initial = useMemo(() => createInitialProfileData(email), [email]);
  const [form, setForm] = useState<ProfileForm>(initial);
  const [saved, setSaved] = useState<ProfileForm>(initial);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState<PasswordState>(emptyPasswords);

  const dirty = useMemo(() => {
    const formChanged = JSON.stringify(form) !== JSON.stringify(saved);
    const passwordChanged = Object.values(passwords).some(Boolean);
    return formChanged || passwordChanged;
  }, [form, saved, passwords]);

  const onChange = useCallback(
    (key: keyof ProfileForm) => (value: string | string[]) => {
      setForm((prev) => ({ ...prev, [key]: String(value) }));
    },
    [],
  );

  const onPasswordChange = useCallback(
    (field: keyof PasswordState, value?: string) => {
      setPasswords((prev) => ({ ...prev, [field]: value ?? "" }));
    },
    [],
  );

  const handleCancel = () => {
    setForm(saved);
    setPasswords(emptyPasswords);
    setShowPassword(false);
  };

  const handleSave = () => {
    if (!dirty) return;

    console.log("Saving:", {
      ...form,
      passwords: showPassword ? passwords : undefined,
    });

    setSaved(form);
    setPasswords(emptyPasswords);
    setShowPassword(false);
  };

  return (
    <Container>
      <HeaderRow>
        <Title>
          <MonoText $use="H4_SemiBold">{t(CREATOR_PROFILE.title)}</MonoText>
        </Title>
        <HeaderActions>
          <SecondaryButton onClick={handleCancel}>
            <MonoText $use="Body_Medium">{t("common.cancel")}</MonoText>
          </SecondaryButton>

          <Button onClick={handleSave} disabled={!dirty}>
            <MonoText $use="Body_Medium">{t("common.save")}</MonoText>
          </Button>
        </HeaderActions>
      </HeaderRow>

      <Card>
        <Row>
          <Avatar>
            <MonoText $use="Heading2">{getInitial(email)}</MonoText>
          </Avatar>
          <NameBlock>
            <MonoText $use="Heading3">{name}</MonoText>

            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
              {email}
            </MonoText>
          </NameBlock>
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
            <GenericButton
              variant={VARIANT.PRIMARY}
              onClick={() => setShowPassword((s) => !s)}
            >
              {t(CREATOR_PROFILE.changePassword)}
            </GenericButton>
          </Action>

          {showPassword && (
            <PasswordSection
              passwords={passwords}
              onPasswordChange={onPasswordChange}
            />
          )}
        </Fields>
      </Card>
      <CompanySection form={form} onChange={onChange} t={t} />
      <PaymentSection form={form} onChange={onChange} t={t} />
    </Container>
  );
}
