"use client";

import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { INPUT_VARIANTS } from "@/utils/Constants";
import {
  ADMISSION_REQUIREMENTS,
  ADMISSION_REQUIREMENT_VALUES,
  DEFAULT_ADMISSION_REQUIREMENT,
  AdmissionRequirementValue,
} from "@/utils/admissionRequirements";
import { Directions } from "@/utils/ui";
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

interface AdmissionRequirementsProps {
  accessType?: AdmissionRequirementValue;
  onChangeAccessType?: (value: AdmissionRequirementValue) => void;
  passwords?: string;
  onChangePasswords?: (value: string) => void;
}

function AdmissionRequirements({
  accessType,
  onChangeAccessType,
  passwords: propPasswords,
  onChangePasswords,
}: AdmissionRequirementsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState<AdmissionRequirementValue>(
    DEFAULT_ADMISSION_REQUIREMENT,
  );
  const [localPasswords, setLocalPasswords] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: dropdownRef,
    enabled: open,
    eventType: "click",
    handler: () => setOpen(false),
  });

  const selected = accessType ?? localSelected;
  const passwords = propPasswords ?? localPasswords;

  const selectedOption = useMemo(
    () =>
      ADMISSION_REQUIREMENTS.find((option) => option.value === selected) ??
      ADMISSION_REQUIREMENTS[0],
    [selected],
  );

  const handleSelect = useCallback(
    (value: AdmissionRequirementValue) => {
      if (onChangeAccessType) {
        onChangeAccessType(value);
      } else {
        setLocalSelected(value);
      }
      setOpen(false);
    },
    [onChangeAccessType],
  );

  const handlePasswordsChange = (val: string) => {
    if (onChangePasswords) {
      onChangePasswords(val);
    } else {
      setLocalPasswords(val);
    }
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
            {ADMISSION_REQUIREMENTS.map((option) => (
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
            placeholder="Enter passwords"
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            max={500}
            data-test-id="admission-requirements-passwords"
          />

          <PasswordMetaRow>
            <PasswordHelperText>
              Separate multiple passwords with commas.
            </PasswordHelperText>
            <PasswordLimitText>500</PasswordLimitText>
          </PasswordMetaRow>
        </PasswordFieldShell>
      ) : null}
    </AdmissionCard>
  );
}

export default memo(AdmissionRequirements);
