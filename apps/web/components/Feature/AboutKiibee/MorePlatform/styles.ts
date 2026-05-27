import styled from "styled-components";
import { type CSSProperties } from "react";
import { media } from "@repo/ui/breakpoints";

export const SectionWrapper = styled.section`
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  padding: 80px 0;
`;

export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const Title = styled.h2`
  margin-bottom: 25px;
`;

export const Subtitle = styled.div`
  max-width: 800px;
  margin-bottom: 50px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Card = styled.div`
  position: relative;
  width: 100%;
  min-height: 18.35938rem;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  img {
    transition: transform 0.5s ease-out !important;
  }

  &:hover img {
    transform: scale(1.08) !important;
  }
`;

export const Text = styled.p`
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  margin-bottom: 12px;
`;

export const platformRevealStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

export const platformImageStyle: CSSProperties = {
  objectFit: "cover",
};
