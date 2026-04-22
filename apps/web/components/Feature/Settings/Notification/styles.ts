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

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FieldBox = styled.div`
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-radius: 8px;
  padding: 12px 20px;
  gap: 8px;

  box-shadow: 0 0 10px 0 ${({ theme }) => theme.colors.neutral.GRAY_300};
  cursor: pointer;
  max-width: 457px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
