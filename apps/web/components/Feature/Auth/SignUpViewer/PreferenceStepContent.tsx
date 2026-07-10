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
import { PREF_STEP, ViewerPreferenceStep } from "@/utils/preferenceOptions";
import { useViewerPreferences } from "@/hooks/useViewerPreferences";

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
  const { categories, contentTypes } = useViewerPreferences();

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
          {categories.map(({ key, name }) => (
            <CategoryChip
              key={key}
              type="button"
              $selected={selectedCategories.includes(key)}
              onClick={() => onToggleCategory(key)}
            >
              {name}
            </CategoryChip>
          ))}
        </CategoryGrid>
      </>
    );
  }

  if (step === PREF_STEP.TYPES) {
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
          {contentTypes.map(({ key, name, icon: IconComponent }) => (
            <TypeCard
              key={key}
              type="button"
              $selected={selectedTypes.includes(key)}
              onClick={() => onToggleType(key)}
            >
              <IconComponent />
              <TypeLabel>{name}</TypeLabel>
            </TypeCard>
          ))}
        </TypeGrid>
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
          {t(VIEWER_SIGNUP_PREFERENCE.ready.title)}
        </MonoText>
      </Title>

      <StepSubtitle>
        <MonoText $use="Body_Medium">
          {t(VIEWER_SIGNUP_PREFERENCE.ready.subtitle)}
        </MonoText>
      </StepSubtitle>
    </>
  );
}
