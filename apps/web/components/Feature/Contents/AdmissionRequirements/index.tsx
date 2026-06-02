"use client";

import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { INPUT_VARIANTS, maxDescriptionCharacters } from "@/utils/Constants";
import {
  ADMISSION_REQUIREMENTS,
  DEFAULT_ADMISSION_REQUIREMENT,
  AdmissionRequirementValue,
  ADMISSION_REQUIREMENT_VALUES,
} from "@/utils/admissionRequirements";
import { Directions, INPUT_TYPE } from "@/utils/ui";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";
import {
  AdmissionCard,
  DropdownShell,
  OptionButton,
  OptionsList,
  PasswordFieldShell,
  PasswordHelperText,
  PasswordLimitText,
  PasswordMetaRow,
  SelectButton,
  TextBlock,
} from "./styles";
import { PAYMENT_ADMISSION_VALUE } from "@/utils/common";
const updateValue = <T,>(
  value: T,
  onChange?: (value: T) => void,
  setLocal?: (value: T) => void,
) => {
  if (onChange) {
    onChange(value);
  } else {
    setLocal?.(value);
  }
};

interface AdmissionRequirementsProps {
  accessType?: AdmissionRequirementValue;
  onChangeAccessType?: (value: AdmissionRequirementValue) => void;
  passwords?: string;
  onChangePasswords?: (value: string) => void;
  description?: string;
  onChangeDescription?: (value: string) => void;
  showDescription?: boolean;
  showPaymentOption?: boolean;
}

function AdmissionRequirements({
  accessType,
  onChangeAccessType,
  passwords: propPasswords,
  onChangePasswords,
  description: propDescription,
  onChangeDescription,
  showDescription = true,
  showPaymentOption = true,
}: AdmissionRequirementsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState<AdmissionRequirementValue>(
    DEFAULT_ADMISSION_REQUIREMENT,
  );
  const [localPasswords, setLocalPasswords] = useState("");
  const [localDescription, setLocalDescription] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: dropdownRef,
    enabled: open,
    eventType: "click",
    handler: () => setOpen(false),
  });

  const selected = accessType ?? localSelected;
  const passwords = propPasswords ?? localPasswords;
  const description = propDescription ?? localDescription;
  const visibleOptions = useMemo(
    () =>
      showPaymentOption
        ? ADMISSION_REQUIREMENTS
        : ADMISSION_REQUIREMENTS.filter(
            (option) => option.value !== PAYMENT_ADMISSION_VALUE,
          ),
    [showPaymentOption],
  );

  const selectedOption = useMemo(
    () =>
      visibleOptions.find((option) => option.value === selected) ??
      visibleOptions[0],
    [selected, visibleOptions],
  );

  const handleSelect = useCallback(
    (value: AdmissionRequirementValue) => {
      updateValue(value, onChangeAccessType, setLocalSelected);
      setOpen(false);
    },
    [onChangeAccessType],
  );

  const handleDescriptionChange = (val: string) => {
    updateValue(val, onChangeDescription, setLocalDescription);
  };

  const handlePasswordsChange = (val: string) => {
    updateValue(val, onChangePasswords, setLocalPasswords);
  };

  return (
    <AdmissionCard data-test-id="admission-requirements-card">
      <TextBlock>
        <MonoText $use="Body_SemiBold">
          {t("contents.admissionRequirements.title")}
        </MonoText>

        <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
          {t("contents.admissionRequirements.description")}
        </MonoText>
      </TextBlock>

      <DropdownShell
        ref={dropdownRef}
        data-test-id="admission-requirements-dropdown"
      >
        <SelectButton
          type="button"
          data-test-id="admission-requirements-select-button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <MonoText $use="Body_Medium">{t(selectedOption.labelKey)}</MonoText>
          <ArrowIcon
            color={COLORS.neutral.GRAY_400}
            direction={open ? Directions.UP : Directions.DOWN}
          />
        </SelectButton>

        {open && (
          <OptionsList
            role="listbox"
            data-test-id="admission-requirements-options-list"
          >
            {visibleOptions.map((option) => (
              <OptionButton
                key={option.value}
                type="button"
                role="option"
                data-test-id={`admission-requirements-option-${option.value}`}
                aria-selected={option.value === selected}
                onClick={() => handleSelect(option.value)}
              >
                <MonoText $use="Body_Medium">{t(option.labelKey)}</MonoText>
              </OptionButton>
            ))}
          </OptionsList>
        )}
      </DropdownShell>

      {selected === ADMISSION_REQUIREMENT_VALUES.password ? (
        <PasswordFieldShell>
          <InputField
            type="textarea"
            value={passwords}
            onChange={(value) => handlePasswordsChange(value as string)}
            placeholder={t(
              "contents.admissionRequirements.password.placeholder",
            )}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            max={500}
            data-test-id="admission-requirements-passwords"
          />

          <PasswordMetaRow>
            <PasswordHelperText>
              {t("contents.admissionRequirements.password.helper")}
            </PasswordHelperText>
            <PasswordLimitText>{maxDescriptionCharacters}</PasswordLimitText>
          </PasswordMetaRow>
        </PasswordFieldShell>
      ) : null}

      {showDescription ? (
        <PasswordFieldShell>
          <MonoText $use="Body_SemiBold">
            {t("contents.contentUploadModal.details.description")}
          </MonoText>
          <InputField
            type={INPUT_TYPE.TEXTAREA}
            value={description}
            onChange={(value) => handleDescriptionChange(value as string)}
            placeholder={t(
              "contents.contentUploadModal.details.descriptionPlaceholder",
            )}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            max={500}
            data-test-id="admission-requirements-description"
          />
        </PasswordFieldShell>
      ) : null}
    </AdmissionCard>
  );
}

export default memo(AdmissionRequirements);
