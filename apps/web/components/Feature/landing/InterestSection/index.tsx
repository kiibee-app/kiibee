"use client";

import React from "react";
import { Section, Title, PillsWrapper, Pill } from "./styles";

const interests: Array<{
  label: string;
  variant: "white" | "light" | "green" | "dark";
}> = [
  { label: "E-books", variant: "white" },
  { label: "Lectures", variant: "light" },
  { label: "Courses and tutorials", variant: "dark" },
  { label: "Podcasts", variant: "green" },
  { label: "Comedies", variant: "light" },
  { label: "Photography", variant: "green" },
  { label: "Audiobooks", variant: "light" },
  { label: "Music", variant: "white" },
  { label: "Illustrations and artwork", variant: "light" },
  { label: "Guided meditations", variant: "dark" },
  { label: "Fitness", variant: "dark" },
  { label: "Theater", variant: "green" },
  { label: "Sound effects and loops", variant: "light" },
  { label: "Articles & essays", variant: "white" },
];

export default function InterestSection() {
  return (
    <Section>
      <Title>Explore content made for every interest</Title>

      <PillsWrapper>
        {interests.map((item, index) => (
          <Pill key={index} variant={item.variant}>
            {item.label}
          </Pill>
        ))}
      </PillsWrapper>
    </Section>
  );
}
