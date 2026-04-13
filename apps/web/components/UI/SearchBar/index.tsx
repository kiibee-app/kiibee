"use client";

import React, { useState, useCallback } from "react";
import { ClearButton, LeftIconWrapper, StyledInput, Wrapper } from "./styles";
import { CrossIcon } from "@/assets/icons/crossIcon";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { INPUT_TYPE, KEYBOARD_KEYS } from "@/utils/ui";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  width?: string;
};

export default function SearchBar({
  placeholder,
  value: controlledValue,
  onChange,
  onSubmit,
  width,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue ?? internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (controlledValue === undefined) setInternalValue(newValue);
      onChange?.(newValue);
    },
    [controlledValue, onChange],
  );

  const handleClear = useCallback(() => {
    if (controlledValue === undefined) setInternalValue("");
    onChange?.("");
  }, [controlledValue, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === KEYBOARD_KEYS.ENTER) onSubmit?.(value);
      if (e.key === KEYBOARD_KEYS.ESCAPE) handleClear();
    },
    [handleClear, onSubmit, value],
  );

  return (
    <Wrapper $width={width} role="search" aria-label="Search">
      <LeftIconWrapper>
        <SearchIcon />
      </LeftIconWrapper>

      <StyledInput
        type={INPUT_TYPE.TEXT}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {value && (
        <ClearButton onClick={handleClear} aria-label="Clear search">
          <CrossIcon width={24} />
        </ClearButton>
      )}
    </Wrapper>
  );
}
