"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import { ContentWrap } from "@/app/auth/signup-creator/styles";
import { VIEWER_SIGNUP_PREFERENCE } from "@/utils/translationKeys";
import { PREF_STEP, ViewerPreferenceStep } from "@/utils/preferenceOptions";
import { PrepCard, PreContentWrap } from "./styles";
import PreferenceStepContent from "./PreferenceStepContent";

export default function ViewerPreference() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const [step, setStep] = useState<ViewerPreferenceStep>(PREF_STEP.INTRO);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleCategory = (categoryKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((item) => item !== categoryKey)
        : [...prev, categoryKey],
    );
  };

  const toggleType = (typeKey: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeKey)
        ? prev.filter((item) => item !== typeKey)
        : [...prev, typeKey],
    );
  };

  const handleContinue = () => {
    if (step === PREF_STEP.INTRO) {
      setStep(PREF_STEP.CONTENT);
      return;
    }

    if (step === PREF_STEP.CONTENT) {
      setStep(PREF_STEP.TYPES);
      return;
    }

    router.push("/");
  };

  return (
    <PreContentWrap>
      <ContentWrap>
        <AuthBackButton href="/auth/signup-viewer" />
      </ContentWrap>
      <PrepCard>
        <PreferenceStepContent
          step={step}
          onStepBack={() =>
            setStep(
              step === PREF_STEP.TYPES ? PREF_STEP.CONTENT : PREF_STEP.INTRO,
            )
          }
          onToggleCategory={toggleCategory}
          onToggleType={toggleType}
          selectedCategories={selectedCategories}
          selectedTypes={selectedTypes}
          t={(key, ...args) => t(key, ...(args as [])) as string}
          backIconBg={theme?.colors?.neutral?.GRAY_200}
          backIconStroke={theme?.colors?.primary?.BLACK}
        />

        <GenericButton
          className="preference-continue-btn"
          onClick={handleContinue}
        >
          {t(
            step === PREF_STEP.TYPES
              ? VIEWER_SIGNUP_PREFERENCE.types.submit
              : VIEWER_SIGNUP_PREFERENCE.submit,
          )}
        </GenericButton>
      </PrepCard>
    </PreContentWrap>
  );
}
