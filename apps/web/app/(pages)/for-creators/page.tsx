"use client";

import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../../styles";
import CreatorsSection from "@/components/Feature/ForCreator/CreatorsSection";
import ShortStory from "../../../components/Feature/ForCreator/ShortStory";
import PricingPlansSection from "@/components/Feature/Pricing/PlansSection";
import ContentPerform from "@/components/Feature/ForCreator/ContentPerform";
import GetStarted from "@/components/Feature/HowItWork/GetStarted";
import CtaSection from "@/components/Feature/CtaSection";
import { BG_WHITE } from "@/utils/Constants";
import WhyCreatorsChoose from "@/components/Feature/ForCreator/WhyCreatorsChoose";
import HowToGetStarted from "@/components/Feature/ForCreator/HowToGetStarted";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { PATHS } from "@/utils/path";

const KIIBEE_FRAME_VIDEO = "/videos/kiibeeframe.mp4";

export default function CreatorsPage() {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const isLoggedIn = !!user;

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <CreatorsSection />
        <ShortStory />
        <ContentPerform />
        <HowToGetStarted />
        <CtaSection
          bgVideo={KIIBEE_FRAME_VIDEO}
          title={t("creators.value.title")}
          subtitle={t("creators.value.subtitle")}
          ctaText={isLoggedIn ? undefined : t("creators.value.cta")}
          ctaHref={PATHS.AUTH_SIGNUP}
        />
        <WhyCreatorsChoose />
        <PricingPlansSection titleKey="pricingPage.title" alignWide />
        <GetStarted
          translationPrefix="creators.getStarted"
          bgVariant={BG_WHITE}
          alignWide
        />
      </Main>
      <Footer />
    </PageContainer>
  );
}
