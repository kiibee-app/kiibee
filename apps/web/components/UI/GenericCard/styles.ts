import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const Card = styled.div<{ $width?: string }>`
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
  width: ${({ $width }) => $width || "100%"};
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

export const Footer = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  > * {
    flex: 1;
    min-width: 0;
  }
`;
