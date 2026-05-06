import { useCallback, useEffect, useRef, useState } from "react";

type UseDropdownKeyboardOptions = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  optionsLength: number;
  onSelect: (index: number) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
};

export function useDropdownKeyboard({
  isOpen,
  setIsOpen,
  optionsLength,
  onSelect,
  triggerRef,
}: UseDropdownKeyboardOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const optionRefs = useRef<(HTMLElement | null)[]>([]);

  const resetActiveIndex = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  const resolvedActiveIndex = isOpen ? activeIndex : -1;

  useEffect(() => {
    if (isOpen && resolvedActiveIndex >= 0) {
      optionRefs.current[resolvedActiveIndex]?.focus();
    }
  }, [resolvedActiveIndex, isOpen]);

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen) {
            setIsOpen(false);
            setActiveIndex(-1);
          } else {
            setIsOpen(true);
            setActiveIndex(0);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          setIsOpen(true);
          setActiveIndex(0);
          break;
        case "ArrowUp":
          e.preventDefault();
          setIsOpen(true);
          setActiveIndex(optionsLength - 1);
          break;
        case "Escape":
          if (isOpen) {
            setIsOpen(false);
            setActiveIndex(-1);
            triggerRef.current?.focus();
          }
          break;
      }
    },
    [isOpen, setIsOpen, optionsLength, triggerRef],
  );

  const handleOptionKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, optionsLength - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIndex(optionsLength - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onSelect(index);
          setIsOpen(false);
          setActiveIndex(-1);
          triggerRef.current?.focus();
          break;
        case "Escape":
          setIsOpen(false);
          setActiveIndex(-1);
          triggerRef.current?.focus();
          break;
        case "Tab":
          setIsOpen(false);
          setActiveIndex(-1);
          break;
      }
    },
    [onSelect, setIsOpen, optionsLength, triggerRef],
  );

  return {
    activeIndex: resolvedActiveIndex,
    optionRefs,
    handleTriggerKeyDown,
    handleOptionKeyDown,
    resetActiveIndex,
  };
}
