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
  fromISO,
  startOfMonth,
  getCalendarDays,
  formatMonthYear,
  CalendarDay,
} from "@/utils/formatDate";

const renderDayContent = (iso: string, isSelected: boolean) => {
  const dayNumber = new Date(iso).getDate();
  return isSelected ? (
    <DaySelected>{dayNumber}</DaySelected>
  ) : (
    <DayButton>{dayNumber}</DayButton>
  );
};

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

  const renderDay = (d: CalendarDay, index: number) => {
    if (d.isOutside) return <div key={`blank-${index}`} />;

    const isSelected = value === d.iso;

    return (
      <DayCell key={d.iso}>
        <DayButtonBase
          type="button"
          onClick={() => onChange?.(d.iso)}
          aria-pressed={isSelected}
        >
          {renderDayContent(d.iso, isSelected)}
        </DayButtonBase>
      </DayCell>
    );
  };

  const renderMonth = (monthDate: Date) => {
    const days = getCalendarDays(monthDate);

    return (
      <CalendarMonth>
        <CalendarHeader>
          <MonthNavLeft>
            <ArrowWrap onClick={() => setCurrentMonth((m) => addMonths(m, -1))}>
              <ArrowIcon width={15} height={10} direction={Directions.LEFT} />
            </ArrowWrap>
          </MonthNavLeft>
          <MonthTitle>{formatMonthYear(monthDate)}</MonthTitle>
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

        <DaysGrid>{days.map(renderDay)}</DaysGrid>
      </CalendarMonth>
    );
  };

  return (
    <SingleCalendarWrapper>{renderMonth(currentMonth)}</SingleCalendarWrapper>
  );
}
