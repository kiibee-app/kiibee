import { MonoText } from "@/components/UI/Monotext";
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
  border-right: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  z-index: 90;
  transition: transform 0.3s ease;

  ${media.tablet} {
    transform: ${({ $open }) =>
      $open ? "translateX(0)" : "translateX(-100%)"};
  }
`;

export const SidebarHeader = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

export const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 16px;
  gap: 4px;
`;

export const BottomMenu = styled.div`
  margin-top: auto;
  padding: 16px;
  padding-bottom: 110px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
`;

export const SidebarText = styled(MonoText).attrs({
  $use: "Body_Medium",
})<{
  $active?: boolean;
  $variant?: "danger";
}>`
  margin-left: 10px;
  display: inline-flex;
  align-items: center;

  color: ${({ $variant, $active, theme }) =>
    $variant === "danger"
      ? theme.colors.primary.RED
      : $active
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY};
`;

export const SidebarItemStyled = styled.div<{
  $active?: boolean;
  $variant?: "danger";
}>`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ $variant, $active, theme }) =>
    $variant === "danger"
      ? theme.colors.primary.RED
      : $active
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.GRAY};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary.GRAY : "transparent"};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.GRAY};
  }

  span:first-child {
    display: flex;
    align-items: center;
  }

  span:last-child {
    margin-left: 10px;
  }
`;

export const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
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
