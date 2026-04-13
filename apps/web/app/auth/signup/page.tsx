import NavBar from "@/components/Layout/Navbar";
import SignUpSection from "@/components/Feature/Auth/SignUp";
import { Main, PageContainer } from "@/app/styles";

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
