import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary.GRAY};
  padding: clamp(5rem, 7.3vw, 6.5625rem) clamp(1.25rem, 7.7vw, 6.9375rem);
  box-sizing: border-box;
  overflow: hidden;

  [data-creator-hero-line],
  [data-creator-hero-animate],
  [data-creator-card] {
    opacity: 0;
    visibility: hidden;
  }

  ${media.tablet} {
    padding: 5rem 1rem 2.5rem;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 76.125rem;
  gap: 3.5rem;
  box-sizing: border-box;

  ${media.tablet} {
    gap: 2rem;
  }
`;

export const CopyBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 48rem;

  ${media.tablet} {
    gap: 1.25rem;
  }
`;

export const Heading = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  font-family: "Reddit Sans", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: clamp(2rem, 3.2vw, 2.75rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-align: center;
`;

export const HeadingLine = styled.span`
  display: block;
`;

export const CTAButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.LG,
})`
  align-self: center;
  min-width: 10.5rem;
  border-radius: 0.5rem;
`;

export const CardsRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: stretch;
  gap: 17px;
  width: 100%;
  min-height: 300px;

  ${media.tablet} {
    gap: 0.5rem;
    min-height: 220px;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

type CardProps = {
  $heightState: 1 | 2 | 3;
};

export const Card = styled.div<CardProps>`
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: ${({ $heightState }) =>
    $heightState === 3 ? "300px" : $heightState === 2 ? "255px" : "220px"};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  touch-action: manipulation;
  will-change: height;
  transition: height 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  background: ${({ theme }) => theme.colors.primary.BLACK};

  ${media.tablet} {
    flex: 0 0 148px;
    max-width: 148px;
    height: ${({ $heightState }) =>
      $heightState === 3 ? "220px" : $heightState === 2 ? "190px" : "165px"};
    border-radius: 12px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 4px;
  }
`;

export const CardImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
  display: block;
  pointer-events: none;
  user-select: none;
`;

export const AnimatedCard = styled(Card)``;
