import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";
import { FOR_CREATORS_LAYOUT } from "@/utils/forCreatorsLayout";

export const Section = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  padding: clamp(3.5rem, 7.3vw, 6.5625rem)
    ${FOR_CREATORS_LAYOUT.sectionPaddingX};

  ${media.tablet} {
    padding: 2.5rem 1.25rem;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: ${FOR_CREATORS_LAYOUT.contentMaxWidth};
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex: 1 0 0;
  min-width: 0;

  ${media.desktop} {
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
  }
`;

export const ImageSection = styled.div`
  display: flex;
  align-items: flex-start;
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  height: auto;
  border-radius: 0.75rem;

  > #short-story-image-reveal {
    width: 100%;
  }
`;

export const StoryImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 37.0625 / 32.4375;
  border-radius: 0.75rem;
  object-fit: cover;
  will-change: transform;
  transform: translateZ(0);
`;

export const TextSection = styled.div`
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;

  > [data-scroll-reveal] {
    width: 100%;
  }
`;

export const Title = styled.h2`
  margin: 0;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-family: "Reddit Sans", sans-serif;
  font-size: clamp(2rem, 2.2vw, 2.5rem);
  font-style: normal;
  font-weight: 600;
  line-height: 1.15;
`;

export const Paragraph = styled.p`
  margin: 0;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-family: "Reddit Sans", sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
`;

export const ReadMoreButton = styled(GenericButton).attrs({
  variant: VARIANT.PRIMARY,
  size: SIZE.SM,
})`
  align-self: flex-start;
  margin-top: 0.625rem;
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
`;
