import styled from "styled-components";
import { typography } from "@repo/ui/typography";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { media } from "@repo/ui/breakpoints";

export const PageShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - 110px);
  padding: 12px 30px 30px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Title = styled(MonoText).attrs({
  $use: "H4_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 14px;
  background: ${COLORS.primary.BLACK};
  color: ${COLORS.primary.WHITE};
  padding: 16px 22px;
  min-height: 48px;
  cursor: pointer;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  padding: 16px 32px;
  min-height: 48px;
  cursor: pointer;
  border: 1px solid ${COLORS.primary.GRAY};
  background: ${COLORS.neutral.OFF_WHITE};
  color: ${COLORS.primary.BLACK};

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled(CreateButton)`
  padding: 16px 32px;
`;

export const PlusMark = styled.span`
  font-size: 22px;
  line-height: 1;
  font-weight: 300;
`;

export const TabsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  border: 0;
  background: transparent;
  padding: 10px 0;
  cursor: pointer;
  font-family: ${typography.Body_SemiBold.fontFamily};
  font-weight: ${typography.Body_SemiBold.fontWeight};
  line-height: ${typography.Body_SemiBold.lineHeight};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY};

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -3px;
    height: 2px;
    border-radius: 999px;
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary.BLACK : theme.colors.gredint.TRANSPARENT};
  }
`;

export const SearchButton = styled.button`
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ContentPanel = styled.div`
  padding-top: 6px;
`;

export const PlaceholderLine = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;

export const AppearancePanel = styled.section`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: 18px 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 26px;

  ${media.tablet} {
    padding: 16px;
  }
`;

export const ActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const baseActionButton = `
  border: 0;
  border-radius: 14px;
  padding: 14px 28px;
  cursor: pointer;
  font-family: ${typography.Body_Medium.fontFamily};
  font-weight: ${typography.Body_Medium.fontWeight};
  line-height: ${typography.Body_Medium.lineHeight};
`;

export const SecondaryActionButton = styled.button`
  ${baseActionButton}
  background: ${({ theme }) => theme.colors.primary.GRAY};
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const PrimaryActionButton = styled.button`
  ${baseActionButton}
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
export const CreateCollectionModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
