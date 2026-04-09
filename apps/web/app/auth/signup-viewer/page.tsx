"use client";

import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main } from "../styles";

export default function ViewerSignupPage() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h1>{t("viewerSignup.heading")}</h1>
          <p>{t("viewerSignup.description")}</p>
        </div>
      </Main>
      <Footer />
    </PageContainer>
  );
}
