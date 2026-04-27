import React, { useRef, useState } from "react";
import {
  Container,
  Label,
  InputWrapper,
  DateDisplay,
  DateText,
  DatePopup,
  DatePopupBody,
  DatePopupActions,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
const RangeCalendar = React.lazy(
  () => import("@/components/UI/Calendar/RangeCalendar"),
);
import { useClickOutside } from "@/hooks/useClickOutside";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
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
  const [open, setOpen] = useState(false);
  const [tempStart, setTempStart] = useState(start || "");
  const [tempEnd, setTempEnd] = useState(end || "");
  const ref = useRef<HTMLDivElement | null>(null);

  useClickOutside({ ref, enabled: open, handler: () => setOpen(false) });

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
      ? `${formatDate(tempStart)}${tempStart && tempEnd ? " - " : ""}${formatDate(tempEnd)}`
      : "Select date range";

  return (
    <Container ref={ref}>
      {label && <Label as={MonoText}>{label}</Label>}

      <InputWrapper
        style={{ position: "relative", backgroundColor: COLORS.primary.WHITE }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <DateDisplay onClick={() => setOpen((s) => !s)}>
            <DateText>{displayText}</DateText>
            <span aria-hidden>📅</span>
          </DateDisplay>

          {open && (
            <DatePopup role="dialog" aria-modal="false">
              <DatePopupBody>
                {/* Use custom range calendar here */}
                <div style={{ width: "100%" }}>
                  <React.Suspense fallback={<div>Loading calendar…</div>}>
                    <RangeCalendar
                      start={tempStart}
                      end={tempEnd}
                      onChangeStart={(v) => setTempStart(v)}
                      onChangeEnd={(v) => setTempEnd(v)}
                    />
                  </React.Suspense>
                </div>
              </DatePopupBody>

              <DatePopupActions>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "1px solid #eee",
                    background: "transparent",
                  }}
                >
                  Cancel
                </button>
                <GenericButton variant={VARIANT.PRIMARY} onClick={handleSave}>
                  Save
                </GenericButton>
              </DatePopupActions>
            </DatePopup>
          )}
        </div>
      </InputWrapper>
    </Container>
  );
}
