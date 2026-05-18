import styled, { css, keyframes } from "styled-components";
import type { CreatorStatus } from "../../../types/creator-request";

export const AllCreatorsPanel = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const AllCreatorsState = styled.div`
  padding: 20px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const TableScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const RequestsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const RequestTableRow = styled.tr`
  cursor: pointer;
  transition: background ${({ theme }) => theme.animations.fast};

  &:hover td {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  }
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.secondary.main};
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
`;

export const TableBodyCell = styled.td`
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.secondary.muted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
  vertical-align: top;
`;

export const CreatorCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CreatorName = styled.span`
  color: ${({ theme }) => theme.colors.secondary.main};
  font-weight: 600;
`;

export const MiniText = styled.span`
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 12px;
  font-weight: 500;
`;

export const DescriptionText = styled.div`
  display: -webkit-box;
  overflow: hidden;
  max-width: 320px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const StatusBadge = styled.span<{ $status: CreatorStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;

  ${({ $status, theme }) => {
    if ($status === "approved") {
      return css`
        background: ${theme.colors.neutral.PALE_GREEN};
        color: ${theme.colors.primary.GREEN_100};
      `;
    }

    if ($status === "rejected") {
      return css`
        background: ${theme.colors.neutral.GRAY_100};
        color: ${theme.colors.secondary.main};
      `;
    }

    return css`
      background: ${theme.colors.primary.WHITE};
      color: ${theme.colors.primary.ORANGE};
      border: 1px solid ${theme.colors.primary.ORANGE};
    `;
  }}
`;

export const RowActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RowActionButton = styled.button<{
  $variant: "approve" | "reject";
}>`
  min-height: 32px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  padding: 0 12px;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast};

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  ${({ $variant, theme }) => {
    if ($variant === "approve") {
      return css`
        border: 1px solid ${theme.colors.primary.GREEN};
        background: ${theme.colors.primary.GREEN};
        color: ${theme.colors.neutral.WHITE};

        &:hover:not(:disabled) {
          background: ${theme.colors.neutral.DUSTY_TEAL};
          border-color: ${theme.colors.neutral.DUSTY_TEAL};
        }
      `;
    }

    return css`
      border: 1px solid ${theme.colors.secondary.border};
      background: ${theme.colors.neutral.WHITE};
      color: ${theme.colors.secondary.RED};

      &:hover:not(:disabled) {
        background: ${theme.colors.neutral.GRAY_100};
      }
    `;
  }}
`;

export const PaginationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.secondary.muted};
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  @media (max-width: ${({ theme }) => theme.media.mobileLg}) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

export const PaginationControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: ${({ theme }) => theme.media.mobileLg}) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  min-width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary.GREEN : theme.colors.secondary.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.neutral.PALE_GREEN : theme.colors.neutral.WHITE};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.GREEN_100 : theme.colors.secondary.muted};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const Ellipsis = styled.span`
  min-width: 24px;
  text-align: center;
`;

export const PageSize = styled.select`
  min-width: 96px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.secondary.muted};
  padding: 0 10px;
  font-size: 13px;
  font-weight: 600;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DetailFieldLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const DetailFieldValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.secondary.main};
  word-break: break-word;
`;

export const LinkText = styled.a`
  color: ${({ theme }) => theme.colors.primary.BLUE};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const skeletonPulse = keyframes`
  0% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.55;
  }
`;

export const SkeletonLine = styled.span<{ $width?: string; $height?: string }>`
  display: block;
  width: ${({ $width }) => $width ?? "100%"};
  height: ${({ $height }) => $height ?? "12px"};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  animation: ${skeletonPulse} 1.25s ease-in-out infinite;
`;
