"use client";

import Link from "next/link";
import styled from "styled-components";
import type { LucideIcon } from "lucide-react";

const SidebarRoot = styled.aside`
  width: 240px;
  border-right: 1px solid ${({ theme }) => theme.colors.secondary.border};
  background-color: ${({ theme }) => theme.colors.neutral.WHITE};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
`;

const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  min-height: 68px;
  padding: 12px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary.border};
`;

const BrandText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
`;

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
`;

const MenuItem = styled(Link)<{ $active?: boolean }>`
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

const IconWrap = styled.span`
  display: flex;
  align-items: center;
`;

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  pathname: string;
}

export function Sidebar({ items, pathname }: SidebarProps) {
  return (
    <SidebarRoot>
      <SidebarTop>
        <BrandText>Kiibee</BrandText>
      </SidebarTop>
      <MenuList>
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <MenuItem key={item.href} href={item.href} $active={isActive}>
              <IconWrap>
                <Icon size={16} />
              </IconWrap>
              <span>{item.label}</span>
            </MenuItem>
          );
        })}
      </MenuList>
    </SidebarRoot>
  );
}
