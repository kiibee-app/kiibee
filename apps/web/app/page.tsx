import HeroSection from "@/components/Feature/landing/Hero";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import ValueStatement from "@/components/Feature/landing/ValueStatement";
import Footer from "@/components/Layout/Footer";
import WatchingSteps from "@/components/Feature/landing/WatchingSteps";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
      </Main>
      <WatchingSteps />
      <ValueStatement />
      <Footer />
    </PageContainer>
  );
}
