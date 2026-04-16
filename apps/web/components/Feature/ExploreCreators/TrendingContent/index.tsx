"use client";

import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import LeftIcon from "@/assets/images/icons/left";
import { MonoText } from "@/components/UI/Monotext";
import { trendingContentVideos } from "@/utils/data";
import { Section, SectionTag } from "../RecentlyAdded/styles";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "../../TutorialVideos/TutorialContent/styles";
import { Grid } from "../../TutorialVideos/TutorialsShowcase/styles";

export default function TrendingContent() {
  return (
    <Section>
      <SectionHeader>
        <SectionLabel>
          <SectionTag>
            <MonoText $use="H4_Medium">Trending content</MonoText>
          </SectionTag>
        </SectionLabel>
        <SectionLink href="/tutorial-videos">
          <LeftIcon />
        </SectionLink>
      </SectionHeader>
      <Grid>
        {trendingContentVideos.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </Grid>
    </Section>
  );
}
