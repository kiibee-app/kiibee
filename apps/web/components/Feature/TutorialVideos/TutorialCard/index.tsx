"use client";
import { resolveImageUrl } from "@/utils/Constants";
import Image from "next/image";
import {
  Card,
  CardShell,
  Content,
  Title,
  MetaItem,
  MetaDate,
  ImageWrapper,
  VideoBox,
  VideoLabel,
} from "./styles";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { TutorialVideo } from "@/utils/types";
import VideoIcon from "@/assets/images/icons/video";

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
          <Title>{tutorial.title}</Title>
          <MetaItem>{tutorial.creator}</MetaItem>
          <MetaDate>{tutorial.published}</MetaDate>
          <VideoBox>
            <VideoIcon />
            <VideoLabel>{tutorial.formatLabel}</VideoLabel>
          </VideoBox>
          <GenericButton asAnchor href="/tutorial-videos" variant="secondary">
            {t("tutorialVideos.buttonFreeLabel")}
          </GenericButton>
        </Content>
      </Card>
    </CardShell>
  );
}
