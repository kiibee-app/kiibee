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
