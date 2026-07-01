import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Container,
  Label,
  InputWrapper,
  DateDisplay,
  DateText,
  DateFieldActions,
  DateCalendarButton,
  DatePopupActions,
  CancelButton,
  DatePopup,
  DatePopupScroll,
  DatePopupBody,
  DatePopupWrapper,
  BorderedDateDisplay,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import SingleCalendar from "@/components/UI/Calendar/SingleCalendar";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import { CalendarIcon } from "@/assets/icons";
import { formatDate, toISO } from "@/utils/formatDate";
import { useTranslation } from "react-i18next";
import { MOUSE_DOWN } from "@/utils/common";
import { canUseDOM, getPopupPosition } from "@/utils/ui";

type Props = {
  label?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function DatePickerField({
  label,
  value,
  onChange,
  placeholder,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value || toISO(new Date()));
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const hasValue = !!value;
  const displayText = hasValue
    ? formatDate(value)
    : placeholder || t("common.selectDate");

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener(MOUSE_DOWN, handleClickOutside);
    return () => document.removeEventListener(MOUSE_DOWN, handleClickOutside);
  }, [open]);

  const openPopup = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();

    if (rect) {
      setPos(getPopupPosition(rect));
    }
    setTempValue(value || toISO(new Date()));
    setOpen(true);
  };

  const handleSave = () => {
    if (tempValue) {
      onChange?.(tempValue);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value || toISO(new Date()));
    setOpen(false);
  };

  const handleCalendarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (open) {
      setOpen(false);
    } else {
      openPopup();
    }
  };

  return (
    <Container ref={wrapperRef}>
      {label && <Label as={MonoText}>{label}</Label>}

      <InputWrapper>
        <BorderedDateDisplay onClick={openPopup}>
          <DateText $isPlaceholder={!hasValue}>{displayText}</DateText>
          <DateFieldActions>
            <DateCalendarButton
              type="button"
              aria-label={placeholder || t("common.selectDate")}
              onClick={handleCalendarClick}
            >
              <CalendarIcon color={COLORS.primary.BLACK_90} />
            </DateCalendarButton>
          </DateFieldActions>
        </BorderedDateDisplay>

        {open &&
          canUseDOM &&
          createPortal(
            <DatePopupWrapper ref={popupRef}>
              <DatePopup $top={pos.top} $left={pos.left}>
                <DatePopupScroll style={{ padding: "16px" }}>
                  <DatePopupBody
                    style={{ paddingBottom: 0, borderBottom: "none" }}
                  >
                    <SingleCalendar value={tempValue} onChange={setTempValue} />
                  </DatePopupBody>
                  <DatePopupActions style={{ marginTop: "12px" }}>
                    <CancelButton type="button" onClick={handleCancel}>
                      {t("common.cancel")}
                    </CancelButton>
                    <GenericButton
                      type="button"
                      variant={VARIANT.PRIMARY}
                      onClick={handleSave}
                      disabled={!tempValue}
                    >
                      {t("common.save")}
                    </GenericButton>
                  </DatePopupActions>
                </DatePopupScroll>
              </DatePopup>
            </DatePopupWrapper>,
            document.body,
          )}
      </InputWrapper>
    </Container>
  );
}
