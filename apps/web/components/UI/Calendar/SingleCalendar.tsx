import React, { useMemo, useState } from "react";
import {
  CalendarMonth,
  CalendarHeader,
  MonthTitle,
  WeekDays,
  DaysGrid,
  DayCell,
  DayButtonBase,
  DayButton,
  DaySelected,
  MonthNav,
  WeekDayCell,
  SingleCalendarWrapper,
  MonthNavLeft,
  MonthNavRight,
} from "./styles";
import { ArrowWrap } from "../InputFields/styles";
import { ArrowIcon } from "@/assets/icons";
import { Directions, WEEK_DAYS } from "@/utils/ui";
import {
  addMonths,
  daysInMonth,
  fromISO,
  startOfMonth,
  toISO,
} from "@/utils/formatDate";

type Props = {
  value?: string;
  onChange?: (iso: string) => void;
};

export default function SingleCalendar({ value, onChange }: Props) {
  const initialMonth = useMemo(() => {
    const s = fromISO(value);
    return s ? startOfMonth(s) : startOfMonth(new Date());
  }, [value]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);

  const renderMonth = (monthDate: Date) => {
    const days: Array<{ date: Date; iso: string; isOutside: boolean }> = [];

    const firstDay = startOfMonth(monthDate);
    const total = daysInMonth(monthDate);
    const startWeekday = firstDay.getDay();

    for (let i = 0; i < startWeekday; i++) {
      days.push({ date: new Date(0), iso: "", isOutside: true });
    }

    for (let d = 1; d <= total; d++) {
      const dt = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
      days.push({ date: dt, iso: toISO(dt), isOutside: false });
    }

    return (
      <CalendarMonth>
        <CalendarHeader>
          <MonthNavLeft>
            <ArrowWrap onClick={() => setCurrentMonth((m) => addMonths(m, -1))}>
              <ArrowIcon width={15} height={10} direction={Directions.LEFT} />
            </ArrowWrap>
          </MonthNavLeft>
          <MonthTitle>
            {monthDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </MonthTitle>
          <MonthNavRight>
            <ArrowWrap onClick={() => setCurrentMonth((m) => addMonths(m, 1))}>
              <ArrowIcon width={15} height={10} direction={Directions.RIGHT} />
            </ArrowWrap>
          </MonthNavRight>
        </CalendarHeader>

        <WeekDays>
          {WEEK_DAYS.map((w) => (
            <WeekDayCell key={w}>{w}</WeekDayCell>
          ))}
        </WeekDays>

        <DaysGrid>
          {days.map((d, i) => {
            if (d.isOutside) return <div key={`blank-${i}`} />;

            const iso = d.iso;
            const isSelected = value === iso;

            return (
              <DayCell key={iso}>
                <DayButtonBase
                  type="button"
                  onClick={() => onChange?.(iso)}
                  aria-pressed={isSelected}
                >
                  {isSelected ? (
                    <DaySelected>{new Date(iso).getDate()}</DaySelected>
                  ) : (
                    <DayButton>{new Date(iso).getDate()}</DayButton>
                  )}
                </DayButtonBase>
              </DayCell>
            );
          })}
        </DaysGrid>
      </CalendarMonth>
    );
  };

  return (
    <SingleCalendarWrapper>{renderMonth(currentMonth)}</SingleCalendarWrapper>
  );
}
