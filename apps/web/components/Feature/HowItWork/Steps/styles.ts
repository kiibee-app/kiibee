import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { CARD_IMAGE_RATIOS } from "@/utils/landingUtils";

export const StepsSection = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  padding: 118px 112px;
`;

export const Inner = styled.div`
  max-width: 1216px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 71px;
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
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  width: 100%;

  ${media.tablet} {
    flex-direction: column;
    align-items: center;
  }
`;

export const GridItem = styled.div`
  flex: 1 1 0;
  min-width: 0;
  max-width: 392px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  will-change: transform;
  backface-visibility: hidden;

  ${media.tablet} {
    flex: none;
    max-width: 500px;
    align-items: stretch;
    will-change: auto;
  }
`;

export const ImgWrap = styled.div<{
  $ratio: (typeof CARD_IMAGE_RATIOS)[number];
}>`
  position: relative;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  padding-top: ${({ $ratio }) => $ratio}%;
  transition:
    transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 280ms cubic-bezier(0.2, 0.8, 0.2, 1);

  img {
    object-fit: cover;
    transition: transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1) !important;
  }
`;

export const Card = styled.div<{ $index: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  @media (hover: hover) {
    &:hover {
      ${ImgWrap} {
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
        transform: translateY(-8px);
      }

      img {
        transform: scale(1.04) !important;
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
