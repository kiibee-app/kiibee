"use client";

import { useState, useCallback } from "react";
import { DEFAULT_ACTIVE_CREATOR_CARD_INDEX } from "@/utils/creatorCardData";

export interface UseCreatorCardsReturn {
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
  handleCardClick: (index: number) => void;
}

export const useCreatorCards = (isMobile: boolean): UseCreatorCardsReturn => {
  const [activeCardIndex, setActiveCardIndex] = useState(
    DEFAULT_ACTIVE_CREATOR_CARD_INDEX,
  );

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (!isMobile) {
        setActiveCardIndex(index);
      }
    },
    [isMobile],
  );

  const handleMouseLeave = useCallback(() => {
    setActiveCardIndex(DEFAULT_ACTIVE_CREATOR_CARD_INDEX);
  }, []);

  const handleCardClick = useCallback((index: number) => {
    setActiveCardIndex(index);
  }, []);

  return {
    activeCardIndex,
    setActiveCardIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleCardClick,
  };
};
