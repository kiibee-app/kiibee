import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { CARD_IMAGE_RATIOS } from "@/utils/landingUtils";
import { type CardHeightState } from "@/utils/creatorAnimations";

export const StepsSection = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 118px 112px;

  [data-creator-hero-line],
  [data-creator-hero-animate],
  [data-creator-card] {
    opacity: 0;
    visibility: hidden;
  }

  ${media.tablet} {
    padding: 80px 24px;
  }

  ${media.mobileXl} {
    padding: 60px 24px;
  }
`;

export const Inner = styled.div`
  max-width: 1216px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 71px;

  ${media.tablet} {
    gap: 48px;
  }
`;

export const HeaderGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
`;

export const Heading = styled.h2`
  margin: 0;
  text-align: center;
`;

export const Subtitle = styled.p`
  margin: 0;
  text-align: center;
  max-width: 580px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: flex-end;
  width: 100%;
  min-height: 410px;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 20px;
    align-items: stretch;
    min-height: auto;
  }

  ${media.mobileMd} {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const GridItem = styled.div`
  min-width: 0;
  width: 100%;
  display: flex;
  align-items: flex-end;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);

  ${media.tablet} {
    align-items: stretch;
    will-change: auto;

    &:nth-child(3) {
      grid-column: 1 / -1;
      justify-self: center;
      width: 100%;
      max-width: calc(50% - 10px);
    }
  }

  ${media.mobileMd} {
    &:nth-child(3) {
      grid-column: auto;
      max-width: 100%;
    }
  }
`;

export const ImgWrap = styled.div<{
  $heightState: CardHeightState;
}>`
  position: relative;
  width: 100%;
  height: ${({ $heightState }) =>
    $heightState === 3 ? "300px" : $heightState === 2 ? "270px" : "240px"};
  border-radius: 14px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  transition:
    height 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s ease;

  ${media.tablet} {
    height: 220px;
  }

  img {
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  cursor: pointer;
  touch-action: manipulation;
  transform: translateZ(0);

  @media (hover: hover) {
    &:hover {
      ${ImgWrap} {
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
      }

      img {
        transform: scale(1.05) !important;
      }
    }
  }
`;

export const CardTitle = styled.h3`
  margin: 1rem 0 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  ${media.tablet} {
    margin-top: 0.75rem;
  }
`;

export const CardText = styled.p`
  margin: 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};

  ${media.tablet} {
    margin-bottom: 0.5rem;
  }
`;

export { CARD_IMAGE_RATIOS };
