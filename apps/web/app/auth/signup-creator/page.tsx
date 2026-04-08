import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../styles";

export default function CreatorSignupPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h1>Create Creator Account</h1>
          <p>Creator signup form coming soon...</p>
        </div>
      </Main>
      <Footer />
    </PageContainer>
  );
}
