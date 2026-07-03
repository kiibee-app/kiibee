"use client";

import { memo, useMemo, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { resolveImageUrl, VARIANT } from "@/utils/Constants";
import { ActionRow, CardLink, VideoBox } from "./styles";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { ComponentType } from "react";
import type { FormatType, TutorialVideo } from "@/utils/types";
import { FORMAT_TYPE } from "@/utils/types";
import { EpubIcon, VideoIcon, WebIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericCard from "@/components/UI/GenericCard";
import { pathPublishedContent } from "@/utils/path";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import { resolveTutorialThumbnailCandidates } from "@/utils/tutorialVideoMapper";

type TutorialCardProps = {
  tutorial: TutorialVideo;
  onPlayClick?: (videoId: string) => void;
  isSelected?: boolean;
};

type IconComponent = ComponentType<{
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}>;

const formatIconMap: Record<FormatType, IconComponent> = {
  video: VideoIcon,
  audio: AudioFileIcon,
  pdf: PdfFileIcon,
  epub: EpubIcon,
  web: WebIcon,
};

function TutorialCard({
  tutorial,
  onPlayClick,
  isSelected = false,
}: TutorialCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const thumbnailCandidates = useMemo(() => {
    if (tutorial.videoUrl) {
      return resolveTutorialThumbnailCandidates({
        videoUrl: tutorial.videoUrl,
        trailerUrl: tutorial.trailerUrl,
      });
    }

    const staticImage = resolveImageUrl(tutorial.image);
    return staticImage ? [staticImage] : [];
  }, [tutorial.image, tutorial.trailerUrl, tutorial.videoUrl]);

  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const image =
    thumbnailCandidates[thumbnailIndex] ??
    resolveImageUrl(tutorial.image) ??
    undefined;
  const imageFallback = thumbnailCandidates[thumbnailIndex + 1];

  const handleThumbnailError = () => {
    setThumbnailIndex((current) => {
      const nextIndex = current + 1;
      return nextIndex < thumbnailCandidates.length ? nextIndex : current;
    });
  };

  const FormatIcon = useMemo(() => {
    const formatType: FormatType = tutorial.formatType ?? FORMAT_TYPE.VIDEO;
    return formatIconMap[formatType];
  }, [tutorial.formatType]);

  const singleTutorialHref = useMemo(
    () => pathPublishedContent(tutorial.id),
    [tutorial.id],
  );

  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
  const isCardLinked = !onPlayClick;

  const stopCardNavigation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const openContent = () => {
    if (onPlayClick) {
      onPlayClick(tutorial.id);
      return;
    }
    router.push(singleTutorialHref);
  };

  const openCreatorProfile = (event: MouseEvent) => {
    if (!tutorial.creatorId) return;

    event.preventDefault();
    event.stopPropagation();
    window.open(
      getPublicCreatorProfilePath(tutorial.creatorId),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const creatorSubtitle = tutorial.creatorId ? (
    isCardLinked ? (
      <MonoText
        $use="Body_Medium"
        style={{ cursor: "pointer" }}
        onClick={openCreatorProfile}
      >
        {tutorial.creator}
      </MonoText>
    ) : (
      <a
        href={getPublicCreatorProfilePath(tutorial.creatorId)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <MonoText $use="Body_Medium" style={{ cursor: "pointer" }}>
          {tutorial.creator}
        </MonoText>
      </a>
    )
  ) : (
    <MonoText $use="Body_Medium">{tutorial.creator}</MonoText>
  );

  const card = (
    <GenericCard
      coverImage
      image={image}
      imageFallback={imageFallback}
      onImageError={handleThumbnailError}
      alt={tutorial.title}
      badge={
        tutorial.category ? (
          <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
            {tutorial.category}
          </MonoText>
        ) : undefined
      }
      title={<MonoText $use="Body_Medium">{tutorial.title}</MonoText>}
      subtitle={creatorSubtitle}
      footer={
        <ActionRow onClick={stopCardNavigation}>
          <GenericButton
            type="button"
            variant={VARIANT.SECONDARY}
            fullWidth
            aria-pressed={isSelected}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              openContent();
            }}
          >
            {freeLabel}
          </GenericButton>
        </ActionRow>
      }
    >
      {tutorial.published ? (
        <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
          {tutorial.published}
        </MonoText>
      ) : null}

      <VideoBox>
        <FormatIcon width={22} height={22} color={COLORS.neutral.BLACK} />
        <MonoText $use="Body_Bold">{tutorial.formatLabel}</MonoText>
      </VideoBox>
    </GenericCard>
  );

  if (isCardLinked) {
    return (
      <CardLink
        href={singleTutorialHref}
        $clickable
        aria-label={tutorial.title}
      >
        {card}
      </CardLink>
    );
  }

  return card;
}

export default memo(TutorialCard);
