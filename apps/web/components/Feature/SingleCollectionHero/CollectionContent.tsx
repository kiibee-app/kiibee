"use client";

import { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import TutorialsShowcase from "@/components/Feature/TutorialVideos/TutorialsShowcase";
import { Header, Section, ShowcaseWrapper, TitleGroup } from "./styles";
import type { TutorialVideo } from "@/utils/types";
import SearchBar from "@/components/UI/SearchBar";
import COLORS from "@kiibee/ui/colors";
import { useTranslation } from "react-i18next";

type Props = {
  videos: TutorialVideo[] | undefined;
  maxWidth?: string;
};

export default function CollectionContent({ videos, maxWidth }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  if (!videos) return null;

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Section>
      <Header>
        <TitleGroup>
          <MonoText $use="Body_Medium">In this collection</MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {filteredVideos.length} uploads
          </MonoText>
        </TitleGroup>

        <SearchBar
          placeholder={t("creators.search")}
          value={search}
          onChange={setSearch}
          width="216px"
        />
      </Header>
      <ShowcaseWrapper>
        <TutorialsShowcase videos={filteredVideos} maxWidth={maxWidth} />
      </ShowcaseWrapper>
    </Section>
  );
}
