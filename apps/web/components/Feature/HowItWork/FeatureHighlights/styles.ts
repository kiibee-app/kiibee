import styled, { css } from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 4rem 0 6rem;

  ${media.tablet} {
    padding: 3rem 0 4rem;
  }

  ${media.mobileLg} {
    padding: 2.5rem 0 3rem;
  }
`;

export const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  ${media.tablet} {
    padding: 0 1.25rem;
    gap: 1.5rem;
  }
`;

export const HeadingWrap = styled.div`
  text-align: center;
`;

export const Heading = styled.h2`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const Sub = styled.div`
  padding: 0.5rem 0;
`;

export const FeaturesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 1rem;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem 1rem;
  }

  ${media.mobileMd} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const Index = styled.span`
  display: inline-block;
  margin-bottom: 8px;
`;

export const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.colors.neutral.GRAY};
  margin: 0;
  transition:
    transform 280ms cubic-bezier(0.2, 0.9, 0.2, 1),
    background 220ms ease,
    opacity 220ms ease;
  transform: translateY(0) scaleX(0.9);
  opacity: 0;
  transform-origin: left center;
`;

export const Label = styled.div`
  margin-top: 0;
  transition:
    color 180ms ease,
    font-weight 180ms ease;
  line-height: 1.3;
`;

export const FeatureItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
  padding-top: 0.75rem;

  ${(p) =>
    p.$active &&
    css`
      ${Index} {
        color: ${p.theme.colors.neutral.BLACK};
      }

      ${Label} {
        color: ${p.theme.colors.neutral.BLACK};
      }

      ${TopBar} {
        background: ${p.theme.colors.neutral.GRAY};
        opacity: 1;
        transform: translateY(0) scaleX(1);
      }
    `}
`;

export const MockRow = styled.div<{ $imageRight?: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$imageRight ? "35% 65%" : "65% 35%")};
  gap: 2.5rem;
  align-items: center;
  margin-top: 2.5rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;
    text-align: center;
  }
`;

export const MockImageWrap = styled.div<{
  $active?: boolean;
  $imageRight?: boolean;
}>`
  position: relative;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: none;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  order: ${(p) => (p.$imageRight ? 2 : 1)};
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};

  ${media.tablet} {
    order: 1;
  }

  & > div {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
  }

  img {
    width: 100% !important;
    height: auto !important;
    position: relative !important;
    object-fit: contain !important;
    display: block;
    image-rendering: -webkit-optimize-contrast;
    transform: translateZ(0);
    backface-visibility: hidden;
  }
`;

export const MockText = styled.div<{ $imageRight?: boolean }>`
  ${({ theme }) => theme.typography.Body_Regular};
  max-width: 415px;
  padding: 0 1rem;
  order: ${(p) => (p.$imageRight ? 1 : 2)};

  ${media.tablet} {
    order: 2;
    padding: 0;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
  }
`;
