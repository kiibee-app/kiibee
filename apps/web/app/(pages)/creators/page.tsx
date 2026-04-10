"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../../styles";
import CreatorsSection from "@/components/Feature/ForCreator/CreatorsSection";
import ShortStory from "../../../components/Feature/ForCreator/ShortStory";
import PricingPlansSection from "@/components/Feature/Pricing/PlansSection";
import MarketingSection from "./creators/MarketingSection";

export default function CreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <CreatorsSection />
        <ShortStory />
        <MarketingSection />
        <PricingPlansSection titleKey="pricingPage.title" />
      </Main>
      <Footer />
    </PageContainer>
  );
}
