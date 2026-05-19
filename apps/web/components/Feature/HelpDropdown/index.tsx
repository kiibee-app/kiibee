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
import { useTranslation } from "react-i18next";

type SidebarHelpDropdownProps = {
  label: string;
  icon?: React.ReactNode;
  variant?: CreatorVariant;
  expanded: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export default function SidebarHelpDropdown({
  label,
  icon,
  variant,
  expanded,
  open,
  onToggle,
  onClose,
}: SidebarHelpDropdownProps) {
  const { t } = useTranslation();
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
        $expanded={expanded}
        aria-haspopup="menu"
        aria-expanded={open}
        title={!expanded ? label : undefined}
      >
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {expanded && (
          <SidebarText $active={open} $variant={variant}>
            {label}
          </SidebarText>
        )}
      </SidebarActionButton>

      {open && (
        <SidebarDropdown role="menu" aria-label={t("helpDropdown.optionsAria")}>
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
