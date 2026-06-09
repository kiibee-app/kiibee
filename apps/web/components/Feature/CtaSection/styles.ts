"use client";

import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";
import { type CSSProperties } from "react";
import GenericButton from "@/components/UI/GenericButton";

const DEFAULT_IMAGE_ASPECT = 1440 / 682;

export const Section = styled.section<{ $aspect?: number }>`
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: clamp(
    420px,
    calc(100vw / ${({ $aspect = DEFAULT_IMAGE_ASPECT }) => $aspect}),
    682px
  );
  padding: clamp(3rem, 8vh, 5rem) 1.5rem;

  ${media.tablet} {
    padding: clamp(2.5rem, 6vh, 4rem) 1.25rem;
  }
`;

export const Background = styled.div<{ $src: string }>`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: center 32%;
  background-repeat: no-repeat;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    z-index: 1;
  }

  ${media.tablet} {
    background-position: center 28%;
  }
`;

export const Inner = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.Heading2}
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  text-align: center;
  margin: 0;
`;

export const Subtitle = styled.p`
  ${({ theme }) => theme.typography.H5_Regular}
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  text-align: center;
  margin: 0;
  max-width: 800px;
`;

export const CTAButton = styled(GenericButton)`
  &:hover,
  &:focus-visible,
  &:active {
    color: ${({ theme }) => theme.colors.primary.WHITE} !important;
    border-color: ${({ theme }) => theme.colors.primary.WHITE} !important;
  }
`;

export const ctaSectionBackgroundImageStyle: CSSProperties = {
  objectFit: "cover",
  objectPosition: "center",
};
