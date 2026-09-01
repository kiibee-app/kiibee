"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Film, Play, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useContentEngagement,
  useContentMediaPreview,
  useRejectContent,
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
  CONTENT_FORMAT,
  canPreviewContent,
  getContentExternalUrl,
  isThirdPartyVideoPreviewUrl,
  toEmbeddablePreviewUrl,
  type ContentFormat,
} from "../../../utils/contentMedia";
import { EngagementUserList } from "./EngagementUserList";
import { ContentPreviewModal } from "./ContentPreviewModal";
import { RejectContentModal } from "./RejectContentModal";
import {
  HeroActions,
  PlayButton,
  PriceMeta,
  RejectContentButton,
} from "./Creators.styles";
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
  EMAIL_REGISTERED: "email_registered",
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EngagementTab>(
    ENGAGEMENT_TAB.PURCHASES,
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFormat, setPreviewFormat] = useState<ContentFormat | null>(
    null,
  );
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  const engagementQuery = useContentEngagement(contentId);
  const mediaPreview = useContentMediaPreview();
  const rejectContent = useRejectContent();

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

  const {
    content,
    purchases,
    emailRegistrations = [],
    rentals,
    downloads,
    stats,
  } = engagementQuery.data;

  const showPricing =
    content.accessType === creatorContentEngagementValues.paidAccessType;
  const canPlay = canPreviewContent({
    contentType: content.contentType,
    contentTypeId: content.contentTypeId,
    fileKey: content.fileKey,
    contentUrl: getContentExternalUrl(content),
  });

  const handlePlay = async () => {
    const externalUrl = getContentExternalUrl(content);

    if (externalUrl && isThirdPartyVideoPreviewUrl(externalUrl)) {
      setPreviewOpen(true);
      setPreviewError(null);
      setPreviewUrl(toEmbeddablePreviewUrl(externalUrl));
      setPreviewFormat(CONTENT_FORMAT.VIDEO);
      return;
    }

    setPreviewOpen(true);
    setPreviewError(null);
    setPreviewUrl(null);
    setPreviewFormat(null);

    try {
      const result = await mediaPreview.mutateAsync({
        contentType: content.contentType,
        contentTypeId: content.contentTypeId,
        fileKey: content.fileKey,
        contentUrl: externalUrl,
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

  const handleReject = async (reason: string) => {
    try {
      await rejectContent.mutateAsync({ contentId, reason, creatorId });
      toast.success(creatorContentEngagementLabels.rejectSuccess);
      setRejectOpen(false);
      router.push(`/all-creators/${creatorId}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : creatorContentEngagementLabels.rejectFailed,
      );
    }
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
          <HeroActions>
            {canPlay ? (
              <PlayButton
                type="button"
                onClick={handlePlay}
                disabled={mediaPreview.isPending || rejectContent.isPending}
              >
                <Play size={14} />
                {mediaPreview.isPending
                  ? creatorContentEngagementLabels.loadingPreview
                  : creatorContentEngagementLabels.playContent}
              </PlayButton>
            ) : null}
            <RejectContentButton
              type="button"
              onClick={() => setRejectOpen(true)}
              disabled={rejectContent.isPending}
            >
              <X size={14} />
              {creatorContentEngagementLabels.rejectContent}
            </RejectContentButton>
          </HeroActions>
        </ProfileInfo>
      </ProfileHero>

      <StatsRow>
        <StatCard>
          <StatLabel>{creatorContentEngagementLabels.purchased}</StatLabel>
          <StatValue>{stats.purchaseCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>
            {creatorContentEngagementLabels.emailRegistered}
          </StatLabel>
          <StatValue>{stats.emailRegisteredCount ?? 0}</StatValue>
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
          $active={activeTab === ENGAGEMENT_TAB.EMAIL_REGISTERED}
          onClick={() => setActiveTab(ENGAGEMENT_TAB.EMAIL_REGISTERED)}
        >
          {creatorContentEngagementLabels.emailRegisteredTab} (
          {stats.emailRegisteredCount ?? 0})
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
              : activeTab === ENGAGEMENT_TAB.EMAIL_REGISTERED
                ? creatorContentEngagementLabels.whoRegisteredEmail
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
          {activeTab === ENGAGEMENT_TAB.EMAIL_REGISTERED ? (
            <EngagementUserList
              users={emailRegistrations}
              emptyMessage={creatorContentEngagementLabels.noEmailRegistrations}
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

      <RejectContentModal
        open={rejectOpen}
        contentTitle={content.title}
        isSubmitting={rejectContent.isPending}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
      />
    </DetailsLayout>
  );
}
