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

export const CollectionDetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const CollectionBackButton = styled.button`
  width: 36px;
  height: 36px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`;

export const CollectionDetailTitle = styled(MonoText).attrs({
  $use: "H5_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const CollectionDetailMeta = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
