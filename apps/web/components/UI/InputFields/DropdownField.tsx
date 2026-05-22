import React, { useId, useRef, useState, useMemo } from "react";
import {
  Container,
  Label,
  Field,
  Selected,
  Menu,
  Item,
  ItemContent,
  ItemCheckIndicator,
  ArrowWrap,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { SelectedCheckIcon } from "@/assets/icons";
import { Directions, Direction } from "@/utils/ui";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDropdownKeyboard } from "@/hooks/useDropdownKeyboard";

export type OptionItem = {
  value: string;
  label?: string;
  labelKey?: string;
};

type Props = {
  label?: React.ReactNode;
  options: OptionItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showSelectedIndicator?: boolean;
  renderSelectedValue?: (selected: OptionItem | null) => React.ReactNode;
  arrowDirection?: Direction;
};

export default function DropdownField({
  label,
  options,
  value,
  onChange,
  showSelectedIndicator = false,
  renderSelectedValue,
  arrowDirection,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const uid = useId();
  const listboxId = `dropdown-listbox-${uid}`;

  const selected = useMemo(() => {
    return options.find((o) => o.value === value) || options[0] || null;
  }, [options, value]);

  const {
    activeIndex,
    optionRefs,
    handleTriggerKeyDown,
    handleOptionKeyDown,
    resetActiveIndex,
  } = useDropdownKeyboard({
    isOpen: open,
    setIsOpen: setOpen,
    optionsLength: options.length,
    onSelect: (index) => onChange?.(options[index].value),
    triggerRef,
  });

  useClickOutside({
    ref: containerRef,
    enabled: open,
    handler: () => {
      setOpen(false);
      resetActiveIndex();
    },
  });

  return (
    <Container ref={containerRef} style={{ position: "relative" }}>
      {label && <Label as={MonoText}>{label}</Label>}

      <div style={{ position: "relative" }}>
        <Field
          ref={triggerRef as React.Ref<HTMLDivElement>}
          onClick={() => {
            setOpen((s) => !s);
            resetActiveIndex();
          }}
          onKeyDown={handleTriggerKeyDown}
          role="combobox"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
        >
          <Selected>
            {renderSelectedValue ? (
              renderSelectedValue(selected)
            ) : (
              <span>
                {selected
                  ? selected.label || selected.labelKey || selected.value
                  : ""}
              </span>
            )}
          </Selected>

          <ArrowWrap>
            <ArrowIcon
              direction={
                arrowDirection || (open ? Directions.UP : Directions.DOWN)
              }
            />
          </ArrowWrap>
        </Field>

        {open && (
          <Menu
            role="listbox"
            id={listboxId}
            data-lenis-prevent
            data-lenis-prevent-touch
            data-lenis-prevent-wheel
          >
            {options.map((opt, i) => (
              <Item
                key={opt.value}
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={activeIndex === i}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                  resetActiveIndex();
                  triggerRef.current?.focus();
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, i)}
              >
                <ItemContent>
                  {opt.label || opt.labelKey || opt.value}
                </ItemContent>
                {showSelectedIndicator ? (
                  <ItemCheckIndicator aria-hidden="true">
                    <SelectedCheckIcon
                      selected={selected?.value === opt.value}
                    />
                  </ItemCheckIndicator>
                ) : null}
              </Item>
            ))}
          </Menu>
        )}
      </div>
    </Container>
  );
}
