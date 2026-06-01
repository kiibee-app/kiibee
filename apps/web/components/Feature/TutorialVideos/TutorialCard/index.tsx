"use client";

import { memo, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { resolveImageUrl, VARIANT } from "@/utils/Constants";
import { ActionRow, VideoBox } from "./styles";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { ComponentType } from "react";
import type { FormatType, TutorialButton, TutorialVideo } from "@/utils/types";
import { FORMAT_TYPE } from "@/utils/types";
import { EpubIcon, VideoIcon, WebIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericCard from "@/components/UI/GenericCard";
import { pathPublishedContent, PATHS } from "@/utils/path";

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
  const pathname = usePathname();
  const hasSession = authStorage.hasSession();

  const handleButtonClick = (
    e: React.MouseEvent<HTMLElement>,
    href: string,
  ) => {
    if (!hasSession) {
      e.preventDefault();
      const isCreatorProfile = pathname.startsWith("/creator/");
      const nextUrl = isCreatorProfile
        ? window.location.pathname + window.location.search
        : href;
      router.push(`${PATHS.AUTH_LOGIN}?next=${encodeURIComponent(nextUrl)}`);
    }
  };

  const imageUrl = useMemo(
    () => resolveImageUrl(tutorial.image),
    [tutorial.image],
  );

  const FormatIcon = useMemo(() => {
    const formatType: FormatType = tutorial.formatType ?? FORMAT_TYPE.VIDEO;
    return formatIconMap[formatType];
  }, [tutorial.formatType]);

  const singleTutorialHref = useMemo(
    () => pathPublishedContent(tutorial.id),
    [tutorial.id],
  );

  const buttons = useMemo(() => {
    const defaultButton: TutorialButton = {
      label: t(TUTORIAL_VIDEOS.buttonFreeLabel),
      variant: VARIANT.SECONDARY,
      href: singleTutorialHref,
    };
    return tutorial.buttons?.length ? tutorial.buttons : [defaultButton];
  }, [tutorial.buttons, t, singleTutorialHref]);

  const resolveButtonHref = (href?: string) => {
    if (!href) return singleTutorialHref;
    if (href.startsWith("/tutorial-videos")) return singleTutorialHref;
    return href;
  };

  return (
    <GenericCard
      coverImage
      image={imageUrl}
      badge={
        <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
          {tutorial.category}
        </MonoText>
      }
      title={<MonoText $use="H5_Medium">{tutorial.title}</MonoText>}
      subtitle={<MonoText $use="Body_Medium">{tutorial.creator}</MonoText>}
      footer={
        <ActionRow>
          {buttons.map((button, index) => {
            const buttonHref = resolveButtonHref(button.href);
            return onPlayClick ? (
              <GenericButton
                key={`${button.label}-${index}`}
                type="button"
                variant={button.variant ?? VARIANT.SECONDARY}
                fullWidth={button.fullWidth}
                size={button.size}
                minWidth={button.minWidth}
                aria-pressed={isSelected}
                onClick={() => onPlayClick(tutorial.id)}
              >
                {button.label}
              </GenericButton>
            ) : button.href ? (
              <GenericButton
                key={`${button.label}-${index}`}
                asAnchor
                href={buttonHref}
                onClick={(e) => handleButtonClick(e, buttonHref)}
                variant={button.variant ?? VARIANT.SECONDARY}
                fullWidth={button.fullWidth}
                size={button.size}
                minWidth={button.minWidth}
              >
                {button.label}
              </GenericButton>
            ) : (
              <GenericButton
                key={`${button.label}-${index}`}
                type="button"
                variant={button.variant ?? VARIANT.SECONDARY}
                fullWidth={button.fullWidth}
                size={button.size}
                minWidth={button.minWidth}
              >
                {button.label}
              </GenericButton>
            );
          })}
        </ActionRow>
      }
    >
      <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
        {tutorial.published}
      </MonoText>

      <VideoBox>
        <FormatIcon width={22} height={22} color={COLORS.neutral.BLACK} />
        <MonoText $use="Body_Bold">{tutorial.formatLabel}</MonoText>
      </VideoBox>
    </GenericCard>
  );
}

export default memo(TutorialCard);
