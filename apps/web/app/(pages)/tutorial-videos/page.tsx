"use client";
import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "../../styles";
import TutorialContent from "@/components/Feature/TutorialVideos/TutorialContent";
export default function HowItWorksPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <TutorialContent />
      </Main>
    </PageContainer>
  );
}
