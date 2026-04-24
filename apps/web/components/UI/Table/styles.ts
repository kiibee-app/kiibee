import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { TABLE_STATUS } from "@/utils/tableStatus";

export const TableContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 8px;
  overflow-x: auto;

  ${media.tablet} {
    background: transparent;
    border: none;
    box-shadow: none;
  }
`;

export const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;

  ${media.tablet} {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

export const DesktopHeaderRow = styled.tr`
  background: ${({ theme }) => theme.colors.primary.WHITE};

  ${media.tablet} {
    display: none;
  }
`;

export const DesktopRow = styled.tr`
  transition: background 0.2s ease;

  ${media.tablet} {
    display: none;
  }
`;

export const TableHead = styled.th`
  text-align: left;
  padding: 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
`;

export const TableCell = styled.td`
  padding: 16px 12px;
  text-align: left;

  ${media.tablet} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 6px 0;
    border-bottom: none;
  }
`;

export const MobileRow = styled.div<{ $isOpen?: boolean }>`
  display: none;

  ${media.tablet} {
    display: block;
    width: 100%;
    border-radius: 10px;
    margin-bottom: 10px;
    background: ${({ theme }) => theme.colors.primary.WHITE};
    overflow: hidden;
    transition: all 0.3s ease;
  }
`;

export const MobileHeader = styled.div`
  display: none;

  ${media.tablet} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    cursor: pointer;
  }
`;

export const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease;
  padding: ${({ $isOpen }) => ($isOpen ? "8px 16px" : "0 16px")};
`;

export const HeaderLabel = styled.span`
  flex: 1;
  display: none;

  ${media.tablet} {
    display: inline-block;
  }
`;

export const MobileDataRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
`;

export const ValueText = styled.span`
  flex: 2;
  text-align: right;
`;

export const NoDataCell = styled.td`
  text-align: center;
  padding: 30px;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatusBadge = styled.button<{ $status: string }>`
  display: flex;
  width: 80px;
  flex: 1 0 0;
  padding: 2px 10px;
  gap: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: none;
  outline: none;
  cursor: default;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-transform: none;
  white-space: nowrap;
  background-color: ${({ $status, theme }) => {
    if ($status === TABLE_STATUS.COMPLETED)
      return theme.colors.secondary.MEDIUM_GREEN;
    if ($status === TABLE_STATUS.PENDING) return theme.colors.primary.ORANGE;
    if ($status === TABLE_STATUS.REJECTED) return theme.colors.primary.RED;
    return theme.colors.neutral.GRAY_400;
  }};
`;

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 12px;
  padding: 8px 0 4px;

  ${media.tablet} {
    justify-content: center;
    padding: 10px 0 0;
    flex-wrap: wrap;
  }
`;

export const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  background: ${({ theme }) => theme.colors.primary.WHITE};
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const PageNumberButton = styled(PaginationButton)<{ $active?: boolean }>`
  min-width: 32px;
  width: 32px;
  padding: 0;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.WHITE : theme.colors.neutral.GRAY};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.primary.WHITE};
  border-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.primary.GRAY};
`;
