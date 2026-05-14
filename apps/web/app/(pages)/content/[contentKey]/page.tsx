"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "../../../styles";
import { MonoText } from "@/components/UI/Monotext";
import SingleDiscoverContent from "@/components/Feature/SingleDiscoverContent";
import SingleTutorial from "@/components/Feature/SingleTutorial";
import { tutorialVideoSections, tutorialVideos } from "@/utils/data";
import type { TutorialVideo } from "@/utils/types";
import { resolvePublishedContentByKey } from "@/utils/resolvePublishedContentByKey";

function PublishedContentDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const raw = params?.contentKey;
  const contentKey = Array.isArray(raw) ? raw[0] : raw;
  const resolved = resolvePublishedContentByKey(contentKey);

  if (!resolved) {
    return (
      <Section>
        <MonoText $use="H5_Regular">{t("singleContent.notFound")}</MonoText>
      </Section>
    );
  }

  if (resolved.kind === "discover") {
    return (
      <Section>
        <SingleDiscoverContent item={resolved.item} />
      </Section>
    );
  }

  const tutorial = resolved.tutorial;
  const collection = tutorialVideoSections.find((section) =>
    section.videoIds.includes(tutorial.id),
  );
  const relatedVideos = (collection?.videoIds ?? [])
    .map((videoId) => tutorialVideos.find((video) => video.id === videoId))
    .filter((video): video is TutorialVideo => Boolean(video))
    .slice(0, 4);

  return (
    <Section>
      <SingleTutorial
        tutorial={tutorial}
        relatedVideos={relatedVideos}
        collectionId={collection?.id}
      />
    </Section>
  );
}

export default function PublishedContentPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <PublishedContentDetail />
      </Main>
      <Footer />
    </PageContainer>
  );
}
