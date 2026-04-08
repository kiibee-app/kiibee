"use client";

import { tutorialVideos } from "@/utils/data";
import { Grid } from "./styles";
import TutorialCard from "../TutorialCard";
import type { TutorialVideo } from "@/utils/types";

interface TutorialsShowcaseProps {
  videos?: TutorialVideo[];
  maxWidth?: string;
}

export default function TutorialsShowcase({
  videos = tutorialVideos,
  maxWidth,
}: TutorialsShowcaseProps) {
  return (
    <Grid $maxWidth={maxWidth}>
      {videos.map((tutorial) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} />
      ))}
    </Grid>
  );
}
