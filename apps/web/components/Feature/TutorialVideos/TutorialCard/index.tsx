"use client";

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

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const imageUrl = resolveImageUrl(tutorial.image);
  const { t } = useTranslation();
  const formatType: FormatType = tutorial.formatType ?? "video";
  const FormatIcon = formatIconMap[formatType];
  const singleTutorialHref = `/single-tutorial?id=${tutorial.id}`;
  const defaultButton: TutorialButton = {
    label: t(TUTORIAL_VIDEOS.buttonFreeLabel),
    variant: VARIANT.SECONDARY,
    href: singleTutorialHref,
  };

  const buttons = tutorial.buttons?.length ? tutorial.buttons : [defaultButton];

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
