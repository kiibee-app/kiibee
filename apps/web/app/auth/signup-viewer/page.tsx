import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../styles";

export default function ViewerSignupPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h1>Create Viewer Account</h1>
          <p>Viewer signup form coming soon...</p>
        </div>
      </Main>
      <Footer />
    </PageContainer>
  );
}
