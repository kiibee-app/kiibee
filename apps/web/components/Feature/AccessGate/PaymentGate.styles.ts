import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";

export const PaymentCard = styled.section`
  box-sizing: border-box;
  width: 100%;
  max-width: 680px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
  color: ${({ theme }) => theme.colors.secondary.main};
  box-shadow: 0 8px 32px rgba(4, 41, 11, 0.06);
  font-family: inherit;
  & p {
    margin: 0;
    color: ${({ theme }) => theme.colors.secondary.muted};
    line-height: 1.6;
    font-size: 14px;
  }
  ${({ theme }) => theme.media.mobileLg} {
    padding: 20px;
    border-radius: 16px;
  }
`;
export const PaymentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 24px;
  h2 {
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 650;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.primary.GREEN_100};
  }
`;
export const PaymentIcon = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
`;
export const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 16px;
`;
export const PaymentOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 20px;
  min-width: 0;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_200};
  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary.GREEN_100};
  }
`;
export const PaymentPrice = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 30px;
  font-weight: 650;
  letter-spacing: -0.8px;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
  span {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0;
    color: ${({ theme }) => theme.colors.secondary.muted};
  }
`;
export const PaymentButton = styled(GenericButton)`
  margin-top: auto;
`;
export const PaymentError = styled.p`
  margin-top: 16px !important;
  color: ${({ theme }) => theme.colors.primary.RED} !important;
`;
