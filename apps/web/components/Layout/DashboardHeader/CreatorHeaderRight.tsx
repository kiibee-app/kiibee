"use client";

import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { PATHS } from "@/utils/path";
import { NAV } from "@/utils/translationKeys";
import { useCreatorChannelLayout } from "@/hooks/useCreatorChannelLayout";
import {
  NavAccountMenuIcon,
  NavAccountMenuItem,
} from "@/components/Layout/Navbar/styles";
import { ProfileIcon } from "@/assets/icons/profileIcon";
import AccountMenu from "./AccountMenu";
import {
  ChannelLink,
  ChannelText,
  Divider,
  EmailWrapper,
  InitialAvatar,
  ProfileAvatarImage,
  ProfileCircle,
  RightProfileWrapper,
} from "./styles";

type CreatorHeaderRightProps = {
  initial: string;
  email: string;
  avatarUrl: string | null;
};

const CreatorHeaderRight = ({
  initial,
  email,
  avatarUrl,
}: CreatorHeaderRightProps) => {
  const { t } = useTranslation();
  const { channelHref } = useCreatorChannelLayout();

  return (
    <>
      <ChannelLink href={channelHref}>
        <ChannelText $use="Body_Medium">
          {t("dashboard.creatorHeader.myChannel")}
        </ChannelText>
      </ChannelLink>
      <Divider />
      <AccountMenu
        trigger={({ open, toggle }) => (
          <RightProfileWrapper
            type="button"
            aria-label={t("common.creatorProfile")}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={toggle}
          >
            <ProfileCircle>
              {avatarUrl ? (
                <ProfileAvatarImage
                  src={avatarUrl}
                  alt={t("common.creatorProfile")}
                />
              ) : (
                <InitialAvatar>{initial}</InitialAvatar>
              )}
            </ProfileCircle>
            <EmailWrapper>
              <MonoText $use="Body_Medium">{email}</MonoText>
            </EmailWrapper>
          </RightProfileWrapper>
        )}
        profileAction={(closeMenu) => (
          <NavAccountMenuItem
            href={PATHS.DASHBOARD_CREATOR_PROFILE}
            role="menuitem"
            onClick={closeMenu}
          >
            <NavAccountMenuIcon aria-hidden>
              <ProfileIcon width={18} height={18} />
            </NavAccountMenuIcon>
            {t(NAV.accountProfile)}
          </NavAccountMenuItem>
        )}
      />
    </>
  );
};

export default CreatorHeaderRight;
