"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, PageHeader, Section } from "@/app/styles";
import CookieSettingsSection from "@/components/Feature/CookieSettings";

export default function CookieSettingsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <PageHeader>Cookie Settings</PageHeader>
        <Section>
          <CookieSettingsSection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
