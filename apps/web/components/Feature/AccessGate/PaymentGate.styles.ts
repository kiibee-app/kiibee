import styled, { css } from "styled-components";
import GenericButton from "@/components/UI/GenericButton";

export const PaymentCard = styled.section<{ $compact?: boolean }>`
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
  ${({ $compact }) =>
    $compact &&
    css`
      padding: 0;
      max-width: none;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      text-align: left;

      color: #202723;

      & p {
        font-size: 12px;
        line-height: 1.6;
        color: #68716b;
      }

      ${PaymentHeader} {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;
        margin-bottom: 20px;
        padding: 0 18px;
        h2 {
          color: #202723;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.4px;
          margin-bottom: 6px;
        }
      }

      ${PaymentIcon} {
        flex-basis: 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f0f5f1;
        border: 1px solid #e3ebe5;
        color: #45624e;
      }

      ${PaymentOptions} {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
        gap: 10px;
      }

      ${PaymentOption} {
        padding: 16px 12px 12px;
        gap: 10px;
        border-radius: 12px;
        background: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
        border: 1px solid #e5e9e6;
        h3 {
          color: #39463d;
          font-size: 12px;
          font-weight: 500;
        }
        & > p {
          font-size: 11px;
          min-height: 36px;
        }
      }

      ${PaymentPrice} {
        color: #202723;
        font-size: 28px;
        line-height: 1.2;
        font-weight: 600;
        letter-spacing: -0.6px;
        span {
          font-size: 11px;
        }
      }

      ${PaymentButton} {
        min-height: 36px;
        padding: 8px 10px;
        font-size: 12px;
        border-radius: 8px;
        transition:
          transform 150ms ease,
          box-shadow 150ms ease;
        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(20, 35, 25, 0.1);
        }
        &:focus-visible {
          outline: 2px solid #45624e;
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          transition: none;
          &:hover:not(:disabled) {
            transform: none;
          }
        }
      }

      ${({ theme }) => theme.media.mobileLg} {
        padding: 0;
        border-radius: 0;
      }
    `}
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
