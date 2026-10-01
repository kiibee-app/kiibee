"use client";

import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { PATHS } from "@/utils/path";
import { CREATOR_CHANNEL_AVATAR_TEXT } from "@/utils/Constants";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import {
  ChannelLink,
  ChannelText,
  Divider,
  EmailWrapper,
  ProfileCircle,
  RightProfileWrapper,
} from "./styles";

type CreatorHeaderRightProps = {
  initial: string;
  displayName: string;
  avatarUrl: string | null;
  publicCreatorSlug?: string | null;
};

const CreatorHeaderRight = ({
  initial,
  displayName,
  avatarUrl,
  publicCreatorSlug,
}: CreatorHeaderRightProps) => {
  const { t } = useTranslation();
  const channelHref = publicCreatorSlug ? `/${publicCreatorSlug}` : null;

  return (
    <>
      {channelHref ? (
        <>
          <ChannelLink href={channelHref}>
            <ChannelText $use="Body_Medium">
              {t("dashboard.creatorHeader.myChannel")}
            </ChannelText>
          </ChannelLink>
          <Divider />
        </>
      ) : null}
      <RightProfileWrapper
        href={PATHS.DASHBOARD_CREATOR_PROFILE}
        aria-label={t("common.creatorProfile")}
      >
        <ProfileCircle $hasImage={Boolean(avatarUrl)} $isDashboard={true}>
          <CreatorChannelAvatar
            avatarUrl={avatarUrl}
            initial={initial}
            alt={t("common.creatorProfile")}
            sizes="36px"
            fit="contain"
            initialUse={CREATOR_CHANNEL_AVATAR_TEXT.NAVBAR}
          />
        </ProfileCircle>
        <EmailWrapper>
          <MonoText $use="Body_Medium">{displayName}</MonoText>
        </EmailWrapper>
      </RightProfileWrapper>
    </>
  );
};

export default CreatorHeaderRight;
