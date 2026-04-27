import React, { useRef, useState, useMemo } from "react";
import {
  Container,
  Label,
  Field,
  Selected,
  Menu,
  Item,
  ArrowWrap,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { Directions } from "@/utils/ui";
import { useClickOutside } from "@/hooks/useClickOutside";

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
};

export default function DropdownField({
  label,
  options,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useClickOutside({ ref, enabled: open, handler: () => setOpen(false) });

  const selected = useMemo(() => {
    return options.find((o) => o.value === value) || options[0] || null;
  }, [options, value]);

  return (
    <Container ref={ref} style={{ position: "relative" }}>
      {label && <Label as={MonoText}>{label}</Label>}

      <div style={{ position: "relative" }}>
        <Field
          onClick={() => setOpen((s) => !s)}
          role="button"
          aria-haspopup="listbox"
        >
          <Selected>
            <span>
              {selected
                ? selected.label || selected.labelKey || selected.value
                : ""}
            </span>
          </Selected>

          <ArrowWrap>
            <ArrowIcon direction={open ? Directions.UP : Directions.DOWN} />
          </ArrowWrap>
        </Field>

        {open && (
          <Menu role="listbox">
            {options.map((opt) => (
              <Item
                key={opt.value}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label || opt.labelKey || opt.value}
              </Item>
            ))}
          </Menu>
        )}
      </div>
    </Container>
  );
}
