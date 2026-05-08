"use client";

import type { ReactNode } from "react";
import { Page } from "./styles";
import CreateProfileNavbar from "../CreateProfileNavbar";
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
