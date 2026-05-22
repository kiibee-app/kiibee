import { MonoText } from "@/components/UI/Monotext";
import { CREATOR_VARIANTS, CreatorVariant } from "@/utils/SidebarItems";
import { media } from "@repo/ui/breakpoints";
import Link from "next/link";
import styled from "styled-components";

export const SIDEBAR_WIDTH_EXPANDED = 250;
export const SIDEBAR_WIDTH_COLLAPSED = 72;

export const SidebarWrapper = styled.aside<{ $expanded: boolean }>`
  width: ${({ $expanded }) =>
    $expanded ? `${SIDEBAR_WIDTH_EXPANDED}px` : `${SIDEBAR_WIDTH_COLLAPSED}px`};
  height: calc(100dvh - 70px);
  min-height: calc(100dvh - 70px);
  position: fixed;
  top: 70px;
  left: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  z-index: 90;
  transition:
    width 0.3s ease,
    filter 0.3s ease;

  ${media.tablet} {
    width: min(84vw, 320px);
    transform: ${({ $expanded }) =>
      $expanded ? "translateX(0)" : "translateX(-100%)"};
    transition:
      transform 0.3s ease,
      filter 0.3s ease;
    z-index: ${({ $expanded }) => ($expanded ? 95 : 90)};
    filter: ${({ $expanded }) =>
      $expanded ? "drop-shadow(6px 0 24px rgba(15, 23, 42, 0.12))" : "none"};
  }
`;

export const SidebarMenu = styled.div<{ $expanded?: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: ${({ $expanded }) => ($expanded ? "16px" : "16px 8px")};
  gap: 16px;
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  border-right: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
`;

export const BottomMenu = styled.div<{ $expanded?: boolean }>`
  margin-top: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: ${({ $expanded }) => ($expanded ? "16px" : "16px 8px")};
  gap: 16px;
  padding-bottom: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary.GRAY};

  ${media.tablet} {
    padding-bottom: max(16px, env(safe-area-inset-bottom, 0px));
  }
`;

export const Overlay = styled.div<{ $expanded: boolean }>`
  display: none;

  ${media.tablet} {
    display: ${({ $expanded }) => ($expanded ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: ${({ theme }) => theme.colors.neutral.OVERLAY};
    z-index: 85;
  }
`;

export const SidebarText = styled(MonoText).attrs({
  $use: "Body_Medium",
})<{
  $active?: boolean;
  $variant?: CreatorVariant;
}>`
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  color: ${({ $variant, $active, theme }) =>
    $variant === CREATOR_VARIANTS.DANGER
      ? theme.colors.primary.RED
      : $active
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY};
`;

export const SidebarItemStyled = styled.div<{
  $active?: boolean;
  $variant?: CreatorVariant;
  $expanded?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${({ $expanded }) => ($expanded ? "10px" : "0")};
  padding: ${({ $expanded }) => ($expanded ? "12px 16px" : "12px")};
  justify-content: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ $variant, $active, theme }) =>
    $variant === CREATOR_VARIANTS.DANGER
      ? theme.colors.primary.RED
      : $active
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.GRAY : "transparent"};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.GRAY};
  }
`;

export const IconWrapper = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const SidebarLinkItem = styled(Link)<{
  $active?: boolean;
  $variant?: CreatorVariant;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: ${({ $variant, $active, theme }) =>
    $variant === CREATOR_VARIANTS.DANGER
      ? theme.colors.primary.RED
      : $active
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.GRAY : "transparent"};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.GRAY};
  }
`;

export const SidebarActionButton = styled.button<{
  $active?: boolean;
  $variant?: CreatorVariant;
  $expanded?: boolean;
}>`
  width: 100%;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.GRAY : "transparent"};
  display: flex;
  align-items: center;
  gap: ${({ $expanded }) => ($expanded ? "10px" : "0")};
  padding: ${({ $expanded }) => ($expanded ? "12px 16px" : "12px")};
  justify-content: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ $variant, $active, theme }) =>
    $variant === CREATOR_VARIANTS.DANGER
      ? theme.colors.primary.RED
      : $active
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY};
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.GRAY};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
  }
`;

export const SidebarItemContent = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const DropdownHost = styled.div`
  position: relative;
`;

export const SidebarDropdown = styled.div`
  position: absolute;
  left: calc(100% - 10px);
  top: 0;
  z-index: 100;
  min-width: 220px;
  padding: 4px 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  box-shadow: ${({ theme }) => theme.shadows.frame};
  border: 1px solid ${({ theme }) => theme.colors.gradient.FRAME_BORDER};

  ${media.tablet} {
    left: 0;
    top: calc(100% + 10px);
    bottom: auto;
    transform: none;
  }
`;

export const SidebarDropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 36px;
  padding: 8px 18px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.GRAY};
    color: ${({ theme }) => theme.colors.primary.BLACK};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: -2px;
  }
`;

export const SidebarDropdownButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.GRAY};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: 2px;
  }
`;

export const DropdownIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const DropdownLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;
