"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { PATHS } from "@/utils/path";
import { useCreatorChannelLayout } from "@/hooks/useCreatorChannelLayout";
import { resolveCreatorMediaUrl } from "@/utils/media";
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
  const [failedForUrl, setFailedForUrl] = useState<string | null>(null);
  const resolvedAvatarUrl = useMemo(
    () => resolveCreatorMediaUrl(avatarUrl),
    [avatarUrl],
  );
  const hasFailed = failedForUrl === resolvedAvatarUrl;
  const showAvatar = Boolean(resolvedAvatarUrl) && !hasFailed;

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
          {showAvatar ? (
            <ProfileAvatarImage
              src={resolvedAvatarUrl ?? undefined}
              alt={t("common.creatorProfile")}
              onError={() => setFailedForUrl(resolvedAvatarUrl)}
            />
          ) : (
            <InitialAvatar>{initial}</InitialAvatar>
          )}
        </ProfileCircle>
        <EmailWrapper>
          <MonoText $use="Body_Medium">{email}</MonoText>
        </EmailWrapper>
      </RightProfileWrapper>
    </>
  );
};

export default CreatorHeaderRight;
