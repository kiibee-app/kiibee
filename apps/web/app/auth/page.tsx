import NavBar from "@/components/Layout/Navbar";
import SignUpSection from "@/components/Feature/Auth/SignUp";
import { PageContainer, Main } from "./styles";

export default function AuthPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <SignUpSection />
      </Main>
    </PageContainer>
  );
}
