import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const PanelStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const PaymentPanel = styled.section`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: 18px 18px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 26px;

  ${media.tablet} {
    padding: 16px;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
`;

export const ItemRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ControlWrap = styled.div`
  width: 100%;
  max-width: 460px;
`;
