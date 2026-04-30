"use client";

import React, { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { HELP_MENU_ITEMS, CreatorVariant } from "@/utils/SidebarItems";
import {
  SidebarActionButton,
  SidebarText,
  IconWrapper,
  DropdownHost,
  SidebarDropdown,
  SidebarDropdownItem,
} from "@/components/Layout/Sidebar/styles";

type SidebarHelpDropdownProps = {
  label: string;
  icon?: React.ReactNode;
  variant?: CreatorVariant;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export default function SidebarHelpDropdown({
  label,
  icon,
  variant,
  open,
  onToggle,
  onClose,
}: SidebarHelpDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: dropdownRef,
    enabled: open,
    eventType: "click",
    handler: onClose,
  });

  return (
    <DropdownHost ref={dropdownRef}>
      <SidebarActionButton
        type="button"
        onClick={onToggle}
        $active={open}
        $variant={variant}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <SidebarText $active={open} $variant={variant}>
          {label}
        </SidebarText>
      </SidebarActionButton>

      {open && (
        <SidebarDropdown role="menu" aria-label="Help options">
          {HELP_MENU_ITEMS.map((helpItem) => (
            <SidebarDropdownItem
              key={helpItem.href}
              href={helpItem.href}
              role="menuitem"
              onClick={onClose}
            >
              {helpItem.label}
            </SidebarDropdownItem>
          ))}
        </SidebarDropdown>
      )}
    </DropdownHost>
  );
}
