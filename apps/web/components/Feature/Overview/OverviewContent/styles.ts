import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Wrapper = styled.div`
  padding: 8px 28px;
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
  font-size: 13px;
  cursor: pointer;
`;

export const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
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
  font-size: 13px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatValue = styled.div`
  font-size: 28px;
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
  font-size: 20px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary.BLACK};
`;
