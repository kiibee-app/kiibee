"use client";

import { TutorialVideo } from "@/utils/type";
import { resolveImageUrl } from "@/utils/Constants";
import Image from "next/image";

import {
  Card,
  CardShell,
  Content,
  Title,
  MetaRow,
  MetaItem,
  Description,
  Footer,
  FormatBadge,
  FormatIcon,
  AccessPill,
} from "./styles";

interface TutorialCardProps {
  tutorial: TutorialVideo;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const imageUrl = resolveImageUrl(tutorial.image);

  return (
    <CardShell>
      <Card>
        <Image
          src={imageUrl}
          alt={tutorial.title}
          width={250}
          height={190}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "0",
          }}
        />
        <Content>
          <Title>{tutorial.title}</Title>
          <MetaItem>{tutorial.creator}</MetaItem>
          <MetaItem $isMuted>{tutorial.published}</MetaItem>
          <Description>{tutorial.focus}</Description>
          <Footer>
            <FormatBadge>
              <FormatIcon aria-hidden="true">▶</FormatIcon>
              <span>{tutorial.formatLabel}</span>
            </FormatBadge>
            <AccessPill type="button">{tutorial.level}</AccessPill>
          </Footer>
        </Content>
      </Card>
    </CardShell>
  );
}
