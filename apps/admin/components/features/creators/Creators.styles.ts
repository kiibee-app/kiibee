import styled from "styled-components";

export const EngagementList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const EngagementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const EngagementAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const EngagementMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const EngagementName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const EngagementEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const EngagementMeta = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

export const EngagementDate = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const EngagementSubDate = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.secondary.muted};
  margin-top: 2px;
`;

export const ContentStatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const ContentStatBadge = styled.span<{
  $variant?: "buy" | "rent" | "download";
}>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme, $variant }) =>
    $variant === "buy"
      ? theme.colors.neutral.PALE_GREEN
      : $variant === "rent"
        ? theme.colors.primary.WHITE
        : theme.colors.neutral.GRAY_100};
  color: ${({ theme, $variant }) =>
    $variant === "buy"
      ? theme.colors.primary.GREEN_100
      : $variant === "rent"
        ? theme.colors.primary.ORANGE
        : theme.colors.secondary.muted};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "rent" ? theme.colors.primary.ORANGE : "transparent"};
`;

export const ClickableContentCard = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 0;
  text-align: left;
  cursor: pointer;
  transition: box-shadow ${({ theme }) => theme.animations.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;
