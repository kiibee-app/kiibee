import HeroSection from "@/components/Feature/landing/Hero";
import TestimonialSection from "@/components/landing/Testimonial";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import WatchingSteps from "@/components/Feature/landing/WatchingSteps";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
        <TestimonialSection />
      </Main>
      <WatchingSteps />
    </PageContainer>
  );
}
