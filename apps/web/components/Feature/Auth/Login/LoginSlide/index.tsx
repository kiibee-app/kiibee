"use client";

import { useEffect, useState } from "react";
import Image from "@/components/UI/SafeImage";
import {
  Dot,
  ImageStack,
  SlideContent,
  SlideDots,
  SlideImage,
  SlideLayout,
  SlideTitle,
} from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { useSlideData } from "@/utils/useSlideData";

export default function LoginSlide() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { activeSlide, fallbackSlideLabel, stack, t, slideCount } =
    useSlideData(activeIndex);

  useEffect(() => {
    if (slideCount <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [slideCount]);

  return (
    <SlideLayout>
      <ImageStack>
        {stack.map((image, index) => (
          <SlideImage
            key={image.id}
            $height={image.height}
            $translateX={image.translateX}
            $translateY={image.translateY}
            $scale={image.scale}
            $z={image.z}
            $isActive={index === 0}
          >
            <Image
              src={image.src}
              alt={t("authSlide.imageAlt", {
                title: activeSlide.title || fallbackSlideLabel,
              })}
              fill
              sizes="(max-width: 768px) 260px, 320px"
              style={{ objectFit: "cover" }}
              priority
            />
          </SlideImage>
        ))}
      </ImageStack>
      <SlideContent>
        <SlideTitle>
          <MonoText $use="H4_Medium">{activeSlide.title}</MonoText>
        </SlideTitle>
        <SlideTitle>
          <MonoText $use="Body_Medium">{activeSlide.description}</MonoText>
        </SlideTitle>
      </SlideContent>
      <SlideDots>
        {Array.from({ length: slideCount }).map((_, index) => (
          <Dot key={index} $active={index === activeIndex} />
        ))}
      </SlideDots>
    </SlideLayout>
  );
}
