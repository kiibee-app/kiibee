import HeroSection from "@/components/landing/Hero";
import AISection from "@/components/landing/AISection";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
      </Main>
      <AISection />
    </PageContainer>
  );
}
