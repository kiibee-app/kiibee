"use client";

import React, { useState } from "react";
import {
  SidebarWrapper,
  SidebarHeader,
  SidebarMenu,
  BottomMenu,
  SidebarItemStyled,
  MobileToggle,
  Overlay,
  SidebarText,
} from "./styles";
import { creatorsItems } from "@/utils/SidebarItems";

type SidebarProps = {
  activeItem: string;
  onSelect: (label: string) => void;
};

const Sidebar = ({ activeItem, onSelect }: SidebarProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = (label: string) => {
    onSelect(label);
    setOpen(false);
  };

  const mainItems = creatorsItems.filter((i) => i.section === "top");
  const settingsItems = creatorsItems.filter((i) => i.section === "bottom");

  return (
    <>
      <MobileToggle onClick={() => setOpen((p) => !p)} />

      {open && <Overlay onClick={() => setOpen(false)} />}

      <SidebarWrapper $open={open}>
        <SidebarHeader>kiibee</SidebarHeader>

        {/* MAIN MENU */}
        <SidebarMenu>
          {mainItems.map((item) => (
            <SidebarItemStyled
              key={item.label}
              onClick={() => handleClick(item.label)}
              $active={activeItem === item.label}
              $variant={item.variant}
            >
              {item.icon && <span>{item.icon}</span>}
              <SidebarText
                $active={activeItem === item.label}
                $variant={item.variant}
              >
                {item.label}
              </SidebarText>
            </SidebarItemStyled>
          ))}
        </SidebarMenu>

        <BottomMenu>
          {settingsItems.map((item) => (
            <SidebarItemStyled
              key={item.label}
              onClick={() => handleClick(item.label)}
              $active={activeItem === item.label}
              $variant={item.variant}
            >
              {item.icon && <span>{item.icon}</span>}
              <SidebarText
                $active={activeItem === item.label}
                $variant={item.variant}
              >
                {item.label}
              </SidebarText>
            </SidebarItemStyled>
          ))}
        </BottomMenu>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
