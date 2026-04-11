"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../../styles";
import CreatorsSection from "@/components/Feature/ForCreator/CreatorsSection";
import ShortStory from "../../../components/Feature/ForCreator/ShortStory";
import PricingPlansSection from "@/components/Feature/Pricing/PlansSection";
import WhyCreatorsChoose from "@/components/Feature/ExploreCreators/Creators/WhyCreatorsChoose";

export default function CreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <CreatorsSection />
        <ShortStory />
        <WhyCreatorsChoose />
        <PricingPlansSection titleKey="pricingPage.title" />
      </Main>
      <Footer />
    </PageContainer>
  );
}
