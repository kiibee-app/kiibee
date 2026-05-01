import React, { useRef, useState, useMemo } from "react";
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
};

export default function DropdownField({
  label,
  options,
  value,
  onChange,
  showSelectedIndicator = false,
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
                type="button"
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
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
