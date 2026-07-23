"use client";

import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { PATHS } from "@/utils/path";
import { useCreatorChannelLayout } from "@/hooks/useCreatorChannelLayout";
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
      <RightProfileWrapper
        href={PATHS.DASHBOARD_CREATOR_PROFILE}
        aria-label={t("common.creatorProfile")}
      >
        <ProfileCircle>
          <CreatorChannelAvatar
            avatarUrl={avatarUrl}
            initial={initial}
            alt={t("common.creatorProfile")}
            sizes="44px"
          />
        </ProfileCircle>
        <EmailWrapper>
          <MonoText $use="Body_Medium">{email}</MonoText>
        </EmailWrapper>
      </RightProfileWrapper>
    </>
  );
};

export default CreatorHeaderRight;
