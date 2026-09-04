"use client";

import Link from "next/link";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import {
  Wrapper,
  Header,
  SeeAll,
  List,
  Card,
  Avatar,
  CreatorName,
  CreatorMeta,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { PATHS } from "@/utils/path";
import { getNameInitials } from "@/hooks/auth/useStoredLoginUser";
import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  TOP_CREATORS_LIMIT,
  TOP_CREATORS_VISIBLE,
} from "@/utils/Constants";
import { formatUploadCount } from "@/hooks/creators/useExploreCreators";
import { useExploreTopCreators } from "@/hooks/feed/useExploreContent";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import Skeleton from "@/components/UI/Skeleton";

export default function TopCreators({ search }: { search?: string }) {
  const { t } = useTranslation();
  const { creators, isLoading } = useExploreTopCreators(
    TOP_CREATORS_LIMIT,
    search,
  );

  if (isLoading) {
    return (
      <Wrapper>
        <Header>
          <Skeleton.Header />
        </Header>
        <List>
          {Array.from({ length: TOP_CREATORS_VISIBLE }).map((_, i) => (
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
        {creators.map((creator) => (
          <Card
            key={creator.id}
            as={Link}
            href={getPublicCreatorProfilePath(creator.id)}
          >
            <Avatar>
              <CreatorChannelAvatar
                avatarUrl={creator.profileImageUrl}
                initial={getNameInitials(creator.name)}
                alt={creator.name}
                sizes="(max-width: 768px) 100px, 150px"
                initialUse={CREATOR_CHANNEL_AVATAR_TEXT.HERO}
              />
            </Avatar>

            <CreatorName $use="Body_Medium">{creator.name}</CreatorName>
            <CreatorMeta $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
              {t(CREATORS.topCreatorUploads, {
                count: creator.uploadCount,
                formattedCount: formatUploadCount(creator.uploadCount),
              })}
            </CreatorMeta>
          </Card>
        ))}
      </List>
    </Wrapper>
  );
}
