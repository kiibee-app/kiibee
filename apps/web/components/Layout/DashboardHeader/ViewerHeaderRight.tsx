"use client";

import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import {
  NavAccountMenuButton,
  NavAccountMenuIcon,
} from "@/components/Layout/Navbar/styles";
import { ProfileIcon } from "@/assets/icons/profileIcon";
import AccountMenu from "./AccountMenu";
import { ProfileAvatarImage, ProfileButton } from "./styles";

type ViewerHeaderRightProps = {
  initial: string;
  avatarUrl: string | null;
  onProfileClick?: () => void;
};

const ViewerHeaderRight = ({
  initial,
  avatarUrl,
  onProfileClick,
}: ViewerHeaderRightProps) => {
  const { t } = useTranslation();

  return (
    <AccountMenu
      trigger={({ open, toggle }) => (
        <ProfileButton
          type="button"
          aria-label={t("common.viewerProfile")}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
        >
          {avatarUrl ? (
            <ProfileAvatarImage
              src={avatarUrl}
              alt={t("common.viewerProfile")}
            />
          ) : (
            initial
          )}
        </ProfileButton>
      )}
      profileAction={(closeMenu) => (
        <NavAccountMenuButton
          type="button"
          role="menuitem"
          onClick={() => {
            closeMenu();
            onProfileClick?.();
          }}
        >
          <NavAccountMenuIcon aria-hidden>
            <ProfileIcon width={18} height={18} />
          </NavAccountMenuIcon>
          {t(NAV.accountProfile)}
        </NavAccountMenuButton>
      )}
    />
  );
};

export default ViewerHeaderRight;
