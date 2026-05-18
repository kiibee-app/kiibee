import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  max-height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const MainWrapper = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-left: 240px;
  overflow: hidden;
  padding-top: 70px;

  ${media.tablet} {
    margin-left: 1px;
  }
`;

export const ContentWrapper = styled.main<{ $contentPadding?: string }>`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: ${({ $contentPadding }) => $contentPadding ?? "20px"};
  overflow-y: auto;
  overscroll-behavior: contain;

  ${media.tablet} {
    padding: ${({ $contentPadding }) => $contentPadding ?? "8px 0 20px"};
  }
`;
