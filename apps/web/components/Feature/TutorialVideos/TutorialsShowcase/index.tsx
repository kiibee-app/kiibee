"use client";

import { Grid } from "./styles";
import TutorialCard from "../TutorialCard";
import type { TutorialVideo } from "@/utils/types";

interface TutorialsShowcaseProps {
  videos?: TutorialVideo[];
  maxWidth?: string;
  selectedVideoId?: string | null;
  onSelectVideo?: (videoId: string) => void;
  collectionId?: string | null;
}

export default function TutorialsShowcase({
  videos = [],
  maxWidth,
  selectedVideoId = null,
  onSelectVideo,
  collectionId = null,
}: TutorialsShowcaseProps) {
  return (
    <Grid $maxWidth={maxWidth}>
      {videos.map((tutorial) => (
        <TutorialCard
          key={tutorial.id}
          tutorial={tutorial}
          onPlayClick={onSelectVideo}
          isSelected={selectedVideoId === tutorial.id}
          collectionId={collectionId}
        />
      ))}
    </Grid>
  );
}
