"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, PageHeader, Section } from "@/app/styles";
import SubscriptionTermsSection from "@/components/Feature/SubscriptionTerms";

export default function SubscriptionTermsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <PageHeader>Subscription Terms</PageHeader>
        <Section>
          <SubscriptionTermsSection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
