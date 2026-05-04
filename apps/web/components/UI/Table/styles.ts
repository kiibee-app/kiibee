import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { TABLE_STATUS } from "@/utils/tableStatus";
import { TABLE_ALIGN, TableAlign } from "@/utils/ui";
import { MonoText } from "../Monotext";

export const TableContainer = styled.div`
  width: 100%;
  background-color: transparent;
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
  background-color: transparent;
  border-radius: 16px;

  ${media.tablet} {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

export const DesktopHeaderRow = styled.tr`
  ${media.tablet} {
    display: none;
  }
`;

export const DesktopRow = styled.tr`
  transition: background 0.2s ease;
  cursor: default;

  ${media.tablet} {
    display: none;
  }

  &:hover {
    background: transparent;
  }
`;

export const ClickableDesktopRow = styled(DesktopRow)<{ $clickable?: boolean }>`
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    background: ${({ $clickable, theme }) =>
      $clickable ? theme.colors.neutral.GRAY_100 : "transparent"};
  }
`;

export const TableHead = styled.th<{
  $align?: TableAlign;
  $clickable?: boolean;
}>`
  text-align: ${({ $align }) => $align ?? TABLE_ALIGN.LEFT};
  padding: 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

export const HeaderContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 14px;
`;

export const TableCell = styled.td<{ $align?: TableAlign }>`
  padding: 16px 12px;
  text-align: ${({ $align }) => $align ?? TABLE_ALIGN.LEFT};

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

export const ClickableMobileHeader = styled(MobileHeader)<{
  $clickable?: boolean;
}>`
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
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

  ${media.mobileLg} {
    color: ${({ theme }) => theme.colors.primary.BLACK};
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 6px;
  min-width: 90px;
  height: 28px;
  white-space: nowrap;
  text-transform: capitalize;
  border: none;
  cursor: default;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  background-color: ${({ $status, theme }) => {
    if ($status === TABLE_STATUS.COMPLETED)
      return theme.colors.secondary.MEDIUM_GREEN;
    if ($status === TABLE_STATUS.PENDING) return theme.colors.primary.ORANGE;
    if ($status === TABLE_STATUS.REJECTED) return theme.colors.primary.RED;
    return theme.colors.neutral.GRAY_400;
  }};
  ${MonoText} {
    color: inherit;
  }
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
