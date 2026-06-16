import styled from "styled-components";

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  border-radius: 16px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const BalanceCard = styled.div`
  background: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 12px;
  border-radius: 12px;
  width: 100%;
  max-width: 410px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 0 14px 0 ${({ theme }) => theme.colors.neutral.GRAY_300};
`;

export const SmallCards = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
`;

export const SmallCard = styled.div`
  background: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 12px;
  border-radius: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 200px;
  box-shadow: 0 0 14px 0 ${({ theme }) => theme.colors.neutral.GRAY_300};
`;

export const PayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 30px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.GRAY};
  margin: 6px 0;
`;

export const FooterNote = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const InvoiceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InvoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 32px;

  ${({ theme }) => theme.media.mobileLg} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const InvoiceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InvoiceLabel = styled.span`
  ${({ theme }) => theme.typography.Body_Medium};
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;

export const InvoicePaymentMethod = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

export const InvoiceLogoWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
`;

export const InvoiceContentMeta = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const InvoiceThumb = styled.div`
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  overflow: hidden;
  flex: 0 0 34px;
`;

export const InvoiceContentText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InvoiceShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  min-height: 32px;
  padding: 8px 14px;
  border: 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
`;
