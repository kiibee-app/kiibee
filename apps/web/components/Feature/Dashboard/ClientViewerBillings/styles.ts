import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const BillingShell = styled.section`
  width: 100%;
  padding: 16px 0 0;

  ${media.tablet} {
    padding: 16px 20px 0;
  }
`;

export const BillingHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 20px;
`;

export const Tabs = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 20px;
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 0;
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary.BLACK : "transparent"};
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary.BLACK : theme.colors.neutral.GRAY_400};
  cursor: pointer;
  padding: 0 0 10px;
`;

export const PaymentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  padding-bottom: 12px;

  ${media.tablet} {
    align-items: flex-start;
  }

  ${media.mobileLg} {
    flex-direction: column;
  }
`;

export const AddCardButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 9px 16px;
  border: 0;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  cursor: pointer;

  ${media.mobileLg} {
    width: 100%;
    justify-content: center;
  }
`;

export const MethodsList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MethodRow = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 180px auto;
  align-items: center;
  min-height: 72px;
  gap: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};

  ${media.tablet} {
    grid-template-columns: 1fr;
    align-items: flex-start;
    gap: 10px;
    padding: 18px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  }
`;

export const CardIdentity = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 16px;
`;

export const CardLogoWrap = styled.div`
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 32px;
`;

export const CardLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 12px;
`;

export const DefaultBadge = styled.span`
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  padding: 4px 10px;
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;

  ${media.tablet} {
    align-self: flex-end;
    margin-top: -30px;
  }
`;

export const IconButton = styled.button`
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  cursor: pointer;
`;

export const ExpiryCell = styled.div`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;
