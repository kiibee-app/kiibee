import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from "../Sidebar/styles";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  max-height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const MainWrapper = styled.div<{ $sidebarExpanded: boolean }>`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-left: ${({ $sidebarExpanded }) =>
    $sidebarExpanded
      ? `${SIDEBAR_WIDTH_EXPANDED - 10}px`
      : `${SIDEBAR_WIDTH_COLLAPSED}px`};
  overflow: hidden;
  padding-top: 70px;
  transition: margin-left 0.3s ease;

  ${media.desktop} {
    margin-left: 0;
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

  ${media.desktop} {
    padding: ${({ $contentPadding }) => $contentPadding ?? "8px 0 20px"};
  }
`;
