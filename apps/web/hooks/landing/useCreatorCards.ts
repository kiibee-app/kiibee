"use client";

import { useState, useCallback } from "react";

export interface UseCreatorCardsReturn {
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
  handleCardClick: (index: number) => void;
}

export const useCreatorCards = (isMobile: boolean): UseCreatorCardsReturn => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (!isMobile) {
        setActiveCardIndex(index);
      }
    },
    [isMobile],
  );

  const handleMouseLeave = useCallback(() => {
    setActiveCardIndex(0);
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
