"use client";

import { useMemo, useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import {
  CURRENT_RENTED_AUDIOS,
  CURRENT_RENTED_COLLECTIONS,
  CURRENT_RENTED_PDFS,
  CURRENT_RENTED_VIDEOS,
  PREVIOUS_RENTED_AUDIOS,
  PREVIOUS_RENTED_COLLECTIONS,
  PREVIOUS_RENTED_PDFS,
  PREVIOUS_RENTED_VIDEOS,
  type RentedCollectionItem,
  type RentedMediaItem,
  type RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
import {
  MOCK_PURCHASED_AUDIOS,
  MOCK_PURCHASED_COLLECTIONS,
  MOCK_PURCHASED_PDFS,
  MOCK_PURCHASED_VIDEOS,
} from "@/utils/dummyData/viewerPurchasedMockData";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import {
  PageHeader,
  PageWrap,
  SectionBlock,
  SectionTitle,
} from "../ClientViewerPurchased/styles";
import LeftIcon from "@/assets/icons/LeftIcon";
import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import PlaylistIcon from "@/assets/icons/PlaylistIcon";
import { VideoIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import {
  CollectionActionRow,
  CollectionBadge,
  CollectionBody,
  CollectionCard,
  CollectionGrid,
  CollectionImage,
  CollectionImageWrap,
  ElementsPill,
  MediaGrid,
  MediaTypePill,
  PassiveActionBlock,
  SectionArrow,
  SectionHeader,
  TwoButtonRow,
} from "./styles";
import {
  filterViewerRentedCollections,
  filterViewerRentedMedia,
  getViewerRentedMediaAction,
  getViewerRentedMediaLabel,
} from "@/utils/viewerRented";
import { useViewerRentedSectionPagination } from "@/hooks/RentedSectionPagination";

type Props = {
  title: string;
  mode: RentedMode;
};

function MediaTypeIcon({ type }: { type: RentedMediaItem["mediaType"] }) {
  if (type === "audio")
    return (
      <AudioFileIcon width={22} height={22} color={COLORS.neutral.BLACK} />
    );
  if (type === "pdf")
    return <PdfFileIcon width={22} height={22} color={COLORS.neutral.BLACK} />;
  return <VideoIcon width={22} height={22} color={COLORS.neutral.BLACK} />;
}

export default function RentedContent({ title, mode }: Props) {
  const [searchValue] = useState("");
  const { getVisibleItems, canSlide, moveNext } =
    useViewerRentedSectionPagination();
  const isCurrent = mode === "currently";
  const isPurchased = mode === "purchased";

  const purchasedCollections = useMemo(
    () =>
      MOCK_PURCHASED_COLLECTIONS.map((item) => ({
        ...item,
      })),
    [],
  );
  const purchasedVideos = useMemo(
    () =>
      MOCK_PURCHASED_VIDEOS.map((item) => ({
        ...item,
        expiryText: item.dateLabel,
      })),
    [],
  );
  const purchasedAudios = useMemo(
    () =>
      MOCK_PURCHASED_AUDIOS.map((item) => ({
        ...item,
        expiryText: item.dateLabel,
      })),
    [],
  );
  const purchasedPdfs = useMemo(
    () =>
      MOCK_PURCHASED_PDFS.map((item) => ({
        ...item,
        expiryText: item.dateLabel,
      })),
    [],
  );

  const collectionsSource = isPurchased
    ? purchasedCollections
    : isCurrent
      ? CURRENT_RENTED_COLLECTIONS
      : PREVIOUS_RENTED_COLLECTIONS;
  const videosSource = isPurchased
    ? purchasedVideos
    : isCurrent
      ? CURRENT_RENTED_VIDEOS
      : PREVIOUS_RENTED_VIDEOS;
  const audiosSource = isPurchased
    ? purchasedAudios
    : isCurrent
      ? CURRENT_RENTED_AUDIOS
      : PREVIOUS_RENTED_AUDIOS;
  const pdfsSource = isPurchased
    ? purchasedPdfs
    : isCurrent
      ? CURRENT_RENTED_PDFS
      : PREVIOUS_RENTED_PDFS;

  const filteredCollections = useMemo(
    () => filterViewerRentedCollections(searchValue, collectionsSource),
    [collectionsSource, searchValue],
  );

  const filteredVideos = useMemo(
    () => filterViewerRentedMedia(searchValue, videosSource),
    [searchValue, videosSource],
  );

  const filteredAudios = useMemo(
    () => filterViewerRentedMedia(searchValue, audiosSource),
    [audiosSource, searchValue],
  );

  const filteredPdfs = useMemo(
    () => filterViewerRentedMedia(searchValue, pdfsSource),
    [pdfsSource, searchValue],
  );

  const visibleCollections = useMemo(
    () => getVisibleItems("collections", filteredCollections),
    [filteredCollections, getVisibleItems],
  );
  const visibleVideos = useMemo(
    () => getVisibleItems("videos", filteredVideos),
    [filteredVideos, getVisibleItems],
  );
  const visibleAudios = useMemo(
    () => getVisibleItems("audios", filteredAudios),
    [filteredAudios, getVisibleItems],
  );
  const visiblePdfs = useMemo(
    () => getVisibleItems("pdfs", filteredPdfs),
    [filteredPdfs, getVisibleItems],
  );

  return (
    <PageWrap>
      <PageHeader>
        <MonoText $use="H4_SemiBold">{title}</MonoText>
        <SearchIcon />
      </PageHeader>

      <SectionBlock>
        <SectionHeader>
          <SectionTitle>Collections</SectionTitle>
          <SectionArrow
            type="button"
            disabled={!canSlide("collections", filteredCollections.length)}
            aria-disabled={!canSlide("collections", filteredCollections.length)}
            onClick={() => moveNext("collections", filteredCollections.length)}
          >
            <LeftIcon />
          </SectionArrow>
        </SectionHeader>
        <CollectionGrid>
          {visibleCollections.map((item) => (
            <CollectionCard key={item.id}>
              <CollectionImageWrap>
                <CollectionBadge>
                  {isPurchased ? "Owned" : isCurrent ? "In rental" : "Rented"}
                </CollectionBadge>
                <CollectionImage src={item.coverSrc} alt={item.title} />
              </CollectionImageWrap>

              <CollectionBody>
                <MonoText $use="H4_Medium">{item.title}</MonoText>
                <MonoText $use="Body_Medium">{item.author}</MonoText>

                <ElementsPill>
                  <PlaylistIcon
                    width={20}
                    height={20}
                    color={COLORS.neutral.GRAY_700}
                  />
                  <MonoText $use="Body_Bold">
                    {item.elementCount} elements
                  </MonoText>
                </ElementsPill>

                <CollectionActionRow>
                  {isPurchased ? (
                    <GenericButton variant={VARIANT.PRIMARY} size="md">
                      See content
                    </GenericButton>
                  ) : (
                    <GenericButton variant={VARIANT.PRIMARY} size="md">
                      Buy xx kr
                    </GenericButton>
                  )}
                  {isCurrent ? (
                    <PassiveActionBlock>
                      <MonoText
                        $use="Body_Medium"
                        color={COLORS.neutral.GRAY_400}
                      >
                        Active rental
                      </MonoText>
                      <MonoText $use="Body_Medium" color={COLORS.primary.RED}>
                        Expires in 2 days
                      </MonoText>
                    </PassiveActionBlock>
                  ) : isPurchased ? null : (
                    <GenericButton variant={VARIANT.SECONDARY} size="md">
                      Rent xx kr
                    </GenericButton>
                  )}
                </CollectionActionRow>
              </CollectionBody>
            </CollectionCard>
          ))}
        </CollectionGrid>
      </SectionBlock>

      {[
        {
          title: "Videos",
          items: visibleVideos,
          key: "videos" as const,
          total: filteredVideos.length,
        },
        {
          title: "Audios",
          items: visibleAudios,
          key: "audios" as const,
          total: filteredAudios.length,
        },
        {
          title: "PDF",
          items: visiblePdfs,
          key: "pdfs" as const,
          total: filteredPdfs.length,
        },
      ].map((section) => (
        <SectionBlock key={section.title}>
          <SectionHeader>
            <SectionTitle>{section.title}</SectionTitle>
            <SectionArrow
              type="button"
              disabled={
                section.key === "videos"
                  ? !canSlide("videos", filteredVideos.length)
                  : section.key === "audios"
                    ? !canSlide("audios", filteredAudios.length)
                    : !canSlide("pdfs", filteredPdfs.length)
              }
              aria-disabled={
                section.key === "videos"
                  ? !canSlide("videos", filteredVideos.length)
                  : section.key === "audios"
                    ? !canSlide("audios", filteredAudios.length)
                    : !canSlide("pdfs", filteredPdfs.length)
              }
              onClick={() => moveNext(section.key, section.total)}
            >
              <LeftIcon />
            </SectionArrow>
          </SectionHeader>
          <MediaGrid>
            {section.items.map((item) => (
              <GenericCard
                key={item.id}
                image={item.thumbSrc}
                title={<MonoText $use="H5_Medium">{item.title}</MonoText>}
                subtitle={<MonoText $use="Body_Medium">{item.author}</MonoText>}
                badge={<MonoText $use="Body_Bold">{item.category}</MonoText>}
                footer={
                  isPurchased ? (
                    <GenericButton
                      variant={VARIANT.SECONDARY}
                      size="md"
                      fullWidth
                    >
                      {getViewerRentedMediaAction(item.mediaType)}
                    </GenericButton>
                  ) : isCurrent ? (
                    <GenericButton
                      variant={VARIANT.SECONDARY}
                      size="md"
                      fullWidth
                    >
                      {getViewerRentedMediaAction(item.mediaType)}
                    </GenericButton>
                  ) : (
                    <TwoButtonRow>
                      <GenericButton
                        variant={VARIANT.SECONDARY}
                        size="md"
                        fullWidth
                      >
                        Buy xx kr
                      </GenericButton>
                      <GenericButton
                        variant={VARIANT.SECONDARY}
                        size="md"
                        fullWidth
                      >
                        Rent xx kr
                      </GenericButton>
                    </TwoButtonRow>
                  )
                }
              >
                <MonoText
                  $use="Body_Medium"
                  color={
                    isPurchased
                      ? COLORS.neutral.GRAY_400
                      : isCurrent
                        ? COLORS.primary.RED
                        : COLORS.neutral.GRAY_400
                  }
                >
                  {item.expiryText}
                </MonoText>
                <MediaTypePill>
                  <MediaTypeIcon type={item.mediaType} />
                  <MonoText $use="Body_Bold">
                    {getViewerRentedMediaLabel(item.mediaType)}
                  </MonoText>
                </MediaTypePill>
              </GenericCard>
            ))}
          </MediaGrid>
        </SectionBlock>
      ))}
    </PageWrap>
  );
}
