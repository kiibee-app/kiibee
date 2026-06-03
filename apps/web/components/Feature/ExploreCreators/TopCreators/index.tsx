"use client";

import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import { Wrapper, Header, SeeAll, List, Card, Avatar } from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { PATHS } from "@/utils/path";
import { getNameInitials } from "@/hooks/auth/useStoredLoginUser";
import { CREATOR_CHANNEL_AVATAR_TEXT } from "@/utils/Constants";
import { formatSubscriberCountK } from "@/hooks/creators/useExploreCreators";
import { useExploreTopCreators } from "@/hooks/feed/useExploreContent";

export default function TopCreators() {
  const { t } = useTranslation();
  const { creators, isLoading } = useExploreTopCreators();

  if (!isLoading && creators.length === 0) {
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
          <Card key={creator.id}>
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
              {t(CREATORS.subscribersCount, {
                count: formatSubscriberCountK(creator.subscriberCount),
              })}
            </MonoText>
          </Card>
        ))}
      </List>
    </Wrapper>
  );
}
