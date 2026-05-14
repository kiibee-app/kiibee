"use client";

import type { ReactNode } from "react";
import { Page } from "../../Feature/CreateProfileHome/styles";
import CreateProfileNavbar from "../../Feature/CreateProfileNavbar";
import CreateProfileCtaFooter from "@/components/Feature/CreateProfileFooter";

type CreateProfileLayoutProps = {
  children: ReactNode;
};

export default function CreateProfileLayout({
  children,
}: CreateProfileLayoutProps) {
  return (
    <Page>
      <CreateProfileNavbar />
      {children}
      <CreateProfileCtaFooter />
    </Page>
  );
}
