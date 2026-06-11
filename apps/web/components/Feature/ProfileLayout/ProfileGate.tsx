"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { ADMISSION_TYPE } from "@/utils/paymentRequirements";
import { toast } from "react-toastify";
import {
  ProfileGateContainer,
  ProfileGateTitle,
  ProfileGateDescription,
  ProfileGateForm,
  ProfileGatePolicyText,
  ProfileGatePolicyLink,
} from "./ProfileGate.styles";

interface ProfileGateProps {
  creatorId: string;
  accessType:
    | typeof ADMISSION_TYPE.SET_PASSWORD
    | typeof ADMISSION_TYPE.REQUEST_EMAIL;
  onUnlockSuccess: () => void;
}

export default function ProfileGate({
  creatorId,
  accessType,
  onUnlockSuccess,
}: ProfileGateProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      if (accessType === ADMISSION_TYPE.SET_PASSWORD) {
        if (!password.trim()) {
          toast.error(t("profileGate.errors.passwordRequired"));
          setIsLoading(false);
          return;
        }

        const savedPassword =
          localStorage.getItem(
            `kiibee.creator.settings.password.${creatorId}`,
          ) || "";
        if (password.trim() !== savedPassword) {
          toast.error(t("profileGate.errors.incorrectPassword"));
          setIsLoading(false);
          return;
        }
      } else {
        if (!name.trim() || !email.trim()) {
          toast.error(t("profileGate.errors.fieldsRequired"));
          setIsLoading(false);
          return;
        }
        const currentSubscribers = JSON.parse(
          localStorage.getItem(`kiibee.creator.subscribers.${creatorId}`) ||
            "[]",
        );
        currentSubscribers.push({
          name: name.trim(),
          email: email.trim(),
          date: new Date().toISOString(),
        });
        localStorage.setItem(
          `kiibee.creator.subscribers.${creatorId}`,
          JSON.stringify(currentSubscribers),
        );
      }
      localStorage.setItem(`kiibee.profile.unlocked.${creatorId}`, "true");
      toast.success(t("profileGate.success"));
      onUnlockSuccess();
    } catch {
      toast.error(t("profileGate.errors.failed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (accessType === ADMISSION_TYPE.SET_PASSWORD) {
    return (
      <ProfileGateContainer>
        <div>
          <ProfileGateTitle>{t("profileGate.password.title")}</ProfileGateTitle>
          <ProfileGateDescription>
            {t("profileGate.password.description")}
          </ProfileGateDescription>
        </div>

        <ProfileGateForm onSubmit={handleSubmit}>
          <InputField
            type="password"
            label={t("profileGate.password.label")}
            placeholder={t("profileGate.password.placeholder")}
            value={password}
            onChange={(val) => setPassword(val as string)}
            required
          />

          <GenericButton
            type="submit"
            variant={VARIANT.PRIMARY}
            isLoading={isLoading}
            fullWidth
          >
            {t("profileGate.password.submit")}
          </GenericButton>
        </ProfileGateForm>
      </ProfileGateContainer>
    );
  }

  return (
    <ProfileGateContainer>
      <div>
        <ProfileGateTitle>{t("profileGate.email.title")}</ProfileGateTitle>
        <ProfileGateDescription>
          {t("profileGate.email.description")}
        </ProfileGateDescription>
      </div>

      <ProfileGateForm onSubmit={handleSubmit}>
        <InputField
          type="text"
          label={t("profileGate.email.nameLabel")}
          placeholder={t("profileGate.email.namePlaceholder")}
          value={name}
          onChange={(val) => setName(val as string)}
          required
        />

        <InputField
          type="email"
          label={t("profileGate.email.emailLabel")}
          placeholder={t("profileGate.email.emailPlaceholder")}
          value={email}
          onChange={(val) => setEmail(val as string)}
          required
        />

        <ProfileGatePolicyText>
          {t("profileGate.email.policy")}
          <ProfileGatePolicyLink href="/privacy-policy" target="_blank">
            {t("profileGate.email.policyLink")}
          </ProfileGatePolicyLink>
          .
        </ProfileGatePolicyText>

        <GenericButton
          type="submit"
          variant={VARIANT.PRIMARY}
          isLoading={isLoading}
          fullWidth
        >
          {t("profileGate.email.submit")}
        </GenericButton>
      </ProfileGateForm>
    </ProfileGateContainer>
  );
}
