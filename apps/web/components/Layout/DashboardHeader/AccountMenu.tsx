"use client";

import React, { ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CLICK } from "@/utils/common";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useLogout } from "@/hooks/auth/useLogout";
import {
  NavAccountDropdown,
  NavAccountHost,
  NavAccountMenuButton,
  NavAccountMenuDivider,
  NavAccountMenuIcon,
  NavAccountTriggerWrap,
} from "@/components/Layout/Navbar/styles";
import { LogoutIcon } from "@/assets/icons/logoutIcon";

type AccountMenuProps = {
  trigger: (args: { open: boolean; toggle: () => void }) => ReactNode;
  profileAction: (closeMenu: () => void) => ReactNode;
};

const AccountMenu = ({ trigger, profileAction }: AccountMenuProps) => {
  const { t } = useTranslation();
  const { logout, isPending } = useLogout();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: menuRef,
    enabled: open,
    eventType: CLICK,
    handler: () => setOpen(false),
  });

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    if (isPending) return;
    closeMenu();
    void logout();
  };

  return (
    <NavAccountHost ref={menuRef} $open={open}>
      <NavAccountTriggerWrap $open={open}>
        {trigger({
          open,
          toggle: () => setOpen((prev) => !prev),
        })}
      </NavAccountTriggerWrap>

      {open && (
        <NavAccountDropdown role="menu" aria-label={t("nav.profileMenu")}>
          {profileAction(closeMenu)}
          <NavAccountMenuDivider />
          <NavAccountMenuButton
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={isPending}
          >
            <NavAccountMenuIcon aria-hidden>
              <LogoutIcon width={18} height={18} />
            </NavAccountMenuIcon>
            {t("nav.logout")}
          </NavAccountMenuButton>
        </NavAccountDropdown>
      )}
    </NavAccountHost>
  );
};

export default AccountMenu;
