"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import type { ExistingCreator } from "../../../types/existing-creator";
import {
  SequenceActionButton,
  SequenceActionGroup,
  SequenceBadge,
  SequenceCellWrapper,
  SequenceClearButton,
  SequenceInput,
  SequencePrefix,
  SequenceSpinner,
} from "./AllCreators.styles";

type CreatorSequenceCellProps = {
  creator: ExistingCreator;
  allCreators?: ExistingCreator[];
  onUpdateSequence?: (
    creator: ExistingCreator,
    nextSequence: number | null,
    onError?: (err?: Error) => void,
  ) => void;
  isPending?: boolean;
};

export function CreatorSequenceCell({
  creator,
  allCreators,
  onUpdateSequence,
  isPending,
}: CreatorSequenceCellProps) {
  const savedValue = creator.sequence != null ? String(creator.sequence) : "";
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isCancellingRef = useRef(false);

  const displayValue = draftValue !== null ? draftValue : savedValue;
  const hasRank = creator.sequence != null;
  const isDirty = draftValue !== null && draftValue !== savedValue;

  const handleSave = () => {
    if (isPending || isCancellingRef.current) return;
    if (draftValue === null || draftValue === savedValue) {
      setDraftValue(null);
      return;
    }

    const trimmed = draftValue.trim();

    if (trimmed === "") {
      setDraftValue(null);
      if (creator.sequence === null) return;
      onUpdateSequence?.(creator, null);
      return;
    }

    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 1000) {
      toast.error("Sequence must be a number between 1 and 1000");
      setDraftValue(null);
      return;
    }

    if (creator.sequence === parsed) {
      setDraftValue(null);
      return;
    }

    const duplicate = allCreators?.find(
      (c) => c.id !== creator.id && c.sequence === parsed,
    );
    if (duplicate) {
      const otherName =
        duplicate.fullName?.trim() ||
        [duplicate.firstName, duplicate.lastName].filter(Boolean).join(" ") ||
        duplicate.email;
      toast.error(`Sequence #${parsed} is already assigned to "${otherName}"`);
      setDraftValue(null);
      return;
    }

    setDraftValue(null);
    onUpdateSequence?.(creator, parsed);
  };

  const handleCancel = () => {
    isCancellingRef.current = true;
    setDraftValue(null);
    inputRef.current?.blur();
    setTimeout(() => {
      isCancellingRef.current = false;
    }, 150);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
      inputRef.current?.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isPending || creator.sequence === null) return;
    setDraftValue(null);
    onUpdateSequence?.(creator, null);
  };

  return (
    <SequenceCellWrapper onClick={(event) => event.stopPropagation()}>
      <SequenceBadge
        $hasRank={hasRank}
        $isFocused={isFocused}
        onClick={() => inputRef.current?.focus()}
        title={
          hasRank
            ? `Rank #${creator.sequence} in Explore. Click to change.`
            : "Click to set rank (1-1000) in Explore."
        }
      >
        <SequencePrefix $hasRank={hasRank} $isFocused={isFocused}>
          #
        </SequencePrefix>

        <SequenceInput
          ref={inputRef}
          type="number"
          min={1}
          max={1000}
          $hasRank={hasRank}
          value={displayValue}
          placeholder="—"
          disabled={isPending}
          onChange={(event) => setDraftValue(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (isCancellingRef.current) {
              setDraftValue(null);
              return;
            }
            handleSave();
          }}
          onKeyDown={handleKeyDown}
        />

        {isPending ? (
          <SequenceSpinner />
        ) : hasRank && !isDirty && !isFocused ? (
          <SequenceClearButton
            type="button"
            title="Remove rank"
            onClick={handleClear}
          >
            <X size={10} />
          </SequenceClearButton>
        ) : null}
      </SequenceBadge>

      {isDirty && !isPending ? (
        <SequenceActionGroup>
          <SequenceActionButton
            type="button"
            $variant="confirm"
            title="Save rank"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleSave();
              inputRef.current?.blur();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleSave();
              inputRef.current?.blur();
            }}
          >
            <Check size={13} />
          </SequenceActionButton>
          <SequenceActionButton
            type="button"
            $variant="cancel"
            title="Cancel"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleCancel();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleCancel();
            }}
          >
            <X size={13} />
          </SequenceActionButton>
        </SequenceActionGroup>
      ) : null}
    </SequenceCellWrapper>
  );
}
