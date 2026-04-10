"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../../styles";
import CreatorsSection from "./index";
import ContentPerform from "./creators/ContentPerform";
import ShortStory from "./creators/ShortStory";

export default function CreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <CreatorsSection />
        <ContentPerform />
        <ShortStory />
      </Main>
      <Footer />
    </PageContainer>
  );
}
