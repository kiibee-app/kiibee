"use client";
import { resolveImageUrl } from "@/utils/Constants";
import Image from "next/image";
import { Card, CardShell, Content, ImageWrapper, VideoBox } from "./styles";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { TutorialVideo } from "@/utils/types";
import VideoIcon from "@/assets/images/icons/video";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

interface TutorialCardProps {
  tutorial: TutorialVideo;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const imageUrl = resolveImageUrl(tutorial.image);
  const { t } = useTranslation();

  return (
    <CardShell>
      <Card>
        <ImageWrapper>
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
            <VideoIcon />
            <MonoText $use="Body_Bold">{tutorial.formatLabel}</MonoText>
          </VideoBox>
          <GenericButton asAnchor href="/tutorial-videos" variant="secondary">
            {t("tutorialVideos.buttonFreeLabel")}
          </GenericButton>
        </Content>
      </Card>
    </CardShell>
  );
}
