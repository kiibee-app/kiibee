"use client";

import type { ReactNode } from "react";
import ProfileHero from "@/components/Feature/ProfileLayout/Hero";
import ProfileShell from "@/components/Feature/ProfileLayout/Shell";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";

type CreatorProfileLayoutProps = {
  variant: ProfileLayoutVariant;
  children: ReactNode;
};

export default function CreatorProfileLayout({
  variant,
  children,
}: CreatorProfileLayoutProps) {
  return (
    <ProfileShell variant={variant}>
      <ProfileHero variant={variant} />
      {children}
    </ProfileShell>
  );
}
