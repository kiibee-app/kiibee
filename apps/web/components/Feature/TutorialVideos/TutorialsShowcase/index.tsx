"use client";

import { tutorialVideos } from "@/utils/data";
import { Grid } from "./styles";
import TutorialCard from "../TutorialCard";
import type { TutorialVideo } from "@/utils/types";

interface TutorialsShowcaseProps {
  videos?: TutorialVideo[];
  maxWidth?: string;
  selectedVideoId?: string | null;
  onSelectVideo?: (videoId: string) => void;
}

export default function TutorialsShowcase({
  videos = tutorialVideos,
  maxWidth,
  selectedVideoId = null,
  onSelectVideo,
}: TutorialsShowcaseProps) {
  return (
    <Grid $maxWidth={maxWidth}>
      {videos.map((tutorial) => (
        <TutorialCard
          key={tutorial.id}
          tutorial={tutorial}
          onPlayClick={onSelectVideo}
          isSelected={selectedVideoId === tutorial.id}
        />
      ))}
    </Grid>
  );
}
