"use client";

import NavBar from "@/components/Layout/Navbar";
import { PageContainer, Main } from "../../styles";
import CreatorsSection from "./index";

export default function CreatorsPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <CreatorsSection />
      </Main>
    </PageContainer>
  );
}
