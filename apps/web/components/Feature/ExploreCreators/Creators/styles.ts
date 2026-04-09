import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 85px 112px;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
  ${media.tablet} {
    padding: 40px 24px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border-radius: 12px;
  gap: 8px;
  align-items: stretch;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  min-height: 315px;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 0 10.483px 0 ${({ theme }) => theme.colors.gredint.CARD_SHADOW};
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  min-height: 190px;
  padding: 12px 178px 154px 10px;
  align-items: center;
  align-self: stretch;
  border-radius: 12px 12px 0 0;
  ${media.tablet} {
    padding: 0;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Badge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 5px 8px;
  border-radius: 5px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.colors.primary.GREEN_50};
  }
`;
