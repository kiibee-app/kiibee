"use client";

import React from "react";
import { Main, PageContainer } from "@/app/styles";
import NavBar from "@/components/Layout/Navbar";
import LoginPage from "@/components/Feature/Auth/Login";

export default function SupportPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <LoginPage />
      </Main>
    </PageContainer>
  );
}
