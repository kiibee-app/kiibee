"use client";
import type { TutorialVideo } from "@/app/tutorial-videos/data/tutorialVideos";
import {
  Card,
  Media,
  Tag,
  Content,
  Title,
  MetaRow,
  MetaItem,
  Description,
  Footer,
  FormatBadge,
  AccessPill,
} from "./styles";

interface TutorialCardProps {
  tutorial: TutorialVideo;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  return (
    <Card>
      <Media
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.65)), url(${tutorial.image})`,
        }}
      >
        <Tag>{tutorial.category}</Tag>
      </Media>
      <Content>
        <Title>{tutorial.title}</Title>
        <MetaRow>
          <MetaItem>{tutorial.creator}</MetaItem>
          <MetaItem $isMuted>{tutorial.published}</MetaItem>
        </MetaRow>
        <Description>{tutorial.focus}</Description>
        <Footer>
          <FormatBadge>
            <span>{tutorial.formatLabel}</span>
          </FormatBadge>
          <AccessPill>{tutorial.level}</AccessPill>
        </Footer>
      </Content>
    </Card>
  );
}
