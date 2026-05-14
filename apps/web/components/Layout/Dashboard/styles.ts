import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const MainWrapper = styled.div`
  flex: 1;
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
  padding: ${({ $contentPadding }) => $contentPadding ?? "20px"};
  overflow-y: auto;

  ${media.tablet} {
    padding: ${({ $contentPadding }) => $contentPadding ?? "8px 0 20px"};
  }
`;
