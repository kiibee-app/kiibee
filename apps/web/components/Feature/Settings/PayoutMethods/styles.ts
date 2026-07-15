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
  align-items: flex-start;
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
