"use client";

import React from "react";
import { Main, PageContainer } from "@/app/styles";
import NavBar from "@/components/Layout/Navbar";
import LoginForm from "@/components/Feature/Login/LoginForm";

export default function SupportPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <LoginForm />
      </Main>
    </PageContainer>
  );
}
