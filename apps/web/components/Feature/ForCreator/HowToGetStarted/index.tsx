"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { steps } from "./data";
import {
  Section,
  Container,
  ImageContainer,
  StickyImageWrapper,
  ImageWrapper,
  ContentContainer,
  Title,
  StepsContainer,
  StepWrapper,
  MobileStepImage,
  StepTitle,
  StepDescription,
  StepList,
  ListItem,
  Bullet,
  Spacer,
} from "./styles";

export default function HowToGetStarted() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el;
  };

  return (
    <Section>
      <Container>
        <ImageContainer>
          <StickyImageWrapper>
            {steps.map((step, index) => (
              <ImageWrapper key={step.id} $active={activeIndex === index}>
                <Image
                  src={step.image}
                  alt={t(step.titleKey)}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  priority={index === 0}
                />
              </ImageWrapper>
            ))}
          </StickyImageWrapper>
        </ImageContainer>

        <ContentContainer>
          <Title>{t("creators.howToGetStarted.title")}</Title>

          <StepsContainer>
            {steps.map((step, index) => {
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
                      style={{ objectFit: "cover", objectPosition: "center" }}
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
