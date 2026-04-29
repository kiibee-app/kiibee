import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const InlineRow = styled.div`
  display: grid;
  grid-template-columns: 80px minmax(0, 380px);
  gap: 0;
  align-items: center;
  width: 100%;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: stretch;
  }
`;

export const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Hint = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;

export const ControlWrap = styled.div`
  width: 100%;
  max-width: 460px;
`;

export const InlineControlWrap = styled.div`
  width: 100%;
  max-width: 380px;

  ${media.tablet} {
    width: 100%;
    max-width: 100%;
  }
`;

export const Swatch = styled.span<{ $color: string }>`
  flex: 0 0 auto;
  width: 40px;
  height: 24px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.neutral.GRAY_250};
`;
