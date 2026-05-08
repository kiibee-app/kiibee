import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Container,
  Label,
  InputWrapper,
  DateDisplay,
  DateText,
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
};

export default function DateRangeField({
  label,
  start,
  end,
  onChangeStart,
  onChangeEnd,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tempStart, setTempStart] = useState(start || "");
  const [tempEnd, setTempEnd] = useState(end || "");
  const [pos, setPos] = useState({ top: 0, left: 0 });

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
    onChangeStart?.(tempStart);
    onChangeEnd?.(tempEnd);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempStart(start || "");
    setTempEnd(end || "");
    setOpen(false);
  };

  const displayText =
    tempStart || tempEnd
      ? `${formatDate(tempStart)}${
          tempStart && tempEnd ? " - " : ""
        }${formatDate(tempEnd)}`
      : t("common.selectDateRange");

  return (
    <Container ref={wrapperRef}>
      {label && <Label as={MonoText}>{label}</Label>}

      <InputWrapper>
        <DateDisplay onClick={openPopup}>
          <DateText>{displayText}</DateText>
          <CalendarIcon color={COLORS.primary.BLACK_90} />
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
