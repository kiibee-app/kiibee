import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { TABLE_STATUS } from "@/utils/tableStatus";
import { TABLE_ALIGN, TableAlign } from "@/utils/ui";
import { MonoText } from "../Monotext";

export const TableContainer = styled.div`
  width: 100%;
  background-color: transparent;
  border-radius: 8px;

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

export const HeaderFilterRow = styled.tr`
  ${media.tablet} {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 14px 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  }

  ${media.mobileLg} {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const HeaderFilterCell = styled.th<{ $align?: TableAlign }>`
  text-align: ${({ $align }) => $align ?? TABLE_ALIGN.LEFT};
  padding: 14px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};

  ${media.tablet} {
    display: block;
    width: auto;
    box-sizing: border-box;
    padding: 0;
    border-bottom: 0;

    &:empty {
      display: none;
    }
  }

  ${media.mobileLg} {
    width: 100%;
  }
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

export const NoDataCell = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  ${({ theme }) => theme.typography.Body_Regular};
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
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  margin-top: 12px;
  padding: 10px 0 16px;
  position: relative;
  z-index: 1;

  ${media.tablet} {
    justify-content: center;
    padding: 10px 0 0;
    flex-wrap: wrap;
  }
`;

export const PaginationMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  flex-wrap: wrap;
`;

export const PaginationMetaLabel = styled.span`
  ${({ theme }) => theme.typography.Body_Medium};
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const PaginationMetaSelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

export const PaginationMetaSelectTrigger = styled.button`
  position: relative;
  width: 56px;
  height: 32px;
  padding: 0 24px 0 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  ${({ theme }) => theme.typography.Body_Medium};
  box-sizing: border-box;
  line-height: 1;
  cursor: pointer;
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.secondary.DEFAULT};
    outline-offset: 1px;
  }
`;

export const PaginationMetaSelectChevron = styled.span<{ $open?: boolean }>`
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%)
    rotate(${({ $open }) => ($open ? "-90deg" : "90deg")});
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  pointer-events: none;
  transition: transform 0.15s ease;

  svg {
    display: block;
  }
`;

export const PageSizeMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
`;

export const PageSizeMenuItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  min-width: 48px;
  padding: 8px 12px;
  border: 0;
  border-radius: 4px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.neutral.GRAY_100 : "transparent"};
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  ${({ theme }) => theme.typography.Body_Medium};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  }
`;

export const PaginationControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const PaginationNumberGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const PaginationEllipsis = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
  ${({ theme }) => theme.typography.Body_Medium};
  user-select: none;
`;

export const PageNumberButton = styled(PaginationButton)<{ $active?: boolean }>`
  min-width: 32px;
  width: 32px;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.WHITE : theme.colors.neutral.GRAY_500};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.GREEN_100 : theme.colors.primary.WHITE};
  border-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.GREEN_100 : theme.colors.neutral.GRAY_200};
`;

export const PaginationChevron = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export const PaginationNextChevron = styled(PaginationChevron)`
  transform: rotate(180deg);
`;
