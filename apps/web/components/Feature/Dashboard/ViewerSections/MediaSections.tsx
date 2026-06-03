"use client";

import { MonoText } from "@/components/UI/Monotext";
import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import { VideoIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import LeftIcon from "@/assets/icons/LeftIcon";
import type {
  RentedMediaItem,
  RentedMode,
} from "@/utils/dummyData/viewerRentedMockData";
import {
  RENTED_BUTTON_TEXT,
  RENTED_MEDIA_SECTIONS,
  RENTED_SECTION_KEYS,
  RENTED_MEDIA_TYPES,
  RENTED_MODES,
  type RentedSectionKey,
  getMediaAction,
  getMediaLabel,
} from "@/utils/viewerRented";
import {
  MediaGrid,
  MediaTypePill,
  SectionHeader,
  SectionTitle,
  SectionTitleRow,
  InlineSectionArrow,
  TwoButtonRow,
  SectionBlock,
} from "./styles";
import SectionPaginationArrows from "./SectionPaginationArrows";

type Props = {
  mode: RentedMode;
  sectionItems: Record<
    Exclude<RentedSectionKey, "collections">,
    RentedMediaItem[]
  >;
  sectionTotals: Record<Exclude<RentedSectionKey, "collections">, number>;
  canSlide: (section: RentedSectionKey, totalItems: number) => boolean;
  canGoPrev: (section: RentedSectionKey) => boolean;
  canGoNext: (section: RentedSectionKey, totalItems: number) => boolean;
  movePrev: (section: RentedSectionKey, totalItems: number) => void;
  moveNext: (section: RentedSectionKey, totalItems: number) => void;
  onMediaPrimaryAction?: (item: RentedMediaItem) => void;
  onOpenSection?: (
    section: Exclude<RentedSectionKey, "collections">,
    item: RentedMediaItem | undefined,
  ) => void;
};

function MediaTypeIcon({ type }: { type: RentedMediaItem["mediaType"] }) {
  if (type === RENTED_MEDIA_TYPES.AUDIO) {
    return (
      <AudioFileIcon width={22} height={22} color={COLORS.neutral.BLACK} />
    );
  }
  if (type === RENTED_MEDIA_TYPES.PDF) {
    return <PdfFileIcon width={22} height={22} color={COLORS.neutral.BLACK} />;
  }
  return <VideoIcon width={22} height={22} color={COLORS.neutral.BLACK} />;
}

export default function MediaSections({
  mode,
  sectionItems,
  sectionTotals,
  canSlide,
  canGoPrev,
  canGoNext,
  movePrev,
  moveNext,
  onMediaPrimaryAction,
  onOpenSection,
}: Props) {
  const isCurrent = mode === RENTED_MODES.CURRENTLY;
  const isPurchased = mode === RENTED_MODES.PURCHASED;

  return (
    <>
      {RENTED_MEDIA_SECTIONS.map((section) => (
        <SectionBlock key={section.title}>
          <SectionHeader>
            <SectionTitleRow>
              <SectionTitle>{section.title}</SectionTitle>
              {isPurchased &&
              (section.key === RENTED_SECTION_KEYS.VIDEOS ||
                section.key === RENTED_SECTION_KEYS.AUDIOS) ? (
                <InlineSectionArrow
                  type="button"
                  aria-label={`Open ${section.title} details`}
                  onClick={() =>
                    onOpenSection?.(section.key, sectionItems[section.key][0])
                  }
                >
                  <LeftIcon />
                </InlineSectionArrow>
              ) : null}
            </SectionTitleRow>
            <SectionPaginationArrows
              sectionKey={section.key}
              totalItems={sectionTotals[section.key]}
              canSlide={canSlide}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              movePrev={movePrev}
              moveNext={moveNext}
            />
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
                      onClick={
                        isPurchased && onMediaPrimaryAction
                          ? () => onMediaPrimaryAction(item)
                          : undefined
                      }
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
    </>
  );
}
