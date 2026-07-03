"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { API, useGetAPI } from "@/lib/http/api";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";

export type TutorialQuickguideApiItem = {
  id: string;
  title: string;
  pdfUrl: string;
  thumbnailUrl?: string | null;
  sortOrder: number;
};

type TutorialQuickguidesApiResponse = {
  success?: boolean;
  data?: TutorialQuickguideApiItem[] | null;
};

export function useTutorialQuickguides() {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);

  const { data, isLoading, isError } =
    useGetAPI<TutorialQuickguidesApiResponse>(API.tutorialVideos.quickguides);

  const guides = useMemo(() => data?.data ?? [], [data?.data]);

  return {
    guides: guides.map((guide) => ({
      ...guide,
      freeLabel,
    })),
    isLoading,
    isError,
  };
}
