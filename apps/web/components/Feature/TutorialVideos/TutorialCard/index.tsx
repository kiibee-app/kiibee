"use client";

import { resolveImageUrl, VARIANT } from "@/utils/Constants";
import Image from "next/image";
import {
  ActionRow,
  Card,
  CardShell,
  Content,
  ImageWrapper,
  VideoBox,
} from "./styles";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { ComponentType } from "react";
import type { FormatType, TutorialButton, TutorialVideo } from "@/utils/types";
import { EpubIcon, PdfIcon, VideoIcon, WebIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { Badge } from "../../ExploreCreators/Creators/styles";

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
  const buttons =
    tutorial.buttons && tutorial.buttons.length
      ? tutorial.buttons
      : [defaultButton];

  const resolveButtonHref = (href?: string) => {
    if (!href) return singleTutorialHref;
    if (href.startsWith("/tutorial-videos")) return singleTutorialHref;
    return href;
  };

  return (
    <CardShell>
      <Card>
        <ImageWrapper>
          <Badge>
            <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
              {tutorial.category}
            </MonoText>
          </Badge>

          <Image
            src={imageUrl}
            alt={tutorial.title}
            fill
            style={{
              objectFit: "cover",
            }}
            priority
          />
        </ImageWrapper>
        <Content>
          <MonoText $use="H5_Medium">{tutorial.title}</MonoText>
          <MonoText $use="Body_Medium">{tutorial.creator}</MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
            {tutorial.published}
          </MonoText>
          <VideoBox>
            <FormatIcon width={22} height={22} color={COLORS.primary.BLACK} />
            <MonoText $use="Body_Bold">{tutorial.formatLabel}</MonoText>
          </VideoBox>
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
        </Content>
      </Card>
    </CardShell>
  );
}
