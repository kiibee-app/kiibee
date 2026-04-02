import HeroSection from "@/components/landing/Hero";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
      </Main>
    </PageContainer>
  );
}
