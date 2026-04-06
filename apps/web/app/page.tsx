import HeroSection from "@/components/landing/Hero";
import TestimonialSection from "@/components/landing/Testimonial";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import ValueStatement from "@/components/landing/ValueStatement";
import Footer from "@/components/Layout/Footer";
import WatchingSteps from "@/components/landing/WatchingSteps";
import DiscoverContent from "@/components/landing/DiscoverContent";
import CallToAction from "@/components/landing/CallToAction";

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
