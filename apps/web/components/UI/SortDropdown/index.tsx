"use client";

import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowIcon } from "@/assets/icons/arrowIcon";
import { Directions } from "@/utils/ui";
import {
  Dropdown,
  DropdownItem,
  SortBox,
  Text,
} from "@/components/Feature/ExploreCreators/Hero/styles";
import { useClickOutside } from "@/hooks/useClickOutside";
import { MonoText } from "../Monotext";
import { DEFAULT_SORT, SORT_OPTIONS, SortValue } from "@/utils/sortOptions";

type Props = {
  options: typeof SORT_OPTIONS;
  value?: SortValue;
  onChange?: (value: SortValue) => void;
};

export default function SortDropdown({
  options,
  value = DEFAULT_SORT,
  onChange,
}: Props) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref,
    enabled: open,
    eventType: "click",
    handler: () => setOpen(false),
  });

  const handleSelect = (val: SortValue) => {
    setSelected(val);
    onChange?.(val);
    setOpen(false);
  };

  return (
    <SortBox ref={ref} onClick={() => setOpen((prev) => !prev)}>
      <Text>
        <MonoText $use="Body_Regular">{t("creators.sort")}</MonoText>
        <MonoText $use="Body_Regular">
          {t(`creators.${selected}`).toLowerCase()}
        </MonoText>
      </Text>

      <ArrowIcon direction={open ? Directions.UP : Directions.DOWN} />

      {open && (
        <Dropdown>
          {options
            .filter((opt) => opt.value !== selected)
            .map((opt) => (
              <DropdownItem
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
              >
                <Text>
                  <MonoText $use="Body_Regular">{t("creators.sort")}</MonoText>
                  <MonoText $use="Body_Regular">
                    {t(`creators.${opt.value}`).toLowerCase()}
                  </MonoText>
                </Text>
              </DropdownItem>
            ))}
        </Dropdown>
      )}
    </SortBox>
  );
}
