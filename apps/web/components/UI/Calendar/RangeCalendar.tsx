import React, { useMemo, useState } from "react";
import {
  CalendarWrapper,
  CalendarMonth,
  CalendarHeader,
  MonthTitle,
  WeekDays,
  DaysGrid,
  DayButton,
  DaySelected,
  DayInRange,
} from "../InputFields/styles";
import { CalendarNavButton, ArrowWrap } from "../InputFields/styles";

type Props = {
  start?: string;
  end?: string;
  onChangeStart?: (iso: string) => void;
  onChangeEnd?: (iso: string) => void;
};

const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fromISO(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

export default function RangeCalendar({
  start,
  end,
  onChangeStart,
  onChangeEnd,
}: Props) {
  const initialLeft = useMemo(() => {
    const s = fromISO(start);
    return s ? startOfMonth(s) : startOfMonth(new Date());
  }, [start]);

  const [leftMonth, setLeftMonth] = useState<Date>(initialLeft);

  const rightMonth = useMemo(() => addMonths(leftMonth, 1), [leftMonth]);

  const renderMonth = (monthDate: Date) => {
    const days = [] as Array<{ date: Date; iso: string; isOutside: boolean }>;
    const firstDay = startOfMonth(monthDate);
    const total = daysInMonth(monthDate);
    const startWeekday = firstDay.getDay();

    // add blanks for previous month
    for (let i = 0; i < startWeekday; i++) {
      days.push({ date: new Date(0), iso: "", isOutside: true });
    }

    for (let d = 1; d <= total; d++) {
      const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
      days.push({ date: dt, iso: toISO(dt), isOutside: false });
    }

    return (
      <CalendarMonth key={monthDate.getMonth()}>
        <CalendarHeader>
          <MonthTitle>
            {monthDate.toLocaleString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </MonthTitle>
        </CalendarHeader>

        <WeekDays>
          {WEEK_DAYS.map((w) => (
            <div key={w} style={{ textAlign: "center" }}>
              {w}
            </div>
          ))}
        </WeekDays>

        <DaysGrid>
          {days.map((d, i) => {
            if (d.isOutside) return <div key={`blank-${i}`} />;

            const iso = d.iso;
            const isStart = start === iso;
            const isEnd = end === iso;
            const inRange = start && end ? iso > start && iso < end : false;

            return (
              <div key={iso} style={{ textAlign: "center" }}>
                <button
                  onClick={() => {
                    if (!start || (start && end)) {
                      onChangeStart?.(iso);
                      onChangeEnd?.("");
                    } else if (start && !end) {
                      if (iso < start) {
                        onChangeStart?.(iso);
                      } else {
                        onChangeEnd?.(iso);
                      }
                    }
                  }}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                  aria-pressed={isStart || isEnd}
                  aria-label={`Select ${iso}`}
                >
                  {isStart || isEnd ? (
                    <DaySelected>{new Date(iso).getDate()}</DaySelected>
                  ) : inRange ? (
                    <DayInRange>{new Date(iso).getDate()}</DayInRange>
                  ) : (
                    <DayButton type="button">
                      {new Date(iso).getDate()}
                    </DayButton>
                  )}
                </button>
              </div>
            );
          })}
        </DaysGrid>
      </CalendarMonth>
    );
  };

  return (
    <CalendarWrapper>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CalendarNavButton
          onClick={() => setLeftMonth((m) => addMonths(m, -1))}
          aria-label="Prev month"
        >
          <ArrowWrap>◀</ArrowWrap>
        </CalendarNavButton>
      </div>

      {renderMonth(leftMonth)}
      {renderMonth(rightMonth)}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CalendarNavButton
          onClick={() => setLeftMonth((m) => addMonths(m, 1))}
          aria-label="Next month"
        >
          <ArrowWrap>▶</ArrowWrap>
        </CalendarNavButton>
      </div>
    </CalendarWrapper>
  );
}
