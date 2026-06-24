import styled, { css, keyframes } from "styled-components";
import Link from "next/link";
import { STAT_ACCENT, type StatAccent } from "../../../utils/constants";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const HomeStatsLayout = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(2)} 0 0`};
  width: 100%;
`;

export const HomeStatsGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ $columns }) => $columns ?? 4},
    minmax(0, 1fr)
  );
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;

  @media (max-width: ${({ theme }) => theme.media.desktop}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.media.mobileLg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing(2.5)};
  }
`;

export const StatCard = styled.article<{
  $accent: StatAccent;
}>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2.5)};
  min-height: 148px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $accent, theme }) => getAccentColor($accent, theme)};
  }
`;

export const StatCardLink = styled(Link)<{
  $accent: StatAccent;
}>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2.5)};
  min-height: 148px;
  padding: ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $accent, theme }) => getAccentColor($accent, theme)};
  }
`;

function getAccentColor(
  $accent: StatAccent,
  theme: {
    colors: {
      primary: { BLUE: string; GREEN_100: string; ORANGE: string };
      neutral: { DUSTY_TEAL: string };
      gradient: { DARK_BLUE: string };
    };
  },
) {
  switch ($accent) {
    case STAT_ACCENT.BLUE:
      return theme.colors.primary.BLUE;
    case STAT_ACCENT.GREEN:
      return theme.colors.primary.GREEN_100;
    case STAT_ACCENT.TEAL:
      return theme.colors.neutral.DUSTY_TEAL;
    case STAT_ACCENT.ORANGE:
      return theme.colors.primary.ORANGE;
    case STAT_ACCENT.PURPLE:
      return theme.colors.gradient.DARK_BLUE;
    default:
      return theme.colors.primary.GREEN_100;
  }
}

export const StatCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const StatIconWrap = styled.div<{
  $accent: StatAccent;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  flex-shrink: 0;

  ${({ $accent, theme }) => {
    switch ($accent) {
      case STAT_ACCENT.BLUE:
        return css`
          background: rgba(59, 130, 246, 0.12);
          color: ${theme.colors.primary.BLUE};
        `;
      case STAT_ACCENT.GREEN:
        return css`
          background: ${theme.colors.neutral.PALE_GREEN};
          color: ${theme.colors.primary.GREEN_100};
        `;
      case STAT_ACCENT.TEAL:
        return css`
          background: rgba(95, 138, 138, 0.14);
          color: ${theme.colors.neutral.DUSTY_TEAL};
        `;
      case STAT_ACCENT.ORANGE:
        return css`
          background: rgba(249, 115, 22, 0.12);
          color: ${theme.colors.primary.ORANGE};
        `;
      case STAT_ACCENT.PURPLE:
        return css`
          background: rgba(30, 58, 138, 0.12);
          color: ${theme.colors.gradient.DARK_BLUE};
        `;
      default:
        return css`
          background: ${theme.colors.neutral.PALE_GREEN};
          color: ${theme.colors.primary.GREEN_100};
        `;
    }
  }}
`;

export const StatLabel = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.Body_Medium.fontWeight};
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const StatValue = styled.p`
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.colors.secondary.main};
  letter-spacing: -0.02em;
`;

export const StatHint = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;

export const StatSkeleton = styled.div`
  width: 100%;
  min-height: 148px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral.GRAY_100} 25%,
    ${({ theme }) => theme.colors.neutral.WHITE} 50%,
    ${({ theme }) => theme.colors.neutral.GRAY_100} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

export const HomeStatsState = styled.div`
  width: 100%;
  max-width: 480px;
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing(5)};
  border: 1px solid ${({ theme }) => theme.colors.secondary.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary.muted};
`;
