import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { media } from "@repo/ui/breakpoints";
import { typography } from "@repo/ui/typography";

export const PageShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - 110px);
  padding: 24px;

  ${({ theme }) => theme.media.tablet} {
    gap: 14px;
    padding: 20px;
  }

  ${({ theme }) => theme.media.mobile} {
    gap: 12px;
    padding: 16px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  align-self: flex-start;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 10;
  margin: 0 -24px;
  padding: 0 24px 2px;
  background: ${({ theme }) => theme.colors.primary.WHITE};

  ${({ theme }) => theme.media.tablet} {
    margin: 0 -20px;
    padding: 0 20px 10px;
  }

  ${({ theme }) => theme.media.mobile} {
    margin: 0 -16px;
    padding: 0 16px 8px;
  }
`;
export const ContentsTabsSlot = styled.div`
  flex-shrink: 0;
  width: 100%;
`;

export const ContentsScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
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
  border-radius: 8px;
  padding: 10px 28px;
  min-height: 36px;
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
  padding: 8px 24px;
  min-height: 36px;
  border-radius: 8px;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const PlusMark = styled.span`
  font-size: 22px;
  line-height: 1;
  font-weight: 300;
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
`;

export const CreateCollectionModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EmptyCollectionCard = styled.div`
  display: flex;
  padding: 20px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
`;

export const EmptyCollectionsView = styled.div`
  display: flex;
  min-height: 280px;
  padding: 48px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const EmptyCollectionText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 640px;
  gap: 8px;
`;

export const EmptyCollectionTitle = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;
