import React, { useId, useMemo, useRef, useState } from "react";
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
import { Directions } from "@/utils/ui";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDropdownKeyboard } from "@/hooks/useDropdownKeyboard";

export type OptionItem = {
  value: string;
  label?: React.ReactNode;
  labelKey?: string;
};

type SharedProps = {
  label?: React.ReactNode;
  options: OptionItem[];
  placeholder?: string;
  showSelectedIndicator?: boolean;
};

type SingleProps = SharedProps & {
  multi?: false;
  value?: string;
  onChange?: (value: string) => void;
  renderSelectedValue?: (selected: OptionItem | null) => React.ReactNode;
  renderSelectedValues?: never;
};

type MultiProps = SharedProps & {
  multi: true;
  value?: string[];
  onChange?: (value: string[]) => void;
  renderSelectedValues?: (selected: OptionItem[]) => React.ReactNode;
  renderSelectedValue?: never;
};

type Props = SingleProps | MultiProps;

export default function DropdownField(props: Props) {
  const { label, options, placeholder, showSelectedIndicator = false } = props;
  const multi = props.multi === true;
  const onChange = props.onChange;
  const value = props.value;
  const renderSelectedValue =
    !multi && "renderSelectedValue" in props
      ? props.renderSelectedValue
      : undefined;
  const renderSelectedValues =
    multi && "renderSelectedValues" in props
      ? props.renderSelectedValues
      : undefined;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const uid = useId();
  const listboxId = `dropdown-listbox-${uid}`;

  const isControlled = value !== undefined;
  const [internalSingleValue, setInternalSingleValue] = useState<
    string | undefined
  >(undefined);
  const [internalMultiValue, setInternalMultiValue] = useState<string[]>([]);

  const resolvedSingleValue = useMemo(() => {
    if (isControlled) {
      return Array.isArray(value) ? undefined : value;
    }
    return internalSingleValue ?? options[0]?.value;
  }, [internalSingleValue, isControlled, options, value]);

  const resolvedMultiValues = useMemo(
    () =>
      isControlled
        ? Array.isArray(value)
          ? value
          : value
            ? [value]
            : []
        : internalMultiValue,
    [internalMultiValue, isControlled, value],
  );

  const getOptionLabel = (opt: OptionItem) =>
    opt.label || opt.labelKey || opt.value;

  const selected = useMemo(
    () =>
      multi || !resolvedSingleValue
        ? null
        : (options.find((o) => o.value === resolvedSingleValue) ?? null),
    [multi, options, resolvedSingleValue],
  );

  const selectedOptions = useMemo(() => {
    const selectedSet = new Set(resolvedMultiValues);
    return multi ? options.filter((o) => selectedSet.has(o.value)) : [];
  }, [multi, options, resolvedMultiValues]);

  const closeDropdown = () => {
    setOpen(false);
    resetActiveIndex();
    triggerRef.current?.focus();
  };

  const commitSingle = (nextValue: string) => {
    if (!isControlled) setInternalSingleValue(nextValue);
    (onChange as SingleProps["onChange"])?.(nextValue);
    closeDropdown();
  };

  const commitMulti = (nextValue: string) => {
    const isSelected = resolvedMultiValues.includes(nextValue);
    const updated = isSelected
      ? resolvedMultiValues.filter((v) => v !== nextValue)
      : [...resolvedMultiValues, nextValue];

    if (!isControlled) setInternalMultiValue(updated);
    (onChange as MultiProps["onChange"])?.(updated);
  };

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
    onSelect: (index) => {
      const nextValue = options[index].value;
      if (!multi) return commitSingle(nextValue);
      return commitMulti(nextValue);
    },
    triggerRef,
    keepOpenOnSelect: multi,
  });

  useClickOutside({
    ref: containerRef,
    enabled: open,
    handler: () => {
      setOpen(false);
      resetActiveIndex();
    },
  });

  const renderTriggerValue = () =>
    multi
      ? renderSelectedValues
        ? renderSelectedValues(selectedOptions)
        : selectedOptions.length === 0
          ? (placeholder ?? "")
          : `${selectedOptions.slice(0, 2).map(getOptionLabel).join(", ")}${
              selectedOptions.length > 2
                ? ` +${selectedOptions.length - 2}`
                : ""
            }`
      : renderSelectedValue
        ? renderSelectedValue(selected)
        : selected
          ? getOptionLabel(selected)
          : (placeholder ?? "");

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
            {renderTriggerValue ? (
              renderTriggerValue()
            ) : (
              <span>
                {selected
                  ? selected.label || selected.labelKey || selected.value
                  : ""}
              </span>
            )}
          </Selected>

          <ArrowWrap>
            <ArrowIcon direction={open ? Directions.UP : Directions.DOWN} />
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
                  if (!multi) return commitSingle(opt.value);
                  return commitMulti(opt.value);
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, i)}
              >
                <ItemContent>{getOptionLabel(opt)}</ItemContent>
                {showSelectedIndicator ? (
                  <ItemCheckIndicator aria-hidden="true">
                    <SelectedCheckIcon
                      selected={
                        multi
                          ? resolvedMultiValues.includes(opt.value)
                          : resolvedSingleValue === opt.value
                      }
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
