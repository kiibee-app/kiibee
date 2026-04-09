"use client";

import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { typography } from "@repo/ui/typography";

export const Hero = styled.section<{ $backgroundImage: string }>`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${({ $backgroundImage }) => $backgroundImage});
  background-size: cover;
  background-position: center;
  font-family: ${({ theme }) => theme.typography.Heading1.fontFamily};
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: ${({ theme }) => theme.colors.gredint.CARD_SHADOW};
`;

export const Container = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 850px;
  padding: 0 20px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0 0 20px 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;
  font-family: ${typography.Heading2.fontFamily};
  font-size: 40px;
  font-style: ${typography.Heading2.fontStyle};
  font-weight: 600;
  line-height: normal;
  text-shadow: 0 2px 8px ${({ theme }) => theme.colors.gredint.CARD_BG};

  ${media.tablet} {
    font-size: 34px;
  }

  ${media.mobile} {
    font-size: 30px;
  }
`;

export const Description = styled.p`
  margin: 0 0 35px 0;
  max-width: 750px;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-align: center;
  font-family: ${typography.H4_Medium.fontFamily};
  font-size: 20px;
  font-style: ${typography.H4_Medium.fontStyle};
  font-weight: 500;
  line-height: normal;
  text-shadow: 0 1px 6px ${({ theme }) => theme.colors.gredint.BLACK_90};

  ${media.tablet} {
    font-size: 16px;
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  height: 49px;
  padding: 14px 24px;
  gap: 10px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.gredint.TRANSPARENT};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.gredint.NEAR_BLACK};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  cursor: pointer;
  font-family: ${typography.H4_Medium.fontFamily};
  font-size: 16px;
  font-style: ${typography.H4_Medium.fontStyle};
  font-weight: 500;
  line-height: normal;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition:
    background ${({ theme }) => theme.animations.fast},
    color ${({ theme }) => theme.animations.fast},
    border-color ${({ theme }) => theme.animations.fast},
    box-shadow ${({ theme }) => theme.animations.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.WHITE_10};
    border-color: ${({ theme }) => theme.colors.neutral.BLACK};
    color: ${({ theme }) => theme.colors.neutral.BLACK};
    box-shadow: none;
  }
`;
