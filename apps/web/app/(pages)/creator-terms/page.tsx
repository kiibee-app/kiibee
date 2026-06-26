"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "@/app/styles";
import CreatorTermsSection from "@/components/Feature/CreatorTerms";

export default function CreatorTermsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <CreatorTermsSection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
