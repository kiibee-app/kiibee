import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const CalendarWrapper = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  position: relative;
  background: ${({ theme }) => theme.colors.primary.WHITE};

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
    transform: translateX(-50%);

    ${media.mobileXl} {
      display: none;
    }
  }
`;

export const CalendarMonth = styled.div`
  min-width: 260px;
  flex: 1;

  ${media.mobileXl} {
    min-width: unset;
  }
`;

export const DesktopOnly = styled.div`
  ${media.mobileXl} {
    display: none;
  }
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const MonthTitle = styled.div`
  ${({ theme }) => theme.typography.Body_SemiBold};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

export const DayCell = styled.div`
  text-align: center;
`;

export const DayButton = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const DayButtonBase = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;

    ${DayButton} {
      color: ${({ theme }) => theme.colors.neutral.GRAY_300};
    }
  }
`;

export const DaySelected = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const DayInRange = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const MonthNavButton = styled.button`
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const WeekDayCell = styled.div`
  text-align: center;
`;

export const SingleCalendarWrapper = styled(CalendarWrapper)`
  gap: 0;
  &::before {
    display: none;
  }
`;

export const MonthNavLeft = styled(MonthNav)`
  margin-right: auto;
`;

export const MonthNavRight = styled(MonthNav)`
  margin-left: auto;
`;
