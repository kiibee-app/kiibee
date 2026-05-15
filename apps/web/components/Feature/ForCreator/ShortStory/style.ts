import styled from "styled-components";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  box-sizing: border-box;

  ${media.tablet} {
    padding: 2.5rem 0;
  }
`;

export const ContentWrapper = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1.5rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $isMobile }) => ($isMobile ? "2rem" : "2.5rem")};
  flex: 1 0 0;

  ${media.tablet} {
    flex-direction: column;
    gap: 2rem;
    align-items: stretch;
    padding: 0 1rem;
  }
`;

export const ImageSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  width: min(100%, 37.0625rem);
  height: auto;
  padding: 0.625rem;
  border-radius: 0.5rem;

  ${media.tablet} {
    width: 100%;
    padding: 0;
  }
`;

export const StoryImage = styled.img`
  display: flex;
  width: 100%;
  height: auto;
  aspect-ratio: 37.0625 / 32.4375;
  border-radius: 0.5rem;
  object-fit: cover;
`;

export const TextSection = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
`;

export const Title = styled.h2<{ $isMobile: boolean }>`
  margin: 0;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-family: "Reddit Sans", sans-serif;
  font-size: ${({ $isMobile }) => ($isMobile ? "2rem" : "2.5rem")};
  font-style: normal;
  font-weight: 600;
  line-height: normal;
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
