import { MonoText } from "@/components/UI/Monotext";
import { CREATOR_VARIANTS, CreatorVariant } from "@/utils/SidebarItems";
import { media } from "@kiibee/ui/breakpoints";
import styled from "styled-components";

export const SidebarWrapper = styled.aside<{ $open: boolean }>`
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  z-index: 90;
  transition: transform 0.3s ease;

  ${media.tablet} {
    transform: ${({ $open }) =>
      $open ? "translateX(0)" : "translateX(-100%)"};
  }
`;

export const SidebarHeader = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  padding: 18px 35px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  overflow: hidden;

  ${media.tablet} {
    padding-left: 70px;
  }
`;

export const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-right: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
`;

export const BottomMenu = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  padding-bottom: 110px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
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
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
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

export const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 35px;
  left: 35px;
  z-index: 110;
  background: none;
  border: none;

  ${media.tablet} {
    display: block;
  }
`;

export const Overlay = styled.div`
  ${media.mobile} {
    position: fixed;
    inset: 0;
    background: ${({ theme }) => theme.colors.neutral.OVERLAY};
    z-index: 80;
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
