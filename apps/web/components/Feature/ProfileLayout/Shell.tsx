"use client";

import type { ReactNode } from "react";
import ProfileHero from "@/components/Feature/ProfileLayout/Hero";
import Footer from "@/components/Feature/ProfileLayout/shared/Footer";
import ProfileNavbar from "@/components/Feature/ProfileLayout/Navbar";
import CreatorInfoModal from "@/components/Feature/ProfileLayout/shared/CreatorInfoModal";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { Page as PageShell } from "@/components/Feature/ProfileLayout/pageStyles";
import { useProfileSync } from "@/hooks/auth/useProfileSync";
import {
  CreatorProfileUiProvider,
  useCreatorProfileUi,
} from "@/hooks/useCreatorChannelLayout";

type ProfileShellProps = {
  variant: ProfileLayoutVariant;
  children: ReactNode;
};

function ProfileAboutModal() {
  const { isAboutOpen, closeAbout } = useCreatorProfileUi();

  return <CreatorInfoModal visible={isAboutOpen} onClose={closeAbout} />;
}

export default function ProfileShell({ variant, children }: ProfileShellProps) {
  useProfileSync();

  return (
    <CreatorProfileUiProvider>
      <PageShell>
        <ProfileNavbar variant={variant} />
        <ProfileHero variant={variant} />
        {children}
        <Footer />
        <ProfileAboutModal />
      </PageShell>
    </CreatorProfileUiProvider>
  );
}
