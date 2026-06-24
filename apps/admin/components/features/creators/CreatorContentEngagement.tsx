"use client";

import { useState } from "react";
import { ArrowLeft, Film } from "lucide-react";
import { useContentEngagement } from "../../../hooks/api";
import { formatRequestedAt } from "../../../utils/date";
import { EngagementUserList } from "./EngagementUserList";
import {
  BackLink,
  ContentThumb,
  ContentThumbFallback,
  ContentThumbImage,
  DetailsLayout,
  DetailsSection,
  DetailsSectionBody,
  DetailsSectionHeader,
  DetailsSectionTitle,
  DetailsTabButton,
  DetailsTabs,
  LoadingState,
  ProfileEmail,
  ProfileHero,
  ProfileInfo,
  ProfileName,
  StatCard,
  StatLabel,
  StatValue,
  StatsRow,
  ViewersState,
} from "../viewers/Viewers.styles";

const ENGAGEMENT_TAB = {
  PURCHASES: "purchases",
  RENTALS: "rentals",
  DOWNLOADS: "downloads",
} as const;

type EngagementTab = (typeof ENGAGEMENT_TAB)[keyof typeof ENGAGEMENT_TAB];

type CreatorContentEngagementProps = {
  creatorId: string;
  contentId: string;
};

export function CreatorContentEngagement({
  creatorId,
  contentId,
}: CreatorContentEngagementProps) {
  const [activeTab, setActiveTab] = useState<EngagementTab>(
    ENGAGEMENT_TAB.PURCHASES,
  );
  const engagementQuery = useContentEngagement(contentId);

  if (engagementQuery.isLoading) {
    return <LoadingState>Loading content details…</LoadingState>;
  }

  if (engagementQuery.isError || !engagementQuery.data) {
    return (
      <ViewersState>
        {engagementQuery.error?.message || "Failed to load content details."}
      </ViewersState>
    );
  }

  const { content, purchases, rentals, downloads, stats } =
    engagementQuery.data;

  return (
    <DetailsLayout>
      <BackLink href={`/all-creators/${creatorId}`}>
        <ArrowLeft size={16} />
        Back to creator
      </BackLink>

      <ProfileHero>
        <ContentThumb style={{ width: 120, borderRadius: 12, flexShrink: 0 }}>
          {content.thumbnailUrl ? (
            <ContentThumbImage src={content.thumbnailUrl} alt={content.title} />
          ) : (
            <ContentThumbFallback>
              <Film size={32} />
            </ContentThumbFallback>
          )}
        </ContentThumb>
        <ProfileInfo>
          <ProfileName>{content.title}</ProfileName>
          <ProfileEmail>
            {content.contentType || "Content"} · {content.accessType} ·{" "}
            {content.isPublished ? "Published" : "Draft"}
          </ProfileEmail>
          {content.publishedAt || content.createdAt ? (
            <ProfileEmail>
              {formatRequestedAt(content.publishedAt || content.createdAt)}
            </ProfileEmail>
          ) : null}
        </ProfileInfo>
      </ProfileHero>

      <StatsRow>
        <StatCard>
          <StatLabel>Purchased</StatLabel>
          <StatValue>{stats.purchaseCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Rented</StatLabel>
          <StatValue>{stats.rentalCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Downloads</StatLabel>
          <StatValue>{stats.downloadCount}</StatValue>
        </StatCard>
      </StatsRow>

      <DetailsTabs aria-label="Content engagement sections">
        <DetailsTabButton
          type="button"
          $active={activeTab === ENGAGEMENT_TAB.PURCHASES}
          onClick={() => setActiveTab(ENGAGEMENT_TAB.PURCHASES)}
        >
          Purchased ({stats.purchaseCount})
        </DetailsTabButton>
        <DetailsTabButton
          type="button"
          $active={activeTab === ENGAGEMENT_TAB.RENTALS}
          onClick={() => setActiveTab(ENGAGEMENT_TAB.RENTALS)}
        >
          Rented ({stats.rentalCount})
        </DetailsTabButton>
        <DetailsTabButton
          type="button"
          $active={activeTab === ENGAGEMENT_TAB.DOWNLOADS}
          onClick={() => setActiveTab(ENGAGEMENT_TAB.DOWNLOADS)}
        >
          Downloaded ({stats.downloadCount})
        </DetailsTabButton>
      </DetailsTabs>

      <DetailsSection>
        <DetailsSectionHeader>
          <DetailsSectionTitle>
            {activeTab === ENGAGEMENT_TAB.PURCHASES
              ? "Who Purchased"
              : activeTab === ENGAGEMENT_TAB.RENTALS
                ? "Who Rented"
                : "Who Downloaded"}
          </DetailsSectionTitle>
        </DetailsSectionHeader>
        <DetailsSectionBody>
          {activeTab === ENGAGEMENT_TAB.PURCHASES ? (
            <EngagementUserList
              users={purchases}
              emptyMessage="No purchases yet."
            />
          ) : null}
          {activeTab === ENGAGEMENT_TAB.RENTALS ? (
            <EngagementUserList
              users={rentals}
              emptyMessage="No rentals yet."
              showExpiry
            />
          ) : null}
          {activeTab === ENGAGEMENT_TAB.DOWNLOADS ? (
            <EngagementUserList
              users={downloads}
              emptyMessage="No downloads yet."
            />
          ) : null}
        </DetailsSectionBody>
      </DetailsSection>
    </DetailsLayout>
  );
}
