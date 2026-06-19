import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

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

  ${media.mobileMd} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
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
  border-radius: 8px;
  gap: 8px;
  max-width: 640px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
