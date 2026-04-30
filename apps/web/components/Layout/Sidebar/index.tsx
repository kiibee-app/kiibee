"use client";

import React, { useCallback, useMemo, useState } from "react";
import { HELP } from "@/utils/common";
import { CREATOR_SECTIONS, creatorsItems } from "@/utils/SidebarItems";
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
} from "@/utils/SidebarItems";

type SidebarProps = {
  activeItem: string;
  onSelect: (label: string) => void;
  onLogout?: () => void;
  open: boolean;
  onClose: () => void;
};

const Sidebar = ({
  activeItem,
  onSelect,
  onLogout,
  open,
  onClose,
}: SidebarProps) => {
  
  const [helpOpen, setHelpOpen] = useState(false);
  const { mainItems, settingsItems } = useMemo(() => {
    return {
      mainItems: creatorsItems.filter(
        (item) => item.section === CREATOR_SECTIONS.TOP,
      ),
      settingsItems: creatorsItems.filter(
        (item) => item.section === CREATOR_SECTIONS.BOTTOM,
      ),
    };
  }, []);

  const handleSelect = useCallback(
    (label: string) => {
      if (label === CREATORS_LABELS.LOG_OUT) {
        onLogout?.();
        onClose();
        return;
      }

      onSelect(label);
      setHelpOpen(false);
      onClose();
    },
    [onSelect, onClose, onLogout],
  );

  const handleCloseSidebar = useCallback(() => {
    setHelpOpen(false);
    onClose();
  }, [onClose]);

  const renderItems = useCallback(
    (items: typeof creatorsItems) =>
      items.map((item) => (
        <SidebarItemStyled
          key={item.label}
          onClick={() => handleSelect(item.label)}
          $active={activeItem === item.label}
          $variant={item.variant}
        >
          {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
          <SidebarText
            $active={activeItem === item.label}
            $variant={item.variant}
          >
            {item.label}
          </SidebarText>
        </SidebarItemStyled>
      )),
    [activeItem, handleSelect],
  );

  return (
    <>
      {open && <Overlay onClick={handleCloseSidebar} />}

      <SidebarWrapper $open={open}>
        <SidebarContent>
          <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>

          <BottomMenu>
            {settingsItems.map((item) => {
              if (item.label === HELP) {
                return (
                  <SidebarHelpDropdown
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    variant={item.variant}
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
                >
                  {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                  <SidebarText
                    $active={activeItem === item.label}
                    $variant={item.variant}
                  >
                    {item.label}
                  </SidebarText>
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
