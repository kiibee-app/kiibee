import styled from "styled-components";
import { media } from "@kiibee/ui/breakpoints";

export const HeroWrapper = styled.div`
  padding: 110px;

  ${media.tablet} {
    padding: 60px 40px;
  }
`;

export const HeroContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 25px;

  ${media.tablet} {
    gap: 18px;
  }
`;

export const ActionButton = styled.button`
  width: fit-content;
  padding: 10px 18px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }

  ${media.tablet} {
    padding: 9px 16px;
  }
`;

export const TopBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  justify-content: space-between;

  ${media.tablet} {
    padding-bottom: 16px;
  }
`;

export const BackButtonWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  width: 100%;

  ${media.tablet} {
    flex-direction: column;
    gap: 24px;
  }
`;

export const HeroImage = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  min-width: 500px;
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  overflow: hidden;
  max-height: 350px;

  ${media.tablet} {
    min-width: 100%;
    max-height: 280px;
  }
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${media.tablet} {
    gap: 6px;
  }
`;
