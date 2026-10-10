"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
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
  onChange?: (value: string) => void;
  onInputChange?: (typed: string) => void;
  protectedTags?: { id: string; label: string }[];
  onRemoveProtectedTag?: (id: string) => void;
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
  protectedTags = [],
  onRemoveProtectedTag,
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
  const tagsRef = useRef(tags);

  useEffect(() => {
    tagsRef.current = tags;
  }, [tags]);

  const addTag = useCallback(
    (tagText: string) => {
      const trimmedTag = tagText.trim();
      const currentTags = tagsRef.current;
      const currentTotalLength = currentTags.join("").length;
      const shouldSkip =
        !trimmedTag ||
        currentTags.includes(trimmedTag) ||
        currentTotalLength + trimmedTag.length > maxLength;

      if (shouldSkip) {
        setInputValue("");
        if (onInputChange) {
          onInputChange("");
        }
        return;
      }

      const nextTags = [...currentTags, trimmedTag];
      tagsRef.current = nextTags;
      onChange?.(nextTags.join(", "));
      setInputValue("");
      if (onInputChange) {
        onInputChange("");
      }
    },
    [onChange, maxLength, onInputChange],
  );

  const removeTag = useCallback(
    (indexToRemove: number) => {
      const nextTags = tagsRef.current.filter(
        (_, index) => index !== indexToRemove,
      );
      tagsRef.current = nextTags;
      onChange?.(nextTags.join(", "));
    },
    [onChange],
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
        {protectedTags.map((tag) => (
          <TagChip key={`protected-${tag.id}`}>
            <TagText>{tag.label}</TagText>
            <TagRemoveButton
              onClick={(e) => {
                e.stopPropagation();
                onRemoveProtectedTag?.(tag.id);
              }}
              disabled={disabled || !onRemoveProtectedTag}
              type={BUTTON}
            >
              <ChipCloseIcon size={12} />
            </TagRemoveButton>
          </TagChip>
        ))}
        {tags.map((tag, index) => (
          <TagChip key={`${tag}-${index}`}>
            <TagText>{tag}</TagText>
            <TagRemoveButton
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
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
