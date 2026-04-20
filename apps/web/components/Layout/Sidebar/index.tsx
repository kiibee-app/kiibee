"use client";

import React, { useMemo, useCallback } from "react";
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
import { CREATOR_SECTIONS, creatorsItems } from "@/utils/SidebarItems";
import logo from "@/assets/images/kiibee-wordmark.webp";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import { HomeIcon } from "@/assets/icons/homeIcon";

type SidebarProps = {
  activeItem: string;
  onSelect: (label: string) => void;
  open: boolean;
  onClose: () => void;
};

const Sidebar = ({ activeItem, onSelect, open, onClose }: SidebarProps) => {
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
      onClose();
    },
    [onSelect, onClose],
  );

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
      {open && <Overlay onClick={onClose} />}

      <SidebarWrapper $open={open}>
        <SidebarHeader>
          <Image
            src={logo}
            alt={t(NAV.logoAlt)}
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
