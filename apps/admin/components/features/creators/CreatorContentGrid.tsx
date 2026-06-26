import { Film, Headphones, FileText } from "lucide-react";
import type { CreatorContentItem } from "../../../types/creator-content";
import { formatRequestedAt } from "../../../utils/date";
import {
  ContentBody,
  ContentGrid,
  ContentMeta,
  ContentThumb,
  ContentThumbFallback,
  ContentThumbImage,
  ContentTitle,
  EmptyState,
} from "../viewers/Viewers.styles";
import {
  ClickableContentCard,
  ContentStatBadge,
  ContentStatsRow,
} from "./Creators.styles";

type CreatorContentGridProps = {
  contents: CreatorContentItem[];
  onSelectContent: (content: CreatorContentItem) => void;
  emptyMessage?: string;
};

function renderMediaIcon(type: string | null, size = 28) {
  if (type === "audio") return <Headphones size={size} />;
  if (type === "pdf") return <FileText size={size} />;
  return <Film size={size} />;
}

export function CreatorContentGrid({
  contents,
  onSelectContent,
  emptyMessage = "No content found.",
}: CreatorContentGridProps) {
  if (!contents.length) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <ContentGrid>
      {contents.map((content) => (
        <ClickableContentCard
          key={content.id}
          type="button"
          onClick={() => onSelectContent(content)}
        >
          <ContentThumb>
            {content.thumbnailUrl ? (
              <ContentThumbImage
                src={content.thumbnailUrl}
                alt={content.title}
              />
            ) : (
              <ContentThumbFallback>
                {renderMediaIcon(content.contentType)}
              </ContentThumbFallback>
            )}
          </ContentThumb>
          <ContentBody>
            <ContentTitle>{content.title}</ContentTitle>
            <ContentMeta>
              {content.contentType || "Content"} · {content.accessType}
            </ContentMeta>
            {content.publishedAt || content.createdAt ? (
              <ContentMeta>
                {formatRequestedAt(content.publishedAt || content.createdAt)}
              </ContentMeta>
            ) : null}
            <ContentStatsRow>
              <ContentStatBadge $variant="buy">
                {content.purchaseCount} bought
              </ContentStatBadge>
              <ContentStatBadge $variant="rent">
                {content.rentalCount} rented
              </ContentStatBadge>
              <ContentStatBadge $variant="download">
                {content.downloadCount} downloads
              </ContentStatBadge>
            </ContentStatsRow>
          </ContentBody>
        </ClickableContentCard>
      ))}
    </ContentGrid>
  );
}
