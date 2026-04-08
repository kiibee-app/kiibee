import styled, { css } from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  padding: 4rem 0 6rem;
`;

export const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const HeadingWrap = styled.div`
  text-align: center;
`;

export const Heading = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

export const Sub = styled.div`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 22px;
  font-weight: 500;
  padding: 0.5rem 0;
`;

export const FeaturesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 1rem;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Index = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  display: inline-block;
  margin-bottom: 8px;
`;

export const TopBar = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  width: 135px;
  height: 0.7px;
  background: ${({ theme }) => theme.colors.neutral.GRAY};
  margin: 0;
  transition:
    transform 280ms cubic-bezier(0.2, 0.9, 0.2, 1),
    background 220ms ease,
    opacity 220ms ease;
  transform: translateY(6px) scaleX(0.9);
  opacity: 0;
  transform-origin: left center;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  font-size: 14px;
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
        transform: translateY(-6px) scaleX(1);
      }
    `}
`;

export const MockRow = styled.div<{ $imageRight?: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$imageRight ? "35% 65%" : "65% 35%")};
  gap: 2rem;
  align-items: center;
  margin-top: 2.5rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const MockImageWrap = styled.div<{ $active?: boolean }>`
  position: relative;
  width: 100%;
  height: 425px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  ${(p) =>
    p.$active &&
    css`
      outline: 2px solid ${p.theme.colors.secondary.border};
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    `}
`;

export const MockText = styled.div`
  font-size: 33px;
  font-weight: 600;
  max-width: 415px;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  padding: 0 1rem;

  ${media.tablet} {
    padding: 0;
    font-size: 20px;
  }
`;
