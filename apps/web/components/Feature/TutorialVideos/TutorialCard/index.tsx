"use client";

import { memo, useMemo } from "react";
import { resolveImageUrl, VARIANT } from "@/utils/Constants";
import { ActionRow, VideoBox } from "./styles";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { ComponentType } from "react";
import type { FormatType, TutorialButton, TutorialVideo } from "@/utils/types";
import { EpubIcon, PdfIcon, VideoIcon, WebIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericCard from "@/components/UI/GenericCard";

interface TutorialCardProps {
  tutorial: TutorialVideo;
}

type IconComponent = ComponentType<{
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}>;

const formatIconMap: Record<FormatType, IconComponent> = {
  video: VideoIcon,
  pdf: PdfIcon,
  epub: EpubIcon,
  web: WebIcon,
};

function TutorialCard({ tutorial }: TutorialCardProps) {
  const { t } = useTranslation();

  const imageUrl = useMemo(
    () => resolveImageUrl(tutorial.image),
    [tutorial.image],
  );

  const FormatIcon = useMemo(() => {
    const formatType: FormatType = tutorial.formatType ?? "video";
    return formatIconMap[formatType];
  }, [tutorial.formatType]);

  const singleTutorialHref = useMemo(
    () => `/single-tutorial?id=${tutorial.id}`,
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
          {buttons.map((button, index) => (
            <GenericButton
              key={`${button.label}-${index}`}
              asAnchor
              href={resolveButtonHref(button.href)}
              variant={button.variant ?? VARIANT.SECONDARY}
            >
              {button.label}
            </GenericButton>
          ))}
        </ActionRow>
      }
    >
      <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
        {tutorial.published}
      </MonoText>

      <VideoBox>
        <FormatIcon width={22} height={22} />
        <MonoText $use="Body_Bold">{tutorial.formatLabel}</MonoText>
      </VideoBox>
    </GenericCard>
  );
}

export default memo(TutorialCard);
