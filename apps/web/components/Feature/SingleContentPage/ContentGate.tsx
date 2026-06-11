"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import GenericButton from "@/components/UI/GenericButton";
import {
  VARIANT,
  ACCESS_TYPE_PASSWORD,
  ACCESS_TYPE_EMAIL_GATED,
} from "@/utils/Constants";
import { toast } from "react-toastify";
import {
  GateBoxContainer,
  GateBoxTitle,
  GateForm,
  GatePolicyText,
  GatePolicyLink,
} from "./styles";

interface ContentGateProps {
  contentId: string;
  accessType: typeof ACCESS_TYPE_PASSWORD | typeof ACCESS_TYPE_EMAIL_GATED;
  correctPassword?: string;
  onUnlockSuccess: () => void;
}

export default function ContentGate({
  contentId,
  accessType,
  correctPassword,
  onUnlockSuccess,
}: ContentGateProps) {
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
      if (accessType === ACCESS_TYPE_PASSWORD) {
        if (!password.trim()) {
          toast.error(t("contentGate.errors.passwordRequired"));
          setIsLoading(false);
          return;
        }

        if (password.trim() !== (correctPassword || "")) {
          toast.error(t("contentGate.errors.incorrectPassword"));
          setIsLoading(false);
          return;
        }
      } else {
        if (!name.trim() || !email.trim()) {
          toast.error(t("contentGate.errors.fieldsRequired"));
          setIsLoading(false);
          return;
        }
      }
      localStorage.setItem(`kiibee.content.unlocked.${contentId}`, "true");
      toast.success(t("contentGate.success"));
      onUnlockSuccess();
    } catch {
      toast.error(t("contentGate.errors.failed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (accessType === ACCESS_TYPE_PASSWORD) {
    return (
      <GateBoxContainer>
        <GateBoxTitle>{t("contentGate.password.title")}</GateBoxTitle>
        <GateForm onSubmit={handleSubmit}>
          <InputField
            type="password"
            label={t("contentGate.password.label")}
            placeholder={t("contentGate.password.placeholder")}
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
            {t("contentGate.password.submit")}
          </GenericButton>
        </GateForm>
      </GateBoxContainer>
    );
  }

  return (
    <GateBoxContainer>
      <GateBoxTitle>{t("contentGate.email.title")}</GateBoxTitle>
      <GateForm onSubmit={handleSubmit}>
        <InputField
          type="text"
          label={t("contentGate.email.nameLabel")}
          placeholder={t("contentGate.email.namePlaceholder")}
          value={name}
          onChange={(val) => setName(val as string)}
          required
        />

        <InputField
          type="email"
          label={t("contentGate.email.emailLabel")}
          placeholder={t("contentGate.email.emailPlaceholder")}
          value={email}
          onChange={(val) => setEmail(val as string)}
          required
        />

        <GatePolicyText>
          {t("contentGate.email.policy")}
          <GatePolicyLink href="/privacy-policy" target="_blank">
            {t("contentGate.email.policyLink")}
          </GatePolicyLink>
          .
        </GatePolicyText>

        <GenericButton
          type="submit"
          variant={VARIANT.PRIMARY}
          isLoading={isLoading}
          fullWidth
        >
          {t("contentGate.email.submit")}
        </GenericButton>
      </GateForm>
    </GateBoxContainer>
  );
}
