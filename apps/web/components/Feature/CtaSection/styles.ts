"use client";

import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  position: relative;
  display: block;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  padding: 0rem 24rem 4.5rem;

  ${media.tablet} {
    padding: 120px 40px;
  }
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

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

  img {
    position: relative;
    z-index: 0;
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
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  text-align: center;
  font-family: "Reddit Sans", sans-serif;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin: 0;

  ${media.tablet} {
    font-size: 32px;
  }

  ${media.mobile} {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  text-align: center;
  font-family: "Reddit Sans", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0;
  max-width: 800px;

  ${media.tablet} {
    font-size: 16px;
  }
`;
