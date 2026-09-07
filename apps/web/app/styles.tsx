"use client";

import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: clip;
  background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  font-family: ${({ theme }) => theme.typography.Heading1.fontFamily};
`;

export const Main = styled.main`
  display: flex;
  flex: 1;
  width: 100%;
  min-width: 0;
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

export const Section = styled.section<{ $embedded?: boolean }>`
  width: 100%;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: ${({ $embedded }) => ($embedded ? "flex-start" : "center")};
  min-height: ${({ $embedded }) => ($embedded ? "0" : "60vh")};

  ${media.desktopMd} {
    max-width: 100%;
  }
`;

export const ExploreSection = styled.section`
  width: 100%;
  max-width: 100%;
  background: ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  overflow-x: clip;
`;

export const ExploreContentWrapper = styled.div`
  @media (min-width: 768px) {
    aside {
      align-self: flex-start;
    }
  }
`;
