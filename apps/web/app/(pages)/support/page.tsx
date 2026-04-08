"use client";

import React from "react";
import { Main, PageContainer } from "@/app/styles";
import SupportContact from "@/components/Feature/SupportContact";
import Footer from "@/components/Layout/Footer";
import NavBar from "@/components/Layout/Navbar";

export default function SupportPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <SupportContact />
      </Main>
      <Footer />
    </PageContainer>
  );
}
