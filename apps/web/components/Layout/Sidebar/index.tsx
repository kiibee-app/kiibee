"use client";

import React, { useCallback, useMemo, useState } from "react";
import { HELP } from "@/utils/common";
import {
  SidebarWrapper,
  SidebarMenu,
  BottomMenu,
  SidebarItemStyled,
  Overlay,
  SidebarText,
  IconWrapper,
  SidebarContent,
} from "./styles";
import SidebarHelpDropdown from "@/components/Feature/HelpDropdown";
import {
  CREATORS_LABELS,
  CREATOR_SECTIONS,
  creatorsItems,
  DashboardSidebarItem,
} from "@/utils/SidebarItems";

type SidebarProps = {
  activeItem?: string;
  onSelect?: (label: string) => void;
  onLogout?: () => void;
  expanded: boolean;
  onCollapse?: () => void;
  items?: DashboardSidebarItem[];
  logoutLabel?: string;
};

const Sidebar = ({
  activeItem,
  onSelect,
  onLogout,
  expanded,
  onCollapse,
  items = creatorsItems,
  logoutLabel = CREATORS_LABELS.LOG_OUT,
}: SidebarProps) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const { mainItems, settingsItems } = useMemo(() => {
    return {
      mainItems: items.filter((item) => item.section === CREATOR_SECTIONS.TOP),
      settingsItems: items.filter(
        (item) => item.section === CREATOR_SECTIONS.BOTTOM,
      ),
    };
  }, [items]);

  const handleSelect = useCallback(
    (label: string) => {
      if (label === logoutLabel) {
        onLogout?.();
        onCollapse?.();
        return;
      }

      onSelect?.(label);
      setHelpOpen(false);
      onCollapse?.();
    },
    [logoutLabel, onSelect, onCollapse, onLogout],
  );

  const handleCloseDrawer = useCallback(() => {
    setHelpOpen(false);
    onCollapse?.();
  }, [onCollapse]);

  const renderItems = useCallback(
    (itemsToRender: DashboardSidebarItem[]) =>
      itemsToRender.map((item) => (
        <SidebarItemStyled
          key={item.label}
          onClick={() => handleSelect(item.label)}
          $active={activeItem === item.label}
          $variant={item.variant}
          $expanded={expanded}
          title={!expanded ? item.label : undefined}
        >
          {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
          {expanded && (
            <SidebarText
              $active={activeItem === item.label}
              $variant={item.variant}
            >
              {item.label}
            </SidebarText>
          )}
        </SidebarItemStyled>
      )),
    [activeItem, expanded, handleSelect],
  );

  return (
    <>
      <Overlay $expanded={expanded} onClick={handleCloseDrawer} />

      <SidebarWrapper $expanded={expanded}>
        <SidebarContent>
          <SidebarMenu $expanded={expanded}>
            {renderItems(mainItems)}
          </SidebarMenu>

          <BottomMenu $expanded={expanded}>
            {settingsItems.map((item) => {
              if (item.label === HELP) {
                return (
                  <SidebarHelpDropdown
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    variant={item.variant}
                    expanded={expanded}
                    open={helpOpen}
                    onToggle={() => setHelpOpen((prev) => !prev)}
                    onClose={() => setHelpOpen(false)}
                  />
                );
              }

              return (
                <SidebarItemStyled
                  key={item.label}
                  onClick={() => handleSelect(item.label)}
                  $active={activeItem === item.label}
                  $variant={item.variant}
                  $expanded={expanded}
                  title={!expanded ? item.label : undefined}
                >
                  {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                  {expanded && (
                    <SidebarText
                      $active={activeItem === item.label}
                      $variant={item.variant}
                    >
                      {item.label}
                    </SidebarText>
                  )}
                </SidebarItemStyled>
              );
            })}
          </BottomMenu>
        </SidebarContent>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
