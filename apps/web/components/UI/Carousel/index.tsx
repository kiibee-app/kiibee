"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CarouselContainer,
  SlideTrack,
  Slide,
  NavigationArrow,
  DotsContainer,
  Dot,
} from "./styles";
import { LeftArrow, RightArrow } from "@/assets/icons";
import {
  CAROUSEL_DEFAULT_AUTOPLAY,
  CAROUSEL_DEFAULT_AUTOPLAY_INTERVAL,
  CAROUSEL_DEFAULT_SHOW_ARROWS,
  CAROUSEL_DEFAULT_SHOW_DOTS,
  CAROUSEL_DEFAULT_TRANSITION_TYPE,
  CAROUSEL_DEFAULT_PREV_ARIA_LABEL,
  CAROUSEL_DEFAULT_NEXT_ARIA_LABEL,
  CarouselTransitionType,
} from "@/utils/Constants";
import { KEYBOARD_KEYS } from "@/utils/ui";

export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  transitionType?: CarouselTransitionType;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
}

export default function Carousel<T>({
  items,
  renderItem,
  autoPlay = CAROUSEL_DEFAULT_AUTOPLAY,
  autoPlayInterval = CAROUSEL_DEFAULT_AUTOPLAY_INTERVAL,
  showArrows = CAROUSEL_DEFAULT_SHOW_ARROWS,
  showDots = CAROUSEL_DEFAULT_SHOW_DOTS,
  className,
  transitionType = CAROUSEL_DEFAULT_TRANSITION_TYPE,
  prevAriaLabel = CAROUSEL_DEFAULT_PREV_ARIA_LABEL,
  nextAriaLabel = CAROUSEL_DEFAULT_NEXT_ARIA_LABEL,
}: CarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.ARROW_LEFT) {
        prevSlide();
      } else if (e.key === KEYBOARD_KEYS.ARROW_RIGHT) {
        nextSlide();
      }
    },
    [nextSlide, prevSlide],
  );

  useEffect(() => {
    if (!autoPlay || isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, autoPlayInterval, nextSlide, items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!items || items.length === 0) return null;

  return (
    <CarouselContainer
      className={className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
    >
      <SlideTrack $transitionType={transitionType} $activeIndex={activeIndex}>
        {items.map((item, index) => (
          <Slide
            key={index}
            $transitionType={transitionType}
            $active={index === activeIndex}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
            aria-hidden={index !== activeIndex}
          >
            {renderItem(item, index, index === activeIndex)}
          </Slide>
        ))}
      </SlideTrack>

      {showArrows && items.length > 1 && (
        <>
          <NavigationArrow
            $direction="left"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label={prevAriaLabel}
          >
            <LeftArrow />
          </NavigationArrow>
          <NavigationArrow
            $direction="right"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label={nextAriaLabel}
          >
            <RightArrow />
          </NavigationArrow>
        </>
      )}

      {showDots && items.length > 1 && (
        <DotsContainer>
          {items.map((_, index) => (
            <Dot
              key={index}
              $active={index === activeIndex}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? "true" : "false"}
            />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  );
}
