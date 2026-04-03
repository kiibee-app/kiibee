"use client";

import { tutorialVideos } from "@/utils/data";
import TutorialCard from "../TutorialCard";
import { Grid } from "./styles";

export default function TutorialsShowcase() {
  return (
    <Grid>
      {tutorialVideos.map((tutorial) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} />
      ))}
    </Grid>
  );
}
