"use client";

import type { ReactNode } from "react";
import { Page } from "../../Feature/ProfileLayout/Layout2/Home/styles";
import Footer from "@/components/Feature/ProfileLayout/Layout1/Footer";
import Navbar from "@/components/Feature/ProfileLayout/Layout1/Navbar";

type CreateProfileLayoutProps = {
  children: ReactNode;
};

export default function CreateProfile1Layout({
  children,
}: CreateProfileLayoutProps) {
  return (
    <Page>
      <Navbar />
      {children}
      <Footer />
    </Page>
  );
}
