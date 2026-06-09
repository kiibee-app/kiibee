"use client";

import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  font-family: ${({ theme }) => theme.typography.Heading1.fontFamily};
`;

export const Main = styled.main`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
`;

export const Section = styled.section`
  width: 100%;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${media.desktopMd} {
    max-width: 100%;
  }
`;

export const ExploreSection = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  overflow: visible;
`;

export const ExploreContentWrapper = styled.div`
  @media (min-width: 768px) {
    aside {
      align-self: flex-start;
    }
  }
`;
