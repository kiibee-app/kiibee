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
  DatePopup,
  DatePopupBody,
  DatePopupActions,
  CancelButton,
  DatePopupWrapper,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
const RangeCalendar = React.lazy(
  () => import("@/components/UI/Calendar/RangeCalendar"),
);
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { CalendarIcon } from "@/assets/icons";
import { CrossIcon } from "@/assets/icons/crossIcon";
import COLORS from "@repo/ui/colors";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "react-i18next";
import { MOUSE_DOWN } from "@/utils/common";
import { canUseDOM } from "@/utils/ui";

type Props = {
  label?: React.ReactNode;
  start?: string;
  end?: string;
  onChangeStart?: (value: string) => void;
  onChangeEnd?: (value: string) => void;
  onChangeRange?: (start: string, end: string) => void;
};

export default function DateRangeField({
  label,
  start,
  end,
  onChangeStart,
  onChangeEnd,
  onChangeRange,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tempStart, setTempStart] = useState(start || "");
  const [tempEnd, setTempEnd] = useState(end || "");
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const hasValue = !!(start || end);
  const displayText = hasValue
    ? `${formatDate(start)}${start && end ? " - " : ""}${formatDate(end)}`
    : t("common.selectDateRange");

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
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setTempStart(start || "");
    setTempEnd(end || "");

    setOpen(true);
  };

  const handleSave = () => {
    if (onChangeRange) {
      onChangeRange(tempStart, tempEnd);
    } else {
      onChangeStart?.(tempStart);
      onChangeEnd?.(tempEnd);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setTempStart(start || "");
    setTempEnd(end || "");
    setOpen(false);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onChangeRange) {
      onChangeRange("", "");
      return;
    }
    onChangeStart?.("");
    onChangeEnd?.("");
  };

  const handleCalendarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    openPopup();
  };

  return (
    <Container ref={wrapperRef}>
      {label && <Label as={MonoText}>{label}</Label>}

      <InputWrapper>
        <DateDisplay onClick={openPopup}>
          <DateText $isPlaceholder={!hasValue}>{displayText}</DateText>
          <DateFieldActions>
            {hasValue && (
              <DateCalendarButton
                type="button"
                aria-label={t("common.clearSearch")}
                onClick={handleClear}
              >
                <CrossIcon
                  width={18}
                  height={18}
                  crossColor={COLORS.neutral.GRAY_400}
                />
              </DateCalendarButton>
            )}
            <DateCalendarButton
              type="button"
              aria-label={t("common.selectDateRange")}
              onClick={handleCalendarClick}
            >
              <CalendarIcon color={COLORS.primary.BLACK_90} />
            </DateCalendarButton>
          </DateFieldActions>
        </DateDisplay>

        {open &&
          canUseDOM &&
          createPortal(
            <DatePopupWrapper ref={popupRef}>
              <DatePopup $top={pos.top} $left={pos.left}>
                <DatePopupBody>
                  <React.Suspense fallback={<div>{t("common.loading")}</div>}>
                    <RangeCalendar
                      start={tempStart}
                      end={tempEnd}
                      onChangeStart={setTempStart}
                      onChangeEnd={setTempEnd}
                    />
                  </React.Suspense>
                </DatePopupBody>

                <DatePopupActions>
                  <CancelButton onClick={handleCancel}>
                    {t("common.cancel")}
                  </CancelButton>
                  <GenericButton variant={VARIANT.PRIMARY} onClick={handleSave}>
                    {t("common.save")}
                  </GenericButton>
                </DatePopupActions>
              </DatePopup>
            </DatePopupWrapper>,
            document.body,
          )}
      </InputWrapper>
    </Container>
  );
}
