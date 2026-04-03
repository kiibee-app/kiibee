"use client";
import NavBar from "@/components/Layout/Navbar";
import TutorialsShowcase from "./components/TutorialsShowcase";
import { PageContainer } from "../styles";
import {
  Content,
  HeroBlock,
  HeroTitle,
  HeroSubtitle,
  SectionHeader,
  SectionLabel,
  SectionTag,
  SectionLink,
} from "./styles";

export default function TutorialVideosPage() {
  return (
    <PageContainer>
      <NavBar />
      <Content>
        <HeroBlock>
          <HeroTitle>Tutorial videos</HeroTitle>
          <HeroSubtitle>
            Step-by-step guides to help you succeed with Kiibee and get the most
            out of every launch.
          </HeroSubtitle>
        </HeroBlock>
        <SectionHeader>
          <SectionLabel>
            <SectionTag>Getting started</SectionTag>
            <span>Foundational chapters</span>
          </SectionLabel>
          <SectionLink href="#">
            View playlist
            <span aria-hidden="true">→</span>
          </SectionLink>
        </SectionHeader>
        <TutorialsShowcase />
      </Content>
    </PageContainer>
  );
}
