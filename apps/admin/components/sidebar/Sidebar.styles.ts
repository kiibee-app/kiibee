import Link from "next/link";
import styled from "styled-components";

export const SidebarRoot = styled.aside<{ $isOpen: boolean }>`
  width: 240px;
  border-right: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background-color: ${({ theme }) => theme.colors.neutral.WHITE};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;

  @media (max-width: ${({ theme }) => theme.media.tablet}) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100dvh;
    border-radius: 0;
    border-right: none;
    z-index: 50;
    transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
    transition: transform ${({ theme }) => theme.animations.normal};
    box-shadow: ${({ $isOpen, theme }) =>
      $isOpen ? theme.shadows.lg : "none"};
  }
`;

export const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 68px;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

export const BrandText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
`;

export const CloseButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary.main};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral.GRAY_100};
  }

  @media (max-width: ${({ theme }) => theme.media.tablet}) {
    display: inline-flex;
  }
`;

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  max-height: calc(100vh - 68px);
  overflow-y: auto;
`;

export const MenuItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary.GREEN_100 : theme.colors.secondary.muted};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.neutral.PALE_GREEN : "transparent"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.PALE_GREEN};
    color: ${({ theme }) => theme.colors.primary.GREEN_100};
  }
`;

export const IconWrap = styled.span`
  display: flex;
  align-items: center;
`;
