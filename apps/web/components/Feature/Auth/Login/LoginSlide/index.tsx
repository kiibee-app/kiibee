"use client";

import Image from "next/image";
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
  const { slidesText, activeSlide, fallbackSlideLabel, stack, t } =
    useSlideData();

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
        {slidesText.map((slide, index) => (
          <Dot key={slide.title + index} $active={index === 0} />
        ))}
      </SlideDots>
    </SlideLayout>
  );
}
