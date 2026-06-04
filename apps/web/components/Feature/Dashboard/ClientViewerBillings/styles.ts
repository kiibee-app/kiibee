import { MonoText } from "@/components/UI/Monotext";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const BillingShell = styled.section`
  width: 100%;
  box-sizing: border-box;
  padding: 40px 30px 30px;

  ${media.tablet} {
    padding: 24px 20px 20px;
  }

  ${media.mobileLg} {
    padding: 20px 16px 16px;
  }
`;

export const BillingHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 20px;
`;

export const BillingTableSection = styled.div`
  width: 100%;

  tbody tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  }
`;

export const ContentTitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 210px;
`;

export const RowNumber = styled.span`
  ${({ theme }) => theme.typography.Body_SemiBold};
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  width: 18px;
  flex: 0 0 18px;
`;

export const ContentThumb = styled.div`
  position: relative;
  width: 34px;
  height: 34px;
  overflow: hidden;
  border-radius: 4px;
  flex: 0 0 34px;
`;

export const PaymentMethodCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
`;

export const PaymentLogoWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  flex: 0 0 34px;
`;

export const SearchFilterWrap = styled.div`
  max-width: 230px;

  [role="search"] {
    width: 100%;
    max-width: 100%;
    min-height: 36px;
    max-height: 38px;
    padding: 8px 12px;
    border-radius: 8px;
    box-sizing: border-box;
  }

  ${media.tablet} {
    width: 100%;
  }

  ${media.mobileLg} {
    max-width: none;
  }
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
    align-items: center;
    gap: 12px;
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
    width: auto;
  }
`;

export const MethodsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MethodRow = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 12px;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};

  ${media.tablet} {
    padding: 16px 12px;
    gap: 12px;
  }

  ${media.mobileLg} {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    row-gap: 6px;
    column-gap: 12px;
  }
`;

export const CardIdentity = styled.div`
  display: flex;
  align-items: center;
  width: 350px;
  max-width: 350px;
  flex: 1 1 350px;
  min-width: 220px;
  gap: 16px;

  ${media.tablet} {
    width: auto;
    flex: 1 1 auto;
  }

  ${media.mobileLg} {
    width: auto;
    max-width: none;
    flex: 0 0 auto;
    min-width: 0;
  }
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

  ${media.mobileLg} {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const DefaultBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  gap: 10px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.primary.PALE_GREEN};
  ${({ theme }) => theme.typography.Body_Small}
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
  padding: 5px 10px;
  border-radius: 5px;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 150px;
  flex: 0 0 150px;
  gap: 24px;
  margin-left: 0;

  ${media.tablet} {
    width: auto;
    flex: 0 0 auto;
  }

  ${media.mobileLg} {
    grid-column: 2;
    grid-row: 1;
    margin-left: 0;
    gap: 16px;
    align-self: flex-start;
  }
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  cursor: pointer;
`;

export const ExpiryCell = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  max-width: 300px;
  flex: 1 1 300px;
  min-width: 180px;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  margin-left: 0;
  white-space: nowrap;

  ${media.tablet} {
    width: auto;
    flex: 0 0 auto;
  }

  ${media.mobileLg} {
    grid-column: 1;
    grid-row: 2;
    min-width: 0;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ErrorText = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  color: ${({ theme }) => theme.colors.primary.RED};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  ${media.mobileLg} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const InvoiceFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InvoiceDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 40px;

  ${media.mobileLg} {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const InvoiceField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InvoicePaymentMethod = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

export const InvoicePaymentLogo = styled.div`
  width: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const InvoiceContentDetails = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

export const InvoiceContentThumb = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 4px;
  overflow: hidden;
  flex: 0 0 44px;
`;

export const InvoiceContentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InvoiceShareButton = styled.div`
  display: flex;
  align-items: center;
`;
