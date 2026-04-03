import HeroSection from "@/components/landing/Hero";
import TestimonialSection from "@/components/landing/Testimonial";
import NavBar from "@/components/Layout/Navbar";
import { Main, PageContainer } from "./styles";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
        <TestimonialSection />
      </Main>
    </PageContainer>
  );
}
