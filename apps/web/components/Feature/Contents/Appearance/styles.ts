import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { MonoText } from "@/components/UI/Monotext";

export const PanelStack = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 24px;
  width: 100%;
`;

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

export const CounterRow = styled.div`
  width: 100%;
  max-width: 460px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CounterText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
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

export const ItemRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const UploadButton = styled.div`
  button {
    width: fit-content;
    padding: 14px 24px;
    box-shadow: none;
  }
`;

export const ToggleWrap = styled.div`
  display: flex;
  gap: 4px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_300};
  border-radius: 8px;
  overflow: hidden;
  min-width: 160px;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.WHITE : theme.colors.primary.BLACK};
`;

export const LogoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${media.tablet} {
    flex-direction: column;
    align-items: flex-start;
  }
`;
