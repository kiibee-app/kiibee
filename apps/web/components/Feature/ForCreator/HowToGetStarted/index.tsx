"use client";

import { useState, useEffect, useRef } from "react";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import { steps } from "@/utils/steps";
import { intersectionObserverConfig } from "@/utils/intersectionObserverConfig";
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
    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (!visibleEntry) return;

      const index = sectionRefs.current.indexOf(
        visibleEntry.target as HTMLDivElement,
      );

      if (index !== -1) {
        setActiveIndex(index);
      }
    }, intersectionObserverConfig);

    const elements = sectionRefs.current.filter(Boolean);
    elements.forEach((el) => observer.observe(el!));

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
