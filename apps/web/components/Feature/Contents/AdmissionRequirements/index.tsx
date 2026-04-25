"use client";

import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { MonoText } from "@/components/UI/Monotext";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  ADMISSION_REQUIREMENTS,
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
  SelectButton,
  TextBlock,
} from "./styles";

function AdmissionRequirements() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AdmissionRequirementValue>(
    DEFAULT_ADMISSION_REQUIREMENT,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: dropdownRef,
    enabled: open,
    eventType: "click",
    handler: () => setOpen(false),
  });

  const selectedOption = useMemo(
    () =>
      ADMISSION_REQUIREMENTS.find((option) => option.value === selected) ??
      ADMISSION_REQUIREMENTS[0],
    [selected],
  );

  const handleSelect = useCallback((value: AdmissionRequirementValue) => {
    setSelected(value);
    setOpen(false);
  }, []);

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
    </AdmissionCard>
  );
}

export default memo(AdmissionRequirements);
