"use client";

import { Grid } from "./styles";
import TutorialCard from "../TutorialCard";
import type { TutorialVideo } from "@/utils/types";

interface TutorialsShowcaseProps {
  videos?: TutorialVideo[];
  maxWidth?: string;
  selectedVideoId?: string | null;
  onSelectVideo?: (videoId: string) => void;
  creatorSlug?: string | null;
  collectionId?: string | null;
  collectionSlug?: string | null;
  isPaidCollection?: boolean;
}

export default function TutorialsShowcase({
  videos = [],
  maxWidth,
  selectedVideoId = null,
  onSelectVideo,
  creatorSlug = null,
  collectionId = null,
  collectionSlug = null,
  isPaidCollection = false,
}: TutorialsShowcaseProps) {
  return (
    <Grid $maxWidth={maxWidth}>
      {videos.map((tutorial) => (
        <TutorialCard
          key={tutorial.id}
          tutorial={tutorial}
          onPlayClick={onSelectVideo}
          isSelected={selectedVideoId === tutorial.id}
          creatorSlug={creatorSlug}
          collectionId={collectionId}
          collectionSlug={collectionSlug}
          isPaidCollection={isPaidCollection}
        />
      ))}
    </Grid>
  );
}
