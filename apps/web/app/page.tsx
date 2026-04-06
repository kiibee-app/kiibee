import HeroSection from "@/components/Feature/landing/Hero";
import TestimonialSection from "@/components/landing/Testimonial";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import ValueStatement from "@/components/Feature/landing/ValueStatement";
import Footer from "@/components/Layout/Footer";
import WatchingSteps from "@/components/Feature/landing/WatchingSteps";
import CallToAction from "@/components/landing/CallToAction";
import InterestSection from "@/components/Feature/landing/InterestSection";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
        <InterestSection />
        <TestimonialSection />
      </Main>

      <WatchingSteps />
      <ValueStatement />
      <CallToAction />
      <Footer />
    </PageContainer>
  );
}
