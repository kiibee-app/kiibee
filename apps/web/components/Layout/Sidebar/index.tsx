"use client";

import React, { useState, useMemo, useCallback } from "react";
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
import { CREATOR_SECTIONS, creatorsItems } from "@/utils/SidebarItems";
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

  const { mainItems, settingsItems } = useMemo(() => {
    return {
      mainItems: creatorsItems.filter(
        (i) => i.section === CREATOR_SECTIONS.TOP,
      ),
      settingsItems: creatorsItems.filter(
        (i) => i.section === CREATOR_SECTIONS.BOTTOM,
      ),
    };
  }, []);

  const handleClick = useCallback(
    (label: string) => {
      onSelect(label);
      setOpen(false);
    },
    [onSelect],
  );

  const toggleSidebar = useCallback(() => {
    setOpen((p) => !p);
  }, []);

  const closeSidebar = useCallback(() => {
    setOpen(false);
  }, []);

  const renderItems = useCallback(
    (items: typeof creatorsItems) =>
      items.map((item) => (
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
      )),
    [activeItem, handleClick],
  );

  return (
    <>
      <MobileToggle onClick={toggleSidebar} />

      {open && <Overlay onClick={closeSidebar} />}

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
          <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>

          <BottomMenu>{renderItems(settingsItems)}</BottomMenu>
        </SidebarContent>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
