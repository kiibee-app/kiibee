import styled from "styled-components";

export const CalendarWrapper = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: ${({ theme }) => theme.colors.neutral.GRAY_200};
    transform: translateX(-50%);
  }
`;

export const CalendarMonth = styled.div`
  min-width: 300px;
  flex: 1;
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

export const DayButtonBase = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

export const DayButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const DaySelected = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const DayInRange = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Body_Regular};
`;

export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const WeekDayCell = styled.div`
  text-align: center;
`;
