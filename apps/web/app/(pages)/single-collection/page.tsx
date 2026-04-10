"use client";

import { useSearchParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main, Section } from "../../styles";
import { tutorialVideoSections } from "@/utils/data";
import SingleCollectionHero from "@/components/Feature/SingleCollectionHero";

export default function SingleCollectionPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const section = tutorialVideoSections.find((s) => s.id === id)!;

  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Section>
          <SingleCollectionHero title={section.title} />
        </Section>
      </Main>
      <Footer />
    </PageContainer>
  );
}
