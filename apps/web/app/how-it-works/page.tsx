"use client";

import React from "react";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "../styles";
import HowHero from "@/components/HowItWork/Hero";

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <div style={{ width: "100%" }}>
          <HowHero />
        </div>
      </Main>
    </PageContainer>
  );
}
