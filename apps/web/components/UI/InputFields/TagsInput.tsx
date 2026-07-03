"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  TagsContainer,
  TagChip,
  TagText,
  TagRemoveButton,
  TagsInputField,
  TagsInputWrapper,
} from "./styles";
import {
  INPUT_VARIANTS,
  InputVariant,
  KEY_ENTER,
  parseTags,
  TAG_DELIMITER,
  BUTTON,
  maxLogoNameCharacters,
} from "@/utils/Constants";
import { ChipCloseIcon } from "@/assets/icons";
import { INPUT_TYPE } from "@/utils/ui";

export type TagsInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  variant?: InputVariant;
  hasError?: boolean;
  disabled?: boolean;
  separateOnSpace?: boolean;
};

export default function TagsInput({
  value,
  onChange,
  placeholder,
  maxLength = maxLogoNameCharacters,
  variant = INPUT_VARIANTS.PRIMARY_GRAY,
  hasError = false,
  disabled = false,
  separateOnSpace = false,
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tags = useMemo(() => parseTags(value), [value]);
  const currentTotalLength = useMemo(() => tags.join("").length, [tags]);

  const addTag = useCallback(
    (tagText: string) => {
      const trimmedTag = tagText.trim();
      const shouldSkip =
        !trimmedTag ||
        tags.includes(trimmedTag) ||
        currentTotalLength + trimmedTag.length > maxLength;

      if (shouldSkip) {
        setInputValue("");
        return;
      }

      onChange([...tags, trimmedTag].join(", "));
      setInputValue("");
    },
    [tags, onChange, maxLength, currentTotalLength],
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onChange(tags.filter((tag) => tag !== tagToRemove).join(", "));
    },
    [tags, onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY_ENTER || (separateOnSpace && e.key === " ")) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const delimiter = separateOnSpace ? /[\n, ]+/ : TAG_DELIMITER;
    if (!delimiter.test(newValue)) {
      setInputValue(newValue);
      return;
    }
    const parts = newValue.split(delimiter);
    parts.slice(0, -1).forEach(addTag);
    setInputValue(parts.at(-1) ?? "");
  };

  return (
    <TagsInputWrapper
      $hasError={hasError}
      $variant={variant}
      onClick={() => inputRef.current?.focus()}
    >
      <TagsContainer>
        {tags.map((tag) => (
          <TagChip key={tag}>
            <TagText>{tag}</TagText>
            <TagRemoveButton
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              disabled={disabled}
              type={BUTTON}
            >
              <ChipCloseIcon size={12} />
            </TagRemoveButton>
          </TagChip>
        ))}
        <TagsInputField
          ref={inputRef}
          type={INPUT_TYPE.TEXT}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          disabled={disabled}
        />
      </TagsContainer>
    </TagsInputWrapper>
  );
}
