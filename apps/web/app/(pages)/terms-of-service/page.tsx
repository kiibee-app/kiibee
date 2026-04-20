"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "@/app/styles";
import TermsOfServiceSection from "@/components/Feature/TermsOfService";

export default function TermsOfServicePage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <TermsOfServiceSection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
