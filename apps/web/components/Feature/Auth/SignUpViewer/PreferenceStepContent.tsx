"use client";

import { BackButtonIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import {
  AUTH_CREATOR,
  VIEWER_SIGNUP_PREFERENCE,
} from "@/utils/translationKeys";
import {
  CardHeader,
  CategoryChip,
  CategoryGrid,
  Description,
  InlineBackButton,
  StepSubtitle,
  Title,
  TypeCard,
  TypeGrid,
  TypeLabel,
} from "./styles";
import {
  CONTENT_CATEGORY_OPTIONS,
  CONTENT_TYPE_ITEMS,
  PREF_STEP,
  ViewerPreferenceStep,
} from "@/utils/preferenceOptions";

type PreferenceStepContentProps = {
  step: ViewerPreferenceStep;
  onStepBack: () => void;
  onToggleCategory: (categoryKey: string) => void;
  onToggleType: (typeKey: string) => void;
  selectedCategories: string[];
  selectedTypes: string[];
  t: (key: string, ...args: unknown[]) => string;
  backIconBg?: string;
  backIconStroke?: string;
};

export default function PreferenceStepContent({
  step,
  onStepBack,
  onToggleCategory,
  onToggleType,
  selectedCategories,
  selectedTypes,
  t,
  backIconBg,
  backIconStroke,
}: PreferenceStepContentProps) {
  if (step === PREF_STEP.INTRO) {
    return (
      <>
        <Title>
          <MonoText $use="H4_Medium">
            {t(VIEWER_SIGNUP_PREFERENCE.title)}
          </MonoText>
        </Title>

        <Description>
          <MonoText $use="Body_Medium">
            {t(VIEWER_SIGNUP_PREFERENCE.description)}
          </MonoText>
        </Description>
      </>
    );
  }

  if (step === PREF_STEP.CONTENT) {
    return (
      <>
        <CardHeader>
          <InlineBackButton
            type="button"
            onClick={onStepBack}
            aria-label={t(AUTH_CREATOR.backAria, "Back")}
          >
            <BackButtonIcon
              size={28}
              backgroundColor={backIconBg}
              strokeColor={backIconStroke}
              strokeWidth={2.5}
            />
          </InlineBackButton>
        </CardHeader>

        <Title>
          <MonoText $use="H4_Medium">
            {t(VIEWER_SIGNUP_PREFERENCE.content.title)}
          </MonoText>
        </Title>

        <StepSubtitle>
          <MonoText $use="Body_Medium">
            {t(VIEWER_SIGNUP_PREFERENCE.content.subtitle)}
          </MonoText>
        </StepSubtitle>

        <CategoryGrid>
          {CONTENT_CATEGORY_OPTIONS.map(({ key, translationKey }) => (
            <CategoryChip
              key={key}
              type="button"
              $selected={selectedCategories.includes(key)}
              onClick={() => onToggleCategory(key)}
            >
              {t(translationKey)}
            </CategoryChip>
          ))}
        </CategoryGrid>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <InlineBackButton
          type="button"
          onClick={onStepBack}
          aria-label={t(AUTH_CREATOR.backAria, "Back")}
        >
          <BackButtonIcon
            size={28}
            backgroundColor={backIconBg}
            strokeColor={backIconStroke}
            strokeWidth={2.5}
          />
        </InlineBackButton>
      </CardHeader>

      <Title>
        <MonoText $use="H4_Medium">
          {t(VIEWER_SIGNUP_PREFERENCE.types.title)}
        </MonoText>
      </Title>

      <StepSubtitle>
        <MonoText $use="Body_Medium">
          {t(VIEWER_SIGNUP_PREFERENCE.types.subtitle)}
        </MonoText>
      </StepSubtitle>

      <TypeGrid>
        {CONTENT_TYPE_ITEMS.map(
          ({ key, icon: IconComponent, translationKey }) => (
            <TypeCard
              key={key}
              type="button"
              $selected={selectedTypes.includes(key)}
              onClick={() => onToggleType(key)}
            >
              <IconComponent />
              <TypeLabel>{t(translationKey)}</TypeLabel>
            </TypeCard>
          ),
        )}
      </TypeGrid>
    </>
  );
}
