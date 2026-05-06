"use client";

import { useMemo, useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import {
  type RentedMediaItem,
  type RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
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
  ACTIVE_RENTAL_TEXT,
  RENTED_BUTTON_TEXT,
  RENTED_MEDIA_SECTIONS,
  filterCollections,
  filterMedia,
  getCollectionBadgeText,
  getCollectionPrimaryActionText,
  getMediaAction,
  getMediaLabel,
  getRentedContentSources,
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
  const sources = useMemo(() => getRentedContentSources(mode), [mode]);

  const filteredCollections = useMemo(
    () => filterCollections(searchValue, sources.collections),
    [searchValue, sources.collections],
  );

  const filteredVideos = useMemo(
    () => filterMedia(searchValue, sources.videos),
    [searchValue, sources.videos],
  );

  const filteredAudios = useMemo(
    () => filterMedia(searchValue, sources.audios),
    [searchValue, sources.audios],
  );

  const filteredPdfs = useMemo(
    () => filterMedia(searchValue, sources.pdfs),
    [searchValue, sources.pdfs],
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
  const sectionTotals = {
    videos: filteredVideos.length,
    audios: filteredAudios.length,
    pdfs: filteredPdfs.length,
  } as const;
  const sectionItems = {
    videos: visibleVideos,
    audios: visibleAudios,
    pdfs: visiblePdfs,
  } as const;

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
                  {getCollectionBadgeText(mode)}
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
                  <GenericButton variant={VARIANT.PRIMARY} size="md">
                    {getCollectionPrimaryActionText(mode)}
                  </GenericButton>
                  {isCurrent ? (
                    <PassiveActionBlock>
                      <MonoText
                        $use="Body_Medium"
                        color={COLORS.neutral.GRAY_400}
                      >
                        {ACTIVE_RENTAL_TEXT.title}
                      </MonoText>
                      <MonoText $use="Body_Medium" color={COLORS.primary.RED}>
                        {ACTIVE_RENTAL_TEXT.expiresIn}
                      </MonoText>
                    </PassiveActionBlock>
                  ) : isPurchased ? null : (
                    <GenericButton variant={VARIANT.SECONDARY} size="md">
                      {RENTED_BUTTON_TEXT.rent}
                    </GenericButton>
                  )}
                </CollectionActionRow>
              </CollectionBody>
            </CollectionCard>
          ))}
        </CollectionGrid>
      </SectionBlock>

      {RENTED_MEDIA_SECTIONS.map((section) => (
        <SectionBlock key={section.title}>
          <SectionHeader>
            <SectionTitle>{section.title}</SectionTitle>
            <SectionArrow
              type="button"
              disabled={!canSlide(section.key, sectionTotals[section.key])}
              aria-disabled={!canSlide(section.key, sectionTotals[section.key])}
              onClick={() => moveNext(section.key, sectionTotals[section.key])}
            >
              <LeftIcon />
            </SectionArrow>
          </SectionHeader>
          <MediaGrid>
            {sectionItems[section.key].map((item) => (
              <GenericCard
                key={item.id}
                image={item.thumbSrc}
                title={<MonoText $use="H5_Medium">{item.title}</MonoText>}
                subtitle={<MonoText $use="Body_Medium">{item.author}</MonoText>}
                badge={<MonoText $use="Body_Bold">{item.category}</MonoText>}
                footer={
                  isPurchased || isCurrent ? (
                    <GenericButton
                      variant={VARIANT.SECONDARY}
                      size="md"
                      fullWidth
                    >
                      {getMediaAction(item.mediaType)}
                    </GenericButton>
                  ) : (
                    <TwoButtonRow>
                      <GenericButton
                        variant={VARIANT.SECONDARY}
                        size="md"
                        fullWidth
                      >
                        {RENTED_BUTTON_TEXT.buy}
                      </GenericButton>
                      <GenericButton
                        variant={VARIANT.SECONDARY}
                        size="md"
                        fullWidth
                      >
                        {RENTED_BUTTON_TEXT.rent}
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
                    {getMediaLabel(item.mediaType)}
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
