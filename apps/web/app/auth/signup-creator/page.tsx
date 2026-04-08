import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import SignUpCreatorSection from "@/components/Feature/Auth/SignUpCreator";
import { PageContainer, Main } from "../styles";

export default function CreatorSignupPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <SignUpCreatorSection />
      </Main>
      <Footer />
    </PageContainer>
  );
}
