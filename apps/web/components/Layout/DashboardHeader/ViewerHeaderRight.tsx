"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import {
  NavAccountMenuButton,
  NavAccountMenuIcon,
} from "@/components/Layout/Navbar/styles";
import { ProfileIcon } from "@/assets/icons/profileIcon";
import AccountMenu from "./AccountMenu";
import { resolveCreatorMediaUrl } from "@/utils/media";
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
  const [failedForUrl, setFailedForUrl] = useState<string | null>(null);
  const resolvedAvatarUrl = useMemo(
    () => resolveCreatorMediaUrl(avatarUrl),
    [avatarUrl],
  );
  const hasFailed = failedForUrl === resolvedAvatarUrl;
  const showAvatar = Boolean(resolvedAvatarUrl) && !hasFailed;

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
          {showAvatar ? (
            <ProfileAvatarImage
              src={resolvedAvatarUrl ?? undefined}
              alt={t("common.viewerProfile")}
              onError={() => setFailedForUrl(resolvedAvatarUrl)}
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
