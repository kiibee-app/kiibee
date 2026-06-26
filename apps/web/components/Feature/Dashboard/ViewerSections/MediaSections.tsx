"use client";

import { MonoText } from "@/components/UI/Monotext";
import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import { VideoIcon, WebIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import LeftIcon from "@/assets/icons/LeftIcon";
import { useTranslation } from "react-i18next";
import {
  getRentedMediaSections,
  RENTED_SECTION_KEYS,
  RENTED_MODES,
  type RentedSectionKey,
  type RentedMode,
  type RentedMediaItem,
  type RentedMediaSectionItems,
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
  sectionItems: RentedMediaSectionItems;
  sectionTotals: Record<Exclude<RentedSectionKey, "collections">, number>;
  canSlide: (section: RentedSectionKey, totalItems: number) => boolean;
  canGoPrev: (section: RentedSectionKey) => boolean;
  canGoNext: (section: RentedSectionKey, totalItems: number) => boolean;
  movePrev: (section: RentedSectionKey, totalItems: number) => void;
  moveNext: (section: RentedSectionKey, totalItems: number) => void;
  onMediaPrimaryAction?: (item: RentedMediaItem) => void;
  onCardClick?: (item: RentedMediaItem) => void;
  onOpenSection?: (
    section: Exclude<RentedSectionKey, "collections">,
    item: RentedMediaItem | undefined,
  ) => void;
};

function MediaTypeIcon({ type }: { type: RentedSectionKey }) {
  if (type === RENTED_SECTION_KEYS.AUDIOS) {
    return (
      <AudioFileIcon width={22} height={22} color={COLORS.neutral.BLACK} />
    );
  }
  if (type === RENTED_SECTION_KEYS.PDFS) {
    return <PdfFileIcon width={22} height={22} color={COLORS.neutral.BLACK} />;
  }
  if (type === RENTED_SECTION_KEYS.WEBS) {
    return <WebIcon width={22} height={22} color={COLORS.neutral.BLACK} />;
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
  onCardClick,
  onOpenSection,
}: Props) {
  const { t } = useTranslation();
  const isCurrent = mode === RENTED_MODES.CURRENTLY;
  const canOpenMediaDetail = Boolean(onMediaPrimaryAction);
  const shouldShowAccessCta =
    mode === RENTED_MODES.CURRENTLY || mode === RENTED_MODES.PURCHASED;

  return (
    <>
      {getRentedMediaSections(t).map((section) => {
        if (
          !sectionItems[section.key] ||
          sectionItems[section.key].length === 0
        )
          return null;
        return (
          <SectionBlock key={section.title}>
            <SectionHeader>
              <SectionTitleRow>
                <SectionTitle>{section.title}</SectionTitle>
                {canOpenMediaDetail &&
                (section.key === RENTED_SECTION_KEYS.VIDEOS ||
                  section.key === RENTED_SECTION_KEYS.AUDIOS ||
                  section.key === RENTED_SECTION_KEYS.PDFS ||
                  section.key === RENTED_SECTION_KEYS.WEBS) ? (
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
                  subtitle={
                    <MonoText $use="Body_Medium">{item.author}</MonoText>
                  }
                  badge={<MonoText $use="Body_Bold">{item.category}</MonoText>}
                  onClick={onCardClick ? () => onCardClick(item) : undefined}
                  footer={
                    shouldShowAccessCta ? (
                      <GenericButton
                        variant={VARIANT.SECONDARY}
                        size="md"
                        fullWidth
                        onClick={
                          onMediaPrimaryAction
                            ? () => onMediaPrimaryAction(item)
                            : undefined
                        }
                      >
                        {getMediaAction(section.key, t)}
                      </GenericButton>
                    ) : (
                      <TwoButtonRow>
                        <GenericButton
                          variant={VARIANT.SECONDARY}
                          size="md"
                          fullWidth
                        >
                          {t("pricingLabels.buy")}
                        </GenericButton>
                        <GenericButton
                          variant={VARIANT.SECONDARY}
                          size="md"
                          fullWidth
                        >
                          {t("pricingLabels.rent")}
                        </GenericButton>
                      </TwoButtonRow>
                    )
                  }
                >
                  <MonoText
                    $use="Body_Medium"
                    color={
                      isCurrent ? COLORS.primary.RED : COLORS.neutral.GRAY_400
                    }
                  >
                    {item.expiryText}
                  </MonoText>
                  <MediaTypePill>
                    <MediaTypeIcon type={section.key} />
                    <MonoText $use="Body_Bold">
                      {getMediaLabel(section.key, t)}
                    </MonoText>
                  </MediaTypePill>
                </GenericCard>
              ))}
            </MediaGrid>
          </SectionBlock>
        );
      })}
    </>
  );
}
