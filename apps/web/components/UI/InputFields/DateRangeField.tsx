import React, { useRef, useState } from "react";
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
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
const RangeCalendar = React.lazy(
  () => import("@/components/UI/Calendar/RangeCalendar"),
);
import { useClickOutside } from "@/hooks/useClickOutside";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { CalendarIcon } from "@/assets/icons";
import COLORS from "@repo/ui/colors";

type Props = {
  label?: React.ReactNode;
  start?: string;
  end?: string;
  onChangeStart?: (value: string) => void;
  onChangeEnd?: (value: string) => void;
};

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  } catch {
    return "";
  }
}

export default function DateRangeField({
  label,
  start,
  end,
  onChangeStart,
  onChangeEnd,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [tempStart, setTempStart] = useState(start || "");
  const [tempEnd, setTempEnd] = useState(end || "");
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useClickOutside({
    ref: wrapperRef,
    enabled: open,
    handler: () => setOpen(false),
  });

  const openPopup = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();

    if (rect) {
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }

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
      : "Select date range";

  return (
    <Container ref={wrapperRef}>
      {label && <Label as={MonoText}>{label}</Label>}

      <InputWrapper>
        <DateDisplay onClick={openPopup}>
          <DateText>{displayText}</DateText>
          <CalendarIcon color={COLORS.primary.BLACK_90} />
        </DateDisplay>

        {open &&
          createPortal(
            <DatePopup $top={pos.top} $left={pos.left}>
              <DatePopupBody>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <RangeCalendar
                    start={tempStart}
                    end={tempEnd}
                    onChangeStart={setTempStart}
                    onChangeEnd={setTempEnd}
                  />
                </React.Suspense>
              </DatePopupBody>

              <DatePopupActions>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>

                <GenericButton variant={VARIANT.PRIMARY} onClick={handleSave}>
                  Save
                </GenericButton>
              </DatePopupActions>
            </DatePopup>,
            document.body,
          )}
      </InputWrapper>
    </Container>
  );
}
