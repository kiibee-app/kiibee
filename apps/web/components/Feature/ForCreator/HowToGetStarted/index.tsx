"use client";

import { useState, useEffect, useRef } from "react";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import { creatorOnboardingSteps } from "@/utils/steps";
import { EVENT_SCROLL, EVENT_RESIZE } from "@/utils/Constants";
import {
  Section,
  HeaderWrapper,
  Container,
  ImageContainer,
  StickyImageWrapper,
  ImageWrapper,
  ContentContainer,
  Title,
  Subtitle,
  StepsContainer,
  StepWrapper,
  MobileStepImage,
  StepTitle,
  StepDescription,
  StepList,
  ListItem,
  Bullet,
  Spacer,
  stepImageStyle,
  STEP_IMAGE_SIZES,
} from "./styles";

export default function HowToGetStarted() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const updateActive = () => {
      const stickyBox = stickyRef.current?.getBoundingClientRect();
      const imageMid = stickyBox
        ? stickyBox.top + stickyBox.height / 2
        : window.innerHeight / 2;

      let next = 0;
      let closest = Number.POSITIVE_INFINITY;

      sectionRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const stepMid = rect.top + rect.height / 2;
        const distance = Math.abs(stepMid - imageMid);
        if (distance < closest) {
          closest = distance;
          next = index;
        }
      });

      setActiveIndex((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener(EVENT_SCROLL, onScroll, { passive: true });
    window.addEventListener(EVENT_RESIZE, onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(EVENT_SCROLL, onScroll);
      window.removeEventListener(EVENT_RESIZE, onScroll);
    };
  }, []);

  const setRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  return (
    <Section>
      <HeaderWrapper>
        <Title>{t(CREATORS.howToGetStarted.title)}</Title>
        <Subtitle>{t(CREATORS.howToGetStarted.subtitle)}</Subtitle>
      </HeaderWrapper>

      <Container>
        <ImageContainer>
          <StickyImageWrapper ref={stickyRef}>
            {creatorOnboardingSteps.map((step, index) => (
              <ImageWrapper key={step.id} $active={activeIndex === index}>
                <Image
                  src={step.image}
                  alt={t(step.titleKey)}
                  fill
                  sizes={STEP_IMAGE_SIZES.desktop}
                  style={stepImageStyle}
                  priority={index === 0}
                />
              </ImageWrapper>
            ))}
          </StickyImageWrapper>
        </ImageContainer>

        <ContentContainer>
          <StepsContainer>
            {creatorOnboardingSteps.map((step, index) => {
              const listItems = step.listKey
                ? (t(step.listKey, { returnObjects: true }) as string[])
                : null;

              return (
                <StepWrapper key={step.id} ref={setRef(index)}>
                  <MobileStepImage>
                    <Image
                      src={step.image}
                      alt={t(step.titleKey)}
                      fill
                      sizes={STEP_IMAGE_SIZES.mobile}
                      style={stepImageStyle}
                    />
                  </MobileStepImage>

                  <StepTitle>{t(step.titleKey)}</StepTitle>

                  <StepDescription>{t(step.descriptionKey)}</StepDescription>

                  {listItems && Array.isArray(listItems) && (
                    <StepList>
                      {listItems.map((item, i) => (
                        <ListItem key={i}>
                          <Bullet />
                          <span>{item}</span>
                        </ListItem>
                      ))}
                    </StepList>
                  )}
                </StepWrapper>
              );
            })}
          </StepsContainer>

          <Spacer />
        </ContentContainer>
      </Container>
    </Section>
  );
}
