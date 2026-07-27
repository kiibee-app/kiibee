"use client";

import { useState } from "react";
import { ArrowLeft, Film, Play } from "lucide-react";
import {
  useContentEngagement,
  useContentMediaPreview,
} from "../../../hooks/api";
import { formatRequestedAt } from "../../../utils/date";
import {
  formatBuyPrice,
  formatRentPrice,
} from "../../../utils/creatorUploadsConfig";
import {
  creatorContentEngagementLabels,
  creatorContentEngagementLayout,
  creatorContentEngagementValues,
} from "../../../utils/contentConfig";
import {
  canPreviewContent,
  type ContentFormat,
} from "../../../utils/contentMedia";
import { EngagementUserList } from "./EngagementUserList";
import { ContentPreviewModal } from "./ContentPreviewModal";
import { HeroActions, PlayButton, PriceMeta } from "./Creators.styles";
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFormat, setPreviewFormat] = useState<ContentFormat | null>(
    null,
  );
  const [previewError, setPreviewError] = useState<string | null>(null);

  const engagementQuery = useContentEngagement(contentId);
  const mediaPreview = useContentMediaPreview();

  if (engagementQuery.isLoading) {
    return (
      <LoadingState>
        {creatorContentEngagementLabels.loadingDetails}
      </LoadingState>
    );
  }

  if (engagementQuery.isError || !engagementQuery.data) {
    return (
      <ViewersState>
        {engagementQuery.error?.message ||
          creatorContentEngagementLabels.loadDetailsFailed}
      </ViewersState>
    );
  }

  const { content, purchases, rentals, downloads, stats } =
    engagementQuery.data;

  const showPricing =
    content.accessType === creatorContentEngagementValues.paidAccessType;
  const canPlay = canPreviewContent({
    contentType: content.contentType,
    contentTypeId: content.contentTypeId,
    fileKey: content.fileKey,
    contentUrl: content.contentUrl,
  });

  const handlePlay = async () => {
    setPreviewOpen(true);
    setPreviewError(null);
    setPreviewUrl(null);
    setPreviewFormat(null);

    try {
      const result = await mediaPreview.mutateAsync({
        contentType: content.contentType,
        contentTypeId: content.contentTypeId,
        fileKey: content.fileKey,
        contentUrl: content.contentUrl,
      });
      setPreviewUrl(result.url);
      setPreviewFormat(result.format);
    } catch (error) {
      setPreviewError(
        error instanceof Error
          ? error.message
          : creatorContentEngagementLabels.previewLoadFailed,
      );
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewFormat(null);
    setPreviewError(null);
  };

  return (
    <DetailsLayout>
      <BackLink href={`/all-creators/${creatorId}`}>
        <ArrowLeft size={16} />
        {creatorContentEngagementLabels.backToCreator}
      </BackLink>

      <ProfileHero>
        <ContentThumb
          style={{
            width: creatorContentEngagementLayout.heroThumbWidth,
            height: creatorContentEngagementLayout.heroThumbHeight,
            borderRadius: creatorContentEngagementLayout.heroThumbRadius,
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
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
            {content.contentType ||
              creatorContentEngagementLabels.fallbackContentType}{" "}
            · {content.accessType} ·{" "}
            {content.isPublished
              ? creatorContentEngagementLabels.published
              : creatorContentEngagementLabels.draft}
          </ProfileEmail>
          {showPricing ? (
            <PriceMeta>
              {formatBuyPrice(content.buyPrice)} ·{" "}
              {formatRentPrice(content.rentPrice)}
            </PriceMeta>
          ) : null}
          {content.publishedAt || content.createdAt ? (
            <ProfileEmail>
              {formatRequestedAt(content.publishedAt || content.createdAt)}
            </ProfileEmail>
          ) : null}
          {canPlay ? (
            <HeroActions>
              <PlayButton
                type="button"
                onClick={handlePlay}
                disabled={mediaPreview.isPending}
              >
                <Play size={14} />
                {mediaPreview.isPending
                  ? creatorContentEngagementLabels.loadingPreview
                  : creatorContentEngagementLabels.playContent}
              </PlayButton>
            </HeroActions>
          ) : null}
        </ProfileInfo>
      </ProfileHero>

      <StatsRow>
        <StatCard>
          <StatLabel>{creatorContentEngagementLabels.purchased}</StatLabel>
          <StatValue>{stats.purchaseCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>{creatorContentEngagementLabels.rented}</StatLabel>
          <StatValue>{stats.rentalCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>{creatorContentEngagementLabels.downloads}</StatLabel>
          <StatValue>{stats.downloadCount}</StatValue>
        </StatCard>
      </StatsRow>

      <DetailsTabs aria-label={creatorContentEngagementLabels.tabsAriaLabel}>
        <DetailsTabButton
          type="button"
          $active={activeTab === ENGAGEMENT_TAB.PURCHASES}
          onClick={() => setActiveTab(ENGAGEMENT_TAB.PURCHASES)}
        >
          {creatorContentEngagementLabels.purchasedTab} ({stats.purchaseCount})
        </DetailsTabButton>
        <DetailsTabButton
          type="button"
          $active={activeTab === ENGAGEMENT_TAB.RENTALS}
          onClick={() => setActiveTab(ENGAGEMENT_TAB.RENTALS)}
        >
          {creatorContentEngagementLabels.rentedTab} ({stats.rentalCount})
        </DetailsTabButton>
        <DetailsTabButton
          type="button"
          $active={activeTab === ENGAGEMENT_TAB.DOWNLOADS}
          onClick={() => setActiveTab(ENGAGEMENT_TAB.DOWNLOADS)}
        >
          {creatorContentEngagementLabels.downloadedTab} ({stats.downloadCount})
        </DetailsTabButton>
      </DetailsTabs>

      <DetailsSection>
        <DetailsSectionHeader>
          <DetailsSectionTitle>
            {activeTab === ENGAGEMENT_TAB.PURCHASES
              ? creatorContentEngagementLabels.whoPurchased
              : activeTab === ENGAGEMENT_TAB.RENTALS
                ? creatorContentEngagementLabels.whoRented
                : creatorContentEngagementLabels.whoDownloaded}
          </DetailsSectionTitle>
        </DetailsSectionHeader>
        <DetailsSectionBody>
          {activeTab === ENGAGEMENT_TAB.PURCHASES ? (
            <EngagementUserList
              users={purchases}
              emptyMessage={creatorContentEngagementLabels.noPurchases}
            />
          ) : null}
          {activeTab === ENGAGEMENT_TAB.RENTALS ? (
            <EngagementUserList
              users={rentals}
              emptyMessage={creatorContentEngagementLabels.noRentals}
              showExpiry
            />
          ) : null}
          {activeTab === ENGAGEMENT_TAB.DOWNLOADS ? (
            <EngagementUserList
              users={downloads}
              emptyMessage={creatorContentEngagementLabels.noDownloads}
            />
          ) : null}
        </DetailsSectionBody>
      </DetailsSection>

      <ContentPreviewModal
        open={previewOpen}
        onClose={handleClosePreview}
        title={content.title}
        url={previewUrl}
        format={previewFormat}
        isLoading={mediaPreview.isPending}
        error={previewError}
      />
    </DetailsLayout>
  );
}
