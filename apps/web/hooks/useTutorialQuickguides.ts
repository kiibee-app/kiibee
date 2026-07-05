"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import { useTutorialVideos } from "@/hooks/useTutorialVideos";
import {
  findQuickguidesSection,
  getQuickguideItems,
  type TutorialQuickguideApiItem,
} from "@/utils/tutorialVideoMapper";

export type { TutorialQuickguideApiItem };

export function useTutorialQuickguides() {
  const { t } = useTranslation();
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
  const { sections, isLoading, isError } = useTutorialVideos();

  const guides = useMemo(() => {
    const quickguidesSection = findQuickguidesSection(sections);
    if (!quickguidesSection) return [];

    return getQuickguideItems(quickguidesSection).map((guide) => ({
      ...guide,
      freeLabel,
    }));
  }, [sections, freeLabel]);

  return {
    guides,
    isLoading,
    isError,
  };
}
