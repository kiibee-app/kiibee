"use client";
import TutorialCard from "../TutorialCard";
import { tutorialVideos } from "@/app/tutorial-videos/data/tutorialVideos";
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
