import { FolderOpen } from "lucide-react";
import type {
  ViewerCollectionItem,
  ViewerContentData,
  ViewerMediaItem,
} from "../../../types/viewer";
import { formatRequestedAt } from "../../../utils/date";
import {
  ContentBody,
  ContentCard,
  ContentGrid,
  ContentMeta,
  ContentThumb,
  ContentTitle,
  EmptyState,
} from "./Viewers.styles";
import { ContentThumbnail } from "../../common/ContentThumbnail";

type ViewerContentGridProps = {
  data: ViewerContentData;
  rentalMode?: "active" | "expired";
  emptyMessage?: string;
};

function MediaCard({
  item,
  rentalMode,
}: {
  item: ViewerMediaItem;
  rentalMode?: "active" | "expired";
}) {
  const isRental = Boolean(rentalMode);

  return (
    <ContentCard>
      <ContentThumb>
        <ContentThumbnail
          src={item.thumbnailUrl}
          alt={item.title}
          contentType={item.contentType}
        />
      </ContentThumb>
      <ContentBody>
        <ContentTitle>{item.title}</ContentTitle>
        {item.creatorName ? (
          <ContentMeta>by {item.creatorName}</ContentMeta>
        ) : null}
        {item.categoryName ? (
          <ContentMeta>{item.categoryName}</ContentMeta>
        ) : null}
        {item.purchasedAt ? (
          <ContentMeta>
            {isRental ? "Rented" : "Purchased"}{" "}
            {formatRequestedAt(item.purchasedAt)}
          </ContentMeta>
        ) : null}
        {rentalMode === "active" && item.rentExpiresAt ? (
          <ContentMeta>
            Expires {formatRequestedAt(item.rentExpiresAt)}
          </ContentMeta>
        ) : null}
        {rentalMode === "expired" && item.rentExpiresAt ? (
          <ContentMeta>
            Expired {formatRequestedAt(item.rentExpiresAt)}
          </ContentMeta>
        ) : null}
      </ContentBody>
    </ContentCard>
  );
}

function CollectionCard({
  item,
  rentalMode,
}: {
  item: ViewerCollectionItem;
  rentalMode?: "active" | "expired";
}) {
  const isRental = Boolean(rentalMode);

  return (
    <ContentCard>
      <ContentThumb>
        <ContentThumbnail
          src={item.coverImageUrl}
          alt={item.name}
          fallbackIcon={<FolderOpen size={28} />}
        />
      </ContentThumb>
      <ContentBody>
        <ContentTitle>{item.name}</ContentTitle>
        {item.creatorName ? (
          <ContentMeta>by {item.creatorName}</ContentMeta>
        ) : null}
        <ContentMeta>{item.elementCount} items</ContentMeta>
        {item.purchasedAt ? (
          <ContentMeta>
            {isRental ? "Rented" : "Purchased"}{" "}
            {formatRequestedAt(item.purchasedAt)}
          </ContentMeta>
        ) : null}
      </ContentBody>
    </ContentCard>
  );
}

export function getViewerContentCount(data: ViewerContentData) {
  return (
    data.collections.length +
    data.videos.length +
    data.audios.length +
    data.pdfs.length
  );
}

export function ViewerContentGrid({
  data,
  rentalMode,
  emptyMessage = "No content found.",
}: ViewerContentGridProps) {
  const items = [
    ...data.collections.map((item) => ({ kind: "collection" as const, item })),
    ...data.videos.map((item) => ({ kind: "media" as const, item })),
    ...data.audios.map((item) => ({ kind: "media" as const, item })),
    ...data.pdfs.map((item) => ({ kind: "media" as const, item })),
  ];

  if (!items.length) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <ContentGrid>
      {items.map((entry) =>
        entry.kind === "collection" ? (
          <CollectionCard
            key={`collection-${entry.item.id}`}
            item={entry.item}
            rentalMode={rentalMode}
          />
        ) : (
          <MediaCard
            key={`media-${entry.item.id}`}
            item={entry.item}
            rentalMode={rentalMode}
          />
        ),
      )}
    </ContentGrid>
  );
}
