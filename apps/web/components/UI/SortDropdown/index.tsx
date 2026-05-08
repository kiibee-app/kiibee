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
  trigger?: React.ReactNode;
  renderSelectedLabel?: (
    value: T,
    option?: DropdownOption<T>,
  ) => React.ReactNode;
  renderOptionLabel?: (option: DropdownOption<T>) => React.ReactNode;
  width?: string;
  maxWidth?: string;
  dropdownWidth?: string;
  compact?: boolean;
  hideSelectedOption?: boolean;
  allowNoSelection?: boolean;
  variant?: SortDropdownVariant;
};

function SortDropdown<T extends string = string>({
  options,
  value,
  onChange,
  label,
  trigger,
  renderSelectedLabel,
  renderOptionLabel,
  width,
  maxWidth,
  dropdownWidth,
  compact = false,
  variant = SORT_DROPDOWN_VARIANT.DEFAULT,
  hideSelectedOption,
  allowNoSelection = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const initialValue = (value ??
    (allowNoSelection ? undefined : (options[0]?.value ?? DEFAULT_SORT))) as
    | T
    | undefined;
  const [internalSelected, setInternalSelected] = useState<T | undefined>(
    initialValue,
  );

  const ref = useRef<HTMLDivElement>(null);
  const selected = (value ?? internalSelected) as T | undefined;

  useClickOutside({
    ref,
    enabled: open,
    eventType: "click",
    handler: () => setOpen(false),
  });

  const handleSelect = useCallback(
    (val: T) => {
      if (!allowNoSelection) {
        setInternalSelected(val);
      }
      onChange?.(val);
      setOpen(false);
    },
    [allowNoSelection, onChange],
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
    ? selected
      ? renderSelectedLabel(selected, selectedOption)
      : null
    : (selectedOption?.label ?? selected ?? null);

  return (
    <SortBox
      ref={ref}
      $width={width}
      $maxWidth={maxWidth}
      $variant={variant}
      $compact={compact || !!trigger}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((prev) => !prev);
      }}
    >
      {trigger ? (
        trigger
      ) : (
        <Text>
          {label ? <MonoText $use="Body_Regular">{label}</MonoText> : null}
          <MonoText $use="Body_Regular">{resolvedSelectedLabel}</MonoText>
        </Text>
      )}

      {!trigger ? (
        <ArrowIcon
          direction={open ? Directions.UP : Directions.DOWN}
          color={
            variant === SORT_DROPDOWN_VARIANT.SURFACE
              ? theme.colors.neutral.GRAY_400
              : theme.colors.primary.BLACK
          }
        />
      ) : null}

      {open && (
        <Dropdown
          $maxWidth={maxWidth}
          $width={dropdownWidth}
          $variant={variant}
        >
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
