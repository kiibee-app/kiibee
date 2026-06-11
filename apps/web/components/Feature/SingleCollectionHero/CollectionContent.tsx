"use client";

import { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import TutorialsShowcase from "@/components/Feature/TutorialVideos/TutorialsShowcase";
import {
  EmbeddedHeader,
  EmbeddedSection,
  EmbeddedShowcaseWrapper,
  Header,
  ResultsState,
  Section,
  ShowcaseWrapper,
  TitleGroup,
} from "./styles";
import type { TutorialVideo } from "@/utils/types";
import SearchBar from "@/components/UI/SearchBar";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";

type Props = {
  videos: TutorialVideo[] | undefined;
  maxWidth?: string;
  embedded?: boolean;
  selectedVideoId?: string | null;
  onSelectVideo?: (videoId: string) => void;
};

export default function CollectionContent({
  videos,
  maxWidth,
  embedded = false,
  selectedVideoId = null,
  onSelectVideo,
}: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  if (!videos) return null;

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()),
  );

  const SectionEl = embedded ? EmbeddedSection : Section;
  const HeaderEl = embedded ? EmbeddedHeader : Header;
  const ShowcaseEl = embedded ? EmbeddedShowcaseWrapper : ShowcaseWrapper;

  return (
    <SectionEl>
      <HeaderEl>
        <TitleGroup>
          <MonoText $use="Body_Medium">
            {t("singleCollection.inCollection")}
          </MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {filteredVideos.length} {t("singleCollection.uploads")}
          </MonoText>
        </TitleGroup>

        <SearchBar
          placeholder={t("creators.search")}
          value={search}
          onChange={setSearch}
          width="min(216px, 100%)"
        />
      </HeaderEl>
      <ShowcaseEl>
        {filteredVideos.length > 0 ? (
          <TutorialsShowcase
            videos={filteredVideos}
            maxWidth={maxWidth}
            selectedVideoId={selectedVideoId}
            onSelectVideo={onSelectVideo}
          />
        ) : (
          <ResultsState>
            <MonoText $use="Body_Medium">
              {t("singleCollection.noResults")}
            </MonoText>
          </ResultsState>
        )}
      </ShowcaseEl>
    </SectionEl>
  );
}
