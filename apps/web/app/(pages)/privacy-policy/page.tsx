"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, PageHeader, Section } from "@/app/styles";
import PrivacyPolicySection from "@/components/Feature/PrivacyPolicy";

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <PageHeader>Privacy Policy</PageHeader>
        <Section>
          <PrivacyPolicySection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
