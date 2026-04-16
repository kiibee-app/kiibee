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
  IconWrapper,
  SidebarContent,
} from "./styles";
import { creatorsItems } from "@/utils/SidebarItems";
import logo from "@/assets/images/kiibee-wordmark.png";
import Image from "next/image";
import { useTranslation } from "react-i18next";

type SidebarProps = {
  activeItem: string;
  onSelect: (label: string) => void;
};

const Sidebar = ({ activeItem, onSelect }: SidebarProps) => {
  const { t } = useTranslation();
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
        <SidebarHeader>
          <Image
            src={logo}
            alt={t("nav.logoAlt")}
            width={80}
            height={25}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarItemStyled
                key={item.label}
                onClick={() => handleClick(item.label)}
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
                {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                <SidebarText
                  $active={activeItem === item.label}
                  $variant={item.variant}
                >
                  {item.label}
                </SidebarText>
              </SidebarItemStyled>
            ))}
          </BottomMenu>
        </SidebarContent>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
