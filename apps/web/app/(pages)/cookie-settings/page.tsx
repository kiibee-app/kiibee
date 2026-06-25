"use client";

import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "@/app/styles";
import CookieSettingsSection from "@/components/Feature/CookieSettings";

export default function CookieSettingsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <CookieSettingsSection />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
