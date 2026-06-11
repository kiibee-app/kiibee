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
  joinTags,
  TAG_DELIMITER,
  BUTTON,
  maxLogoNameCharacters,
} from "@/utils/Constants";
import { ChipCloseIcon } from "@/assets/icons";

export type TagsInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  variant?: InputVariant;
  hasError?: boolean;
  disabled?: boolean;
};

export default function TagsInput({
  value,
  onChange,
  placeholder,
  maxLength = maxLogoNameCharacters,
  variant = INPUT_VARIANTS.PRIMARY_GRAY,
  hasError = false,
  disabled = false,
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

      onChange(joinTags([...tags, trimmedTag]));
      setInputValue("");
    },
    [tags, onChange, maxLength, currentTotalLength],
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      onChange(joinTags(tags.filter((tag) => tag !== tagToRemove)));
    },
    [tags, onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY_ENTER) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!TAG_DELIMITER.test(newValue)) {
      setInputValue(newValue);
      return;
    }
    const parts = newValue.split(TAG_DELIMITER);
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
          type="text"
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
