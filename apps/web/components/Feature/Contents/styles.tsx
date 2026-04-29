import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

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
  padding-top: 22px;
`;

export const PlaceholderLine = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;

export const CreateCollectionModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
