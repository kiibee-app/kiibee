import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Wrapper = styled.div`
  padding: 8px 28px;

  ${media.tablet} {
    padding: 8px 20px;
  }
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  ${media.tablet} {
    justify-content: flex-start;
  }
`;

export const TopRowResponsive = styled(TopRow)`
  flex-wrap: wrap;
  gap: 12px;
`;

export const RangeGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const RangeButton = styled.button<{ $active?: boolean }>`
  ${({ theme }) => theme.typography.Body_Medium};
  padding: 8px 14px;
  border-radius: 999px;
  background: ${(p) =>
    p.$active
      ? p.theme.colors.primary.BLACK
      : p.theme.colors.neutral.OFF_WHITE};
  color: ${(p) =>
    p.$active ? p.theme.colors.primary.WHITE : p.theme.colors.primary.BLACK};
  border: 1px solid
    ${(p) => (p.$active ? "transparent" : p.theme.colors.primary.GRAY)};
  cursor: pointer;
`;

export const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
`;

export const PerformanceSection = styled.section`
  margin-top: 36px;

  ${media.tablet} {
    margin-top: 28px;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0 0 18px 0;
  ${({ theme }) => theme.typography.H5_Medium};
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary.BLACK};

  ${media.tablet} {
    margin-bottom: 16px;
  }
`;

export const TableCard = styled.div`
  width: 100%;
  border-radius: 24px;
  background: ${(p) => p.theme.colors.neutral.WHITE};
  box-shadow:
    0 10px 28px ${(p) => p.theme.colors.neutral.GRAY_300},
    0 2px 6px ${(p) => p.theme.colors.gredint.CARD_SHADOW};
  overflow: hidden;

  && table {
    width: 100%;
    min-width: 720px;
    border-collapse: collapse;
  }

  && th {
    padding: 26px 22px;
    border-bottom: 1px solid ${(p) => p.theme.colors.neutral.GRAY_200};
  }

  && td {
    padding: 26px 22px;
  }

  && th:first-child,
  && td:first-child {
    width: 40%;
  }

  ${media.tablet} {
    border-radius: 18px;

    && table {
      min-width: 640px;
    }

    && th,
    && td {
      padding: 20px 16px;
    }
  }
`;

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const TablePagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px 22px;
  border-top: 1px solid ${(p) => p.theme.colors.neutral.GRAY_200};

  ${media.tablet} {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }
`;

export const PaginationSummary = styled.div`
  ${({ theme }) => theme.typography.Body_Medium};
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${media.tablet} {
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

export const PaginationNavButton = styled.button`
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.neutral.GRAY_200};
  background: ${(p) => p.theme.colors.neutral.WHITE};
  color: ${(p) => p.theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const PaginationPages = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PaginationPageButton = styled.button<{ $active?: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid
    ${(p) =>
      p.$active
        ? p.theme.colors.primary.BLACK
        : p.theme.colors.neutral.GRAY_200};
  background: ${(p) =>
    p.$active ? p.theme.colors.primary.BLACK : p.theme.colors.neutral.WHITE};
  color: ${(p) =>
    p.$active ? p.theme.colors.primary.WHITE : p.theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.Body_Medium};
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
`;

export const PaginationArrow = styled.span<{ $next?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: ${(p) => (p.$next ? "rotate(180deg)" : "none")};
`;

export const PerformanceTable = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;

  ${media.tablet} {
    min-width: 640px;
  }
`;

type TableCellProps = {
  $numeric?: boolean;
};

export const TableHeadCell = styled.th<TableCellProps>`
  padding: 26px 22px;
  border-bottom: 1px solid ${(p) => p.theme.colors.neutral.GRAY_200};
  ${({ theme }) => theme.typography.Body_Medium};
  font-weight: 500;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
  text-align: ${(p) => (p.$numeric ? "center" : "left")};
  white-space: nowrap;

  &:first-child {
    width: 40%;
  }

  ${media.tablet} {
    padding: 20px 16px;
  }
`;

export const TableNameCell = styled.td`
  padding: 26px 22px;

  ${media.tablet} {
    padding: 20px 16px;
  }
`;

export const TableBodyCell = styled.td<TableCellProps>`
  padding: 26px 22px;
  ${({ theme }) => theme.typography.H5_Medium};
  font-weight: 500;
  color: ${(p) => p.theme.colors.neutral.GRAY_700};
  text-align: ${(p) => (p.$numeric ? "center" : "left")};

  ${media.tablet} {
    padding: 20px 16px;
  }
`;

export const ContentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  ${media.tablet} {
    gap: 12px;
  }
`;

export const ContentIcon = styled.span`
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
  flex-shrink: 0;
`;

export const ContentLabel = styled.span`
  ${({ theme }) => theme.typography.H5_Medium};
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary.BLACK};
`;

export const ChartCard = styled.section`
  margin-top: 28px;
  border-radius: 24px;
  background: ${(p) => p.theme.colors.neutral.WHITE};
  box-shadow:
    0 18px 40px ${(p) => p.theme.colors.neutral.GRAY_300},
    0 1px 2px ${(p) => p.theme.colors.gredint.CARD_SHADOW};
  padding: 22px 18px 14px;

  ${media.tablet} {
    margin-top: 24px;
    padding: 18px 12px 10px;
  }
`;

export const ChartScroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.neutral.GRAY_200};
    border-radius: 999px;
  }
`;

export const ChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  font-family: inherit;
`;

export const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 20px 22px;
  min-height: 84px;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.neutral.WHITE};
  box-shadow:
    0 6px 16px ${(p) => p.theme.colors.neutral.GRAY_300},
    0 1px 2px ${(p) => p.theme.colors.gredint.CARD_SHADOW};
`;

export const StatLabel = styled.div`
  ${({ theme }) => theme.typography.Body_Medium};
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatValue = styled.div`
  ${({ theme }) => theme.typography.Heading3};
  font-weight: 800;
  color: ${(p) => p.theme.colors.primary.BLACK};
  margin-top: 12px;
`;

export const StatDot = styled.span<{ $color?: string }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
  background: ${(p) => p.$color ?? "transparent"};
`;

export const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
  ${({ theme }) => theme.typography.H5_Medium};
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary.BLACK};
`;
