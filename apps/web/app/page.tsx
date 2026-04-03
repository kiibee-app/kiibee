import HeroSection from "@/components/landing/Hero";
import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "./styles";
import ValueStatement from "@/components/landing/ValueStatement";
import Footer from "@/components/Layout/Footer";
import WatchingSteps from "@/components/landing/WatchingSteps";

export default function Home() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <HeroSection />
      </Main>
      <ValueStatement />
      <Footer />
      <WatchingSteps />
    </PageContainer>
  );
}
