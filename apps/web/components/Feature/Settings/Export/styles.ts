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

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FieldBox = styled.div`
  border-radius: 8px;
  padding: 12px 20px;
  gap: 8px;
  max-width: 640px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
