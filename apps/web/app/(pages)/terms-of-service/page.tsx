"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, PageHeader, Section } from "@/app/styles";
import TermsOfServiceSection from "@/components/Feature/TermsOfService";

export default function TermsOfServicePage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <PageHeader>Terms of Service</PageHeader>
        <Section>
          <TermsOfServiceSection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
