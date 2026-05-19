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
    z-index: 50;
    transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "-100%")});
    transition: transform ${({ theme }) => theme.animations.normal};
  }
`;

export const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  min-height: 68px;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

export const BrandText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
`;

export const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
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
