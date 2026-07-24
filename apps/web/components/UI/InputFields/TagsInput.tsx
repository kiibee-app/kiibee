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
  onInputChange?: (typed: string) => void;
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
  onInputChange,
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
        if (onInputChange) {
          onInputChange("");
        }
        return;
      }

      onChange([...tags, trimmedTag].join(", "));
      setInputValue("");
      if (onInputChange) {
        onInputChange("");
      }
    },
    [tags, onChange, maxLength, currentTotalLength, onInputChange],
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

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const delimiter = separateOnSpace ? /[\n, ]+/ : TAG_DELIMITER;
    if (!delimiter.test(newValue)) {
      setInputValue(newValue);
      if (onInputChange) {
        onInputChange(newValue);
      }
      return;
    }
    const parts = newValue.split(delimiter);
    parts.slice(0, -1).forEach(addTag);
    const lastPart = parts.at(-1) ?? "";
    setInputValue(lastPart);
    if (onInputChange) {
      onInputChange(lastPart);
    }
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
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          disabled={disabled}
        />
      </TagsContainer>
    </TagsInputWrapper>
  );
}
