import HeroSection from "@/components/Feature/landing/Hero";
import TestimonialSection from "@/components/Feature/landing/Testimonial";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import ValueStatement from "@/components/Feature/landing/ValueStatement";
import Footer from "@/components/Layout/Footer";
import WatchingSteps from "@/components/Feature/landing/WatchingSteps";
import DiscoverContent from "@/components/Feature/landing/DiscoverContent";
import CallToAction from "@/components/Feature/landing/CallToAction";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
        <TestimonialSection />
        <DiscoverContent />
        <WatchingSteps />
        <ValueStatement />
        <CallToAction />
      </Main>
      <Footer />
    </PageContainer>
  );
}
