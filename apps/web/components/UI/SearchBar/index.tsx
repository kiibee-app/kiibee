"use client";

import React, { useState, useCallback } from "react";
import { ClearButton, LeftIconWrapper, StyledInput, Wrapper } from "./styles";
import { CrossIcon } from "@/assets/icons/crossIcon";
import { SearchIcon } from "@/assets/icons/searchBarIcon";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
};

export default function SearchBar({
  placeholder,
  value: controlledValue,
  onChange,
  onSubmit,
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
      if (e.key === "Enter") onSubmit?.(value);
      if (e.key === "Escape") handleClear();
    },
    [handleClear, onSubmit, value],
  );

  return (
    <Wrapper role="search" aria-label="Search">
      <LeftIconWrapper>
        <SearchIcon />
      </LeftIconWrapper>

      <StyledInput
        type="text"
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
