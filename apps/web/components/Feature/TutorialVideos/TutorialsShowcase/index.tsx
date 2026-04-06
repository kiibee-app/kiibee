"use client";

import { tutorialVideos } from "@/utils/data";
import { Grid } from "./styles";
import TutorialCard from "../TutorialCard";

export default function TutorialsShowcase() {
  return (
    <Grid>
      {tutorialVideos.map((tutorial) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} />
      ))}
    </Grid>
  );
}
