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
  MonthNavButton,
} from "./styles";
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
  const dayNumber = fromISO(iso)?.getDate() ?? new Date(iso).getDate();
  return isSelected ? (
    <DaySelected>{dayNumber}</DaySelected>
  ) : (
    <DayButton>{dayNumber}</DayButton>
  );
};

type Props = {
  value?: string;
  onChange?: (iso: string) => void;
  minDate?: string;
};

export default function SingleCalendar({ value, onChange, minDate }: Props) {
  const initialMonth = useMemo(() => {
    const s = fromISO(value);
    const mDate = s ? startOfMonth(s) : startOfMonth(new Date());
    if (minDate) {
      const minMonthDate = startOfMonth(fromISO(minDate) || new Date());
      if (mDate < minMonthDate) {
        return minMonthDate;
      }
    }
    return mDate;
  }, [value, minDate]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);

  const isPrevMonthDisabled = useMemo(() => {
    if (!minDate) return false;
    const minMonthDate = startOfMonth(fromISO(minDate) || new Date());
    return startOfMonth(currentMonth).getTime() <= minMonthDate.getTime();
  }, [currentMonth, minDate]);

  const renderDay = (d: CalendarDay, index: number) => {
    if (d.isOutside) return <div key={`blank-${index}`} />;

    const isSelected = value === d.iso;
    const isDisabled = !!minDate && d.iso < minDate;

    return (
      <DayCell key={d.iso}>
        <DayButtonBase
          type="button"
          onClick={() => !isDisabled && onChange?.(d.iso)}
          disabled={isDisabled}
          aria-disabled={isDisabled}
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
            <MonthNavButton
              type="button"
              disabled={isPrevMonthDisabled}
              onClick={() => setCurrentMonth((m) => addMonths(m, -1))}
            >
              <ArrowIcon width={15} height={10} direction={Directions.LEFT} />
            </MonthNavButton>
          </MonthNavLeft>
          <MonthTitle>{formatMonthYear(monthDate)}</MonthTitle>
          <MonthNavRight>
            <MonthNavButton
              type="button"
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            >
              <ArrowIcon width={15} height={10} direction={Directions.RIGHT} />
            </MonthNavButton>
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
