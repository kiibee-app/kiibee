"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "@/app/styles";
import PrivacyPolicySection from "@/components/Feature/PrivacyPolicy";

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <PrivacyPolicySection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
