import styled, { css, keyframes } from "styled-components";
import { media } from "@repo/ui/breakpoints";
import type { CreatorStatus } from "../../../types/creator-request";
import { Search, X } from "lucide-react";

export const AllCreatorsPanel = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const AllCreatorsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3.5)};
`;

export const AllCreatorsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const AllCreatorsTabs = styled.div`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 10px;
  padding: 0 ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(10.5)};
  min-width: 300px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    border-color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary.GREEN};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  }

  ${media.mobileLg} {
    min-width: 100%;
  }
`;

export const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary.muted};
  margin-right: ${({ theme }) => theme.spacing(2)};
`;

export const SearchIcon = styled(Search)`
  width: 18px;
  height: 18px;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary.main};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary.muted};
  }
`;

export const SearchClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary.muted};
  cursor: pointer;
  padding: 0;
  margin-left: ${({ theme }) => theme.spacing(1)};
  transition: color ${({ theme }) => theme.animations.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

export const ClearIcon = styled(X)`
  width: 16px;
  height: 16px;
`;

export const AllCreatorsTabButton = styled.button<{ $active: boolean }>`
  min-height: ${({ theme }) => theme.spacing(8.5)};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => `0 ${theme.spacing(3.5)}`};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.neutral.PALE_GREEN : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.GREEN_100 : theme.colors.secondary.muted};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.typography.Body_Bold.fontWeight};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast};
`;

export const AllCreatorsState = styled.div`
  padding: ${({ theme }) => `${theme.spacing(5)} ${theme.spacing(4)}`};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.Body_Medium.fontWeight};
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
    background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
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

  &:nth-child(6),
  &:nth-child(7) {
    vertical-align: middle;
  }
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
  font-weight: ${({ theme }) => theme.typography.Body_Medium.fontWeight};
`;

export const CreatorIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2.5)};
  min-width: 210px;
`;

export const CreatorAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.full};
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  font-size: 12px;
  font-weight: 800;
  overflow: hidden;
`;

export const CreatorAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  justify-content: flex-start;
  min-height: 28px;
  padding: ${({ theme }) => `0 ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.Body_Bold.fontWeight};
  gap: ${({ theme }) => theme.spacing(2)};
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

export const StatusDot = styled.span<{ $status: CreatorStatus }>`
  width: 7px;
  height: 7px;
  border-radius: 999px;
  flex-shrink: 0;

  ${({ $status, theme }) => {
    if ($status === "approved") {
      return css`
        background: ${theme.colors.primary.GREEN};
      `;
    }

    if ($status === "rejected") {
      return css`
        background: ${theme.colors.secondary.muted};
      `;
    }

    return css`
      background: ${theme.colors.primary.ORANGE};
    `;
  }}
`;

export const AccountStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 28px;
  padding: ${({ theme }) => `0 ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.Body_Bold.fontWeight};
  gap: ${({ theme }) => theme.spacing(2)};
  text-transform: capitalize;

  ${({ $status, theme }) => {
    if ($status === "active") {
      return css`
        background: ${theme.colors.neutral.PALE_GREEN};
        color: ${theme.colors.primary.GREEN_100};
      `;
    }

    if ($status === "pending-setup") {
      return css`
        background: ${theme.colors.primary.WHITE};
        color: ${theme.colors.primary.ORANGE};
        border: 1px solid ${theme.colors.primary.ORANGE};
      `;
    }

    return css`
      background: ${theme.colors.neutral.GRAY_100};
      color: ${theme.colors.secondary.main};
    `;
  }}
`;

export const PublicationBadge = styled.span<{ $published: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: ${({ theme }) => `0 ${theme.spacing(2.5)}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.Body_Bold.fontWeight};
  background: ${({ $published, theme }) =>
    $published
      ? theme.colors.neutral.PALE_GREEN
      : theme.colors.neutral.GRAY_100};
  color: ${({ $published, theme }) =>
    $published ? theme.colors.primary.GREEN_100 : theme.colors.secondary.muted};
`;

export const MetricGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
  min-width: 96px;
`;

export const RowActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const RowActionButton = styled.button<{
  $variant: "approve" | "reject";
}>`
  min-height: 36px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  padding: 0 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    background ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast},
    transform ${({ theme }) => theme.animations.fast};

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
          transform: translateY(-1px);
        }
      `;
    }

    return css`
      border: 1px solid ${theme.colors.secondary.border};
      background: ${theme.colors.neutral.WHITE};
      color: ${theme.colors.secondary.muted};

      &:hover:not(:disabled) {
        background: ${theme.colors.neutral.GRAY_100};
        border-color: ${theme.colors.secondary.border};
      }
    `;
  }}
`;

export const ActionIcon = styled.span<{ $variant: "approve" | "reject" }>`
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  color: ${({ $variant, theme }) =>
    $variant === "approve"
      ? theme.colors.neutral.WHITE
      : theme.colors.secondary.muted};
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

  ${media.mobileLg} {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
`;

export const PaginationControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  ${media.mobileLg} {
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

export const DrawerHeaderCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 24px;
`;

export const AvatarCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.GREEN} 0%,
    ${({ theme }) => theme.colors.neutral.DUSTY_TEAL} 100%
  );
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  box-shadow: ${({ theme }) => theme.shadows.md};
  user-select: none;
`;

export const DrawerHeaderName = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.main};
  letter-spacing: -0.02em;
`;

export const DrawerHeaderEmail = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  margin-top: -6px;
`;

export const DrawerSection = styled.div`
  margin-bottom: 24px;
`;

export const DrawerSectionTitle = styled.h5`
  margin: 0 0 10px 0;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DrawerCardList = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const DrawerCardItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const DrawerIconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.primary.GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2px;
`;

export const DrawerItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
`;

export const DrawerItemLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const DrawerItemValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary.main};
  word-break: break-word;
`;

export const DescriptionBlock = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary.muted};
  white-space: pre-wrap;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
