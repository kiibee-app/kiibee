import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import { FOR_CREATORS_LAYOUT } from "@/utils/forCreatorsLayout";

export const Section = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary.GRAY};
  padding: clamp(5rem, 7.3vw, 6.5625rem) ${FOR_CREATORS_LAYOUT.sectionPaddingX};
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
  max-width: ${FOR_CREATORS_LAYOUT.contentMaxWidth};
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
  display: flex;
  flex: 1 1 230px;
  align-items: flex-start;
  gap: 10px;
  width: 230px;
  max-width: 230px;
  min-width: 0;
  padding: 12px;
  box-sizing: border-box;
  height: ${({ $heightState }) =>
    $heightState === 3 ? "300px" : $heightState === 2 ? "270px" : "240px"};
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  touch-action: manipulation;
  will-change: height, transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  transition:
    height 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  background: ${({ theme }) => theme.colors.primary.BLACK};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      0deg,
      ${({ theme }) => theme.colors.primary.BLACK_20} 0%,
      ${({ theme }) => theme.colors.primary.BLACK_20} 100%
    );
    pointer-events: none;
    transition: opacity 0.5s ease;
  }

  ${media.tablet} {
    flex: 0 0 148px;
    width: 148px;
    max-width: 148px;
    height: ${({ $heightState }) =>
      $heightState === 3 ? "220px" : $heightState === 2 ? "190px" : "165px"};
    border-radius: 10px;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 4px;
  }

  &:hover img {
    transform: scale(1.06);
  }
`;

export const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 300px;
  object-fit: cover;
  object-position: left top;
  display: block;
  pointer-events: none;
  user-select: none;
  will-change: transform, filter;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  ${media.tablet} {
    height: 220px;
  }
`;

export const CardContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const CardTitle = styled.h2`
  ${({ theme }) => theme.typography.H4_SemiBold};
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const CardSubtitle = styled.p<{ $visible: boolean }>`
  ${({ theme }) => theme.typography.Body_SemiMedium};
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
`;

export const AnimatedCard = styled(Card)``;
