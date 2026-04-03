"use client";

import { TutorialVideo } from "@/utils/type";
import { resolveImageUrl } from "@/utils/Constants";
import Image from "next/image";

import { Card, CardShell, Content, Title, MetaItem, MetaDate } from "./styles";
import GenericButton from "@/components/UI/GenericButton";

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
            borderRadius: "0.75rem 0.75rem 0 0",
          }}
        />
        <Content>
          <Title>{tutorial.title}</Title>
          <MetaItem>{tutorial.creator}</MetaItem>
          <MetaDate>{tutorial.published}</MetaDate>
          <GenericButton>Free</GenericButton>
        </Content>
      </Card>
    </CardShell>
  );
}
