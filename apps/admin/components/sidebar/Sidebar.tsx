"use client";

import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import {
  BrandText,
  CloseButton,
  IconWrap,
  MenuItem,
  MenuList,
  SidebarRoot,
  SidebarTop,
} from "./Sidebar.styles";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ items, pathname, isOpen, onClose }: SidebarProps) {
  return (
    <SidebarRoot $isOpen={isOpen}>
      <SidebarTop>
        <BrandText>Kiibee</BrandText>
        <CloseButton type="button" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </CloseButton>
      </SidebarTop>
      <MenuList>
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <MenuItem
              key={item.href}
              href={item.href}
              $active={isActive}
              aria-current={isActive ? "page" : undefined}
              onClick={onClose}
            >
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
