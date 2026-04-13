import styled from "styled-components";
import { media } from "@kiibee/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 9rem;

  ${media.tablet} {
    padding: 2.5rem 1.25rem;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;

  ${media.tablet} {
    flex-direction: column;
    gap: 2rem;
    align-items: stretch;
  }
`;

export const ImageSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  width: 100%;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  ${media.tablet} {
    width: 100%;
    max-width: 100%;
  }
`;

export const Title = styled.h2`
  margin: 0;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-family: "Reddit Sans", sans-serif;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  ${media.tablet} {
    font-size: 2rem;
  }
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

export const ReadMoreButton = styled.button`
  align-self: flex-start;
  margin-top: 0.625rem;
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary.BLACK};
  background: ${({ theme }) => theme.colors.primary.BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.typography.Body_Medium.fontWeight};
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;
