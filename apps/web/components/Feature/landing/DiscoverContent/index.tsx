"use client";

import { useTranslation } from "react-i18next";
import { API, useGetAPI } from "@/lib/http/api";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { type FeedContentItem } from "@/utils/feedContentToTutorial";
import { mapFeedItemToDiscoverItem } from "@/utils/discoverContent";
import {
  Section,
  HeaderSection,
  Title,
  Subtitle,
  GridContainer,
  BottomCtaSection,
} from "./styles";
import DiscoverCard from "./DiscoverCard";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, SIZE } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";

type RecentContentResponse = {
  success?: boolean;
  message?: string;
  data?: FeedContentItem[];
};

export default function DiscoverContent() {
  const { t, i18n } = useTranslation();
  const user = useStoredLoginUser();
  const isLoggedIn = !!user;

  const { data: recentData, isLoading } = useGetAPI<RecentContentResponse>(
    API.feed.recent,
  );

  const items = recentData?.data
    ? recentData.data.slice(0, 4).map(mapFeedItemToDiscoverItem)
    : [];

  if (isLoading || items.length === 0) {
    return null;
  }

  return (
    <Section>
      <HeaderSection>
        <ScrollReveal>
          <Title>
            <MonoText $use="Heading2">{t("discoverContent.title")}</MonoText>
          </Title>
        </ScrollReveal>
        <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
          <Subtitle>
            <MonoText $use="H4_Medium">
              {t("discoverContent.subtitle")}
            </MonoText>
          </Subtitle>
        </ScrollReveal>
      </HeaderSection>

      <GridContainer>
        {items.map((item) => (
          <DiscoverCard key={item.id} item={item} lng={i18n.language} />
        ))}
      </GridContainer>

      <BottomCtaSection $isSingle={isLoggedIn}>
        {!isLoggedIn && (
          <GenericButton asAnchor href={PATHS.AUTH_SIGNUP} size={SIZE.LG}>
            {t("discoverContent.ctaPrimary")}
          </GenericButton>
        )}
        <GenericButton
          asAnchor
          href={PATHS.EXPLORE_CREATORS}
          variant={VARIANT.SECONDARY}
          fullWidth
          size={SIZE.LG}
        >
          {t("discoverContent.ctaSecondary")}
        </GenericButton>
      </BottomCtaSection>
    </Section>
  );
}
