"use client";

import type { ReactNode } from "react";
import Footer from "@/components/Feature/ProfileLayout/shared/Footer";
import ProfileNavbar from "@/components/Feature/ProfileLayout/Navbar";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { Page as PageShell } from "@/components/Feature/ProfileLayout/pageStyles";
import { useProfileSync } from "@/hooks/auth/useProfileSync";

type ProfileShellProps = {
  variant: ProfileLayoutVariant;
  children: ReactNode;
};

export default function ProfileShell({ variant, children }: ProfileShellProps) {
  useProfileSync();

  return (
    <PageShell>
      <ProfileNavbar variant={variant} />
      {children}
      <Footer />
    </PageShell>
  );
}
