"use client";

import type { ReactNode } from "react";
import { Page } from "../../Feature/CreateProfile2Home/styles";

import CreateProfileCtaFooter from "@/components/Feature/CreateProfileFooter";
import CreateProfile1Navbar from "@/components/Feature/CreateProfile1Nav";

type CreateProfileLayoutProps = {
  children: ReactNode;
};

export default function CreateProfile1Layout({
  children,
}: CreateProfileLayoutProps) {
  return (
    <Page>
      <CreateProfile1Navbar />
      {children}
      <CreateProfileCtaFooter />
    </Page>
  );
}
