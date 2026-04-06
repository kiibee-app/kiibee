import HeroSection from "@/components/Feature/landing/Hero";
import TestimonialSection from "@/components/landing/Testimonial";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import ValueStatement from "@/components/Feature/landing/ValueStatement";
import Footer from "@/components/Layout/Footer";
import WatchingSteps from "@/components/Feature/landing/WatchingSteps";
import DiscoverContent from "@/components/Feature/landing/DiscoverContent";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
        <TestimonialSection />
        <DiscoverContent />
      </Main>
      <WatchingSteps />
      <ValueStatement />
      <Footer />
    </PageContainer>
  );
}
