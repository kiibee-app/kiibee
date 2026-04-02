import HeroSection from "@/components/landing/Hero";
import CallToAction from "@/components/landing/CallToAction";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
        <CallToAction />
      </Main>
    </PageContainer>
  );
}
