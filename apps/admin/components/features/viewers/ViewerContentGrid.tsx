import { Film, FolderOpen, Headphones, FileText } from "lucide-react";
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
  ContentThumbFallback,
  ContentThumbImage,
  ContentTitle,
  EmptyState,
} from "./Viewers.styles";

type ViewerContentGridProps = {
  data: ViewerContentData;
  rentalMode?: "active" | "expired";
  emptyMessage?: string;
};

function renderMediaIcon(type: string | null, size = 28) {
  if (type === "audio") return <Headphones size={size} />;
  if (type === "pdf") return <FileText size={size} />;
  return <Film size={size} />;
}

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
        {item.thumbnailUrl ? (
          <ContentThumbImage src={item.thumbnailUrl} alt={item.title} />
        ) : (
          <ContentThumbFallback>
            {renderMediaIcon(item.contentType)}
          </ContentThumbFallback>
        )}
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
        {item.coverImageUrl ? (
          <ContentThumbImage src={item.coverImageUrl} alt={item.name} />
        ) : (
          <ContentThumbFallback>
            <FolderOpen size={28} />
          </ContentThumbFallback>
        )}
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
