"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../../styles";
import CreatorsSection from "./index";
import ShortStory from "./creators/ShortStory";
import WhyCreatorsChoose from "./creators/WhyCreatorsChoose";

export default function CreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <CreatorsSection />
        <ShortStory />
        <WhyCreatorsChoose />
      </Main>
      <Footer />
    </PageContainer>
  );
}
