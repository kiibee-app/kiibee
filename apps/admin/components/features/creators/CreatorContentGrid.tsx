import { Film, Headphones, FileText } from "lucide-react";
import type { CreatorContentItem } from "../../../types/creator-content";
import { formatRequestedAt } from "../../../utils/date";
import { formatPriceSummary } from "../../../utils/creatorUploadsConfig";
import {
  CONTENT_FORMAT,
  normalizeContentFormat,
} from "../../../utils/contentMedia";
import {
  creatorContentGridLabels,
  isEmailGatedAccessType,
  STAT_BADGE_VARIANTS,
} from "../../../utils/contentConfig";
import {
  ContentBody,
  ContentGrid,
  ContentMeta,
  ContentThumbFallback,
  ContentTitle,
  EmptyState,
} from "../viewers/Viewers.styles";
import {
  CardCover,
  CardCoverBlur,
  CardCoverMain,
  CardCoverOverlay,
  ClickableContentCard,
  ContentStatBadge,
  ContentStatsRow,
  PriceMeta,
} from "./Creators.styles";

type CreatorContentGridProps = {
  contents: CreatorContentItem[];
  onSelectContent: (content: CreatorContentItem) => void;
  emptyMessage?: string;
};

function renderMediaIcon(type: string | null, size = 28) {
  const format = normalizeContentFormat(type);
  if (format === CONTENT_FORMAT.AUDIO) return <Headphones size={size} />;
  if (format === CONTENT_FORMAT.PDF || format === CONTENT_FORMAT.EPUB) {
    return <FileText size={size} />;
  }
  return <Film size={size} />;
}

export function CreatorContentGrid({
  contents,
  onSelectContent,
  emptyMessage = creatorContentGridLabels.emptyState,
}: CreatorContentGridProps) {
  if (!contents.length) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <ContentGrid>
      {contents.map((content) => {
        const priceSummary = formatPriceSummary(
          content.buyPrice,
          content.rentPrice,
        );

        return (
          <ClickableContentCard
            key={content.id}
            type="button"
            onClick={() => onSelectContent(content)}
          >
            <CardCover>
              {content.thumbnailUrl ? (
                <>
                  <CardCoverBlur src={content.thumbnailUrl} alt="" />
                  <CardCoverOverlay />
                  <CardCoverMain
                    src={content.thumbnailUrl}
                    alt={content.title}
                  />
                </>
              ) : (
                <ContentThumbFallback>
                  {renderMediaIcon(content.contentType)}
                </ContentThumbFallback>
              )}
            </CardCover>
            <ContentBody>
              <ContentTitle>{content.title}</ContentTitle>
              <ContentMeta>
                {content.contentType ||
                  creatorContentGridLabels.fallbackContentType}{" "}
                · {content.accessType}
              </ContentMeta>
              {priceSummary ? <PriceMeta>{priceSummary}</PriceMeta> : null}
              {content.publishedAt || content.createdAt ? (
                <ContentMeta>
                  {formatRequestedAt(content.publishedAt || content.createdAt)}
                </ContentMeta>
              ) : null}
              <ContentStatsRow>
                {isEmailGatedAccessType(content.accessType) ? (
                  <>
                    <ContentStatBadge $variant={STAT_BADGE_VARIANTS.BUY}>
                      {content.emailRegisteredCount ?? 0}{" "}
                      {creatorContentGridLabels.emailRegisteredSuffix}
                    </ContentStatBadge>
                    {content.purchaseCount > 0 ? (
                      <ContentStatBadge $variant={STAT_BADGE_VARIANTS.BUY}>
                        {content.purchaseCount}{" "}
                        {creatorContentGridLabels.boughtSuffix}
                      </ContentStatBadge>
                    ) : null}
                  </>
                ) : (
                  <>
                    <ContentStatBadge $variant={STAT_BADGE_VARIANTS.BUY}>
                      {content.purchaseCount}{" "}
                      {creatorContentGridLabels.boughtSuffix}
                    </ContentStatBadge>
                    {(content.emailRegisteredCount ?? 0) > 0 ? (
                      <ContentStatBadge $variant={STAT_BADGE_VARIANTS.BUY}>
                        {content.emailRegisteredCount}{" "}
                        {creatorContentGridLabels.emailRegisteredSuffix}
                      </ContentStatBadge>
                    ) : null}
                  </>
                )}
                <ContentStatBadge $variant={STAT_BADGE_VARIANTS.RENT}>
                  {content.rentalCount} {creatorContentGridLabels.rentedSuffix}
                </ContentStatBadge>
                <ContentStatBadge $variant={STAT_BADGE_VARIANTS.DOWNLOAD}>
                  {content.downloadCount}{" "}
                  {creatorContentGridLabels.downloadsSuffix}
                </ContentStatBadge>
              </ContentStatsRow>
            </ContentBody>
          </ClickableContentCard>
        );
      })}
    </ContentGrid>
  );
}
