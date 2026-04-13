"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../../styles";
import CreatorsSection from "@/components/Feature/ForCreator/CreatorsSection";
import ShortStory from "../../../components/Feature/ForCreator/ShortStory";
import PricingPlansSection from "@/components/Feature/Pricing/PlansSection";
import ContentPerform from "@/components/Feature/ExploreCreators/Creators/ContentPerform";
import MarketingSection from "./creators/MarketingSection";
import GetStarted from "@/components/Feature/HowItWork/GetStarted";
import { BG_WHITE } from "@/utils/Constants";
import WhyCreatorsChoose from "@/components/Feature/ExploreCreators/Creators/WhyCreatorsChoose";

export default function CreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <CreatorsSection />
        <ContentPerform />
        <ShortStory />
        <MarketingSection />
        <WhyCreatorsChoose />
        <PricingPlansSection titleKey="pricingPage.title" />
        <GetStarted
          translationPrefix="creators.getStarted"
          bgVariant={BG_WHITE}
        />
      </Main>
      <Footer />
    </PageContainer>
  );
}
