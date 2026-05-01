"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { Directions } from "@/utils/ui";
import { Dropdown, DropdownItem, SortBox, Text } from "./styles";
import { useClickOutside } from "@/hooks/useClickOutside";
import { MonoText } from "../Monotext";
import { DEFAULT_SORT } from "@/utils/sortOptions";
import { SORT_DROPDOWN_VARIANT, SortDropdownVariant } from "@/utils/Constants";
import { useTheme } from "styled-components";

export type DropdownOption<T extends string = string> = {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
};

type Props<T extends string = string> = {
  options: ReadonlyArray<DropdownOption<T>>;
  value?: T;
  onChange?: (value: T) => void;
  label?: React.ReactNode;
  renderSelectedLabel?: (
    value: T,
    option?: DropdownOption<T>,
  ) => React.ReactNode;
  renderOptionLabel?: (option: DropdownOption<T>) => React.ReactNode;
  width?: string;
  maxWidth?: string;
  hideSelectedOption?: boolean;
  variant?: SortDropdownVariant;
};

function SortDropdown<T extends string = string>({
  options,
  value,
  onChange,
  label,
  renderSelectedLabel,
  renderOptionLabel,
  width,
  maxWidth,
  variant = SORT_DROPDOWN_VARIANT.DEFAULT,
  hideSelectedOption,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const initialValue = (value ?? options[0]?.value ?? DEFAULT_SORT) as T;
  const [internalSelected, setInternalSelected] = useState<T>(initialValue);

  const ref = useRef<HTMLDivElement>(null);
  const selected = (value ?? internalSelected) as T;

  useClickOutside({
    ref,
    enabled: open,
    eventType: "click",
    handler: () => setOpen(false),
  });

  const handleSelect = useCallback(
    (val: T) => {
      setInternalSelected(val);
      onChange?.(val);
      setOpen(false);
    },
    [onChange],
  );

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.value !== selected),
    [options, selected],
  );
  const visibleOptions = hideSelectedOption
    ? filteredOptions.length > 0
      ? filteredOptions
      : options
    : options;

  const selectedOption = options.find((opt) => opt.value === selected);
  const resolvedSelectedLabel = renderSelectedLabel
    ? renderSelectedLabel(selected, selectedOption)
    : (selectedOption?.label ?? selected);

  return (
    <SortBox
      ref={ref}
      $width={width}
      $maxWidth={maxWidth}
      $variant={variant}
      onClick={() => setOpen((prev) => !prev)}
    >
      <Text>
        {label ? <MonoText $use="Body_Regular">{label}</MonoText> : null}
        <MonoText $use="Body_Regular">{resolvedSelectedLabel}</MonoText>
      </Text>

      <ArrowIcon
        direction={open ? Directions.UP : Directions.DOWN}
        color={
          variant === SORT_DROPDOWN_VARIANT.SURFACE
            ? theme.colors.neutral.GRAY_400
            : theme.colors.primary.BLACK
        }
      />

      {open && (
        <Dropdown $maxWidth={maxWidth} $variant={variant}>
          {visibleOptions.map((opt) => (
            <DropdownItem
              key={opt.value}
              $variant={variant}
              $active={opt.value === selected}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(opt.value);
              }}
            >
              <Text>
                <MonoText $use="Body_Regular">
                  {renderOptionLabel ? renderOptionLabel(opt) : opt.label}
                </MonoText>
              </Text>
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </SortBox>
  );
}

export default React.memo(SortDropdown) as typeof SortDropdown;
