"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "@/app/styles";
import SubscriptionTermsSection from "@/components/Feature/SubscriptionTerms";

export default function SubscriptionTermsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <SubscriptionTermsSection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
