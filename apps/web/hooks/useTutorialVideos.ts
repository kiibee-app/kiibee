"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { API, useGetAPI } from "@/lib/http/api";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { TutorialCollection } from "@/utils/tutorialCollections";
import {
  findTutorialCollectionById,
  findTutorialCollectionByVideoId,
  findTutorialVideoInSections,
  tutorialSectionsToCollections,
  type TutorialVideosApiResponse,
} from "@/utils/tutorialVideoMapper";
import type { TutorialVideo } from "@/utils/types";

export function useTutorialVideos() {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

  const { data, isLoading, isError } = useGetAPI<TutorialVideosApiResponse>(
    API.tutorialVideos.list,
  );

  const sections = useMemo(() => data?.data ?? [], [data?.data]);

  const collections = useMemo(
    (): TutorialCollection[] =>
      tutorialSectionsToCollections(sections, freeLabel),
    [sections, freeLabel],
  );

  return {
    sections,
    collections,
    isLoading,
    isError,
  };
}

export function useTutorialVideoLookup(videoId?: string | null) {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
  const { sections, isLoading, isError } = useTutorialVideos();

  const tutorial = useMemo(
    (): TutorialVideo | undefined =>
      findTutorialVideoInSections(sections, videoId, freeLabel),
    [sections, videoId, freeLabel],
  );

  const collection = useMemo(
    () => findTutorialCollectionByVideoId(sections, videoId, freeLabel),
    [sections, videoId, freeLabel],
  );

  return {
    tutorial,
    collection,
    relatedVideos: (collection?.tutorials ?? []).filter(
      (video) => video.id !== videoId,
    ),
    isLoading,
    isError,
  };
}

export function useTutorialCollectionLookup(collectionId?: string | null) {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
  const { sections, isLoading, isError } = useTutorialVideos();

  const collection = useMemo(
    () => findTutorialCollectionById(sections, collectionId ?? null, freeLabel),
    [sections, collectionId, freeLabel],
  );

  return {
    collection,
    isLoading,
    isError,
  };
}
