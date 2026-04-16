"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../../styles";
import CreatorsSection from "@/components/Feature/ForCreator/CreatorsSection";
import ShortStory from "../../../components/Feature/ForCreator/ShortStory";
import PricingPlansSection from "@/components/Feature/Pricing/PlansSection";
import ContentPerform from "@/components/Feature/ForCreator/ContentPerform";
import MarketingSection from "../../../components/Feature/ForCreator/MarketingSection";
import GetStarted from "@/components/Feature/HowItWork/GetStarted";
import { BG_WHITE } from "@/utils/Constants";
import WhyCreatorsChoose from "@/components/Feature/ForCreator/WhyCreatorsChoose";
import HowToGetStarted from "@/components/Feature/ForCreator/HowToGetStarted";

export default function CreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <CreatorsSection />
        <ShortStory />
        <MarketingSection />
        <ContentPerform />
        <HowToGetStarted />
        <WhyCreatorsChoose />
        <PricingPlansSection titleKey="pricingPage.title" />
        <GetStarted translationPrefix="creators.getStarted" bgVariant={BG_WHITE} />
      </Main>
      <Footer />
    </PageContainer>
  );
}
