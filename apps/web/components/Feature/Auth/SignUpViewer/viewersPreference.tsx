"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import { VIEWER_SIGNUP_PREFERENCE } from "@/utils/translationKeys";
import { PREF_STEP, ViewerPreferenceStep } from "@/utils/preferenceOptions";
import { PATHS, isSafePostLoginPath } from "@/utils/path";
import { PrepCard, PreContentWrap, ContentWrap } from "./styles";
import PreferenceStepContent from "./PreferenceStepContent";
import { UNDEFINED_STRING, REDIRECT_NEXT_QUERY_PARAM } from "@/utils/Constants";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

export default function ViewerPreference({
  onComplete,
  onBack,
}: {
  onComplete?: () => void;
  onBack?: () => void;
} = {}) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const { clearSession } = useAuthSession();
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

    if (onComplete) {
      onComplete();
    } else {
      const nextPath =
        typeof window !== UNDEFINED_STRING
          ? new URLSearchParams(window.location.search).get(
              REDIRECT_NEXT_QUERY_PARAM,
            )
          : null;
      if (nextPath && isSafePostLoginPath(nextPath)) {
        router.push(nextPath);
      } else {
        router.push(PATHS.DASHBOARD_VIEWER);
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      clearSession();
      router.push(PATHS.AUTH_LOGIN);
    }
  };

  const isModal = !!onComplete;

  return (
    <PreContentWrap $isModal={isModal}>
      <ContentWrap $isModal={isModal}>
        <AuthBackButton onClick={handleBack} />
      </ContentWrap>
      <PrepCard $isModal={isModal}>
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
