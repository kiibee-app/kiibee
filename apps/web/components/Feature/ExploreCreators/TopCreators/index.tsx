"use client";

import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import { Wrapper, Header, SeeAll, List, Card, Avatar } from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { PATHS } from "@/utils/path";
import { getNameInitials } from "@/hooks/auth/useStoredLoginUser";
import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  SKELETON_COUNT,
  TOP_CREATORS_LIMIT,
} from "@/utils/Constants";
import { formatUploadCount } from "@/hooks/creators/useExploreCreators";
import { useExploreTopCreators } from "@/hooks/feed/useExploreContent";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import {
  LargeSkeletonAvatar,
  SkeletonAvatarName,
  SkeletonAvatarSubscribers,
} from "../Creators/styles";
import Skeleton from "@/components/UI/Skeleton";

export default function TopCreators() {
  const { t } = useTranslation();
  const { creators, isLoading } = useExploreTopCreators();

  if (isLoading) {
    return (
      <Wrapper>
        <Header>
          <Skeleton.Header />
        </Header>
        <List>
          {Array.from({ length: TOP_CREATORS_LIMIT }).map((_, i) => (
            <Skeleton.Creator key={i} />
          ))}
        </List>
      </Wrapper>
    );
  }

  if (creators.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <Header>
        <MonoText $use="H4_Medium">{t(CREATORS.topCreators)}</MonoText>
        <SeeAll href={PATHS.EXPLORE_CREATORS}>
          <MonoText $use="Body_Medium">{t(CREATORS.seeAll)}</MonoText>
        </SeeAll>
      </Header>

      <List>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Card key={i}>
                <Avatar>
                  <LargeSkeletonAvatar />
                </Avatar>
                <SkeletonAvatarName />
                <SkeletonAvatarSubscribers />
              </Card>
            ))
          : creators.map((creator) => (
              <Card
                key={creator.id}
                as="a"
                href={getPublicCreatorProfilePath(creator.id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Avatar>
                  <CreatorChannelAvatar
                    avatarUrl={creator.profileImageUrl}
                    initial={getNameInitials(creator.name)}
                    alt={creator.name}
                    sizes="150px"
                    initialUse={CREATOR_CHANNEL_AVATAR_TEXT.HERO}
                  />
                </Avatar>

                <MonoText $use="Body_Medium">{creator.name}</MonoText>
                <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
                  {t(CREATORS.topCreatorUploads, {
                    count: creator.uploadCount,
                    formattedCount: formatUploadCount(creator.uploadCount),
                  })}
                </MonoText>
              </Card>
            ))}
      </List>
    </Wrapper>
  );
}
