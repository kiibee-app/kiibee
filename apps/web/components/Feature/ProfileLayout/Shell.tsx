"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
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
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import ProfileGate from "./ProfileGate";
import { ADMISSION_TYPE } from "@/utils/paymentRequirements";

type ProfileShellProps = {
  variant: ProfileLayoutVariant;
  children: ReactNode;
};

function ProfileAboutModal() {
  const { isAboutOpen, closeAbout } = useCreatorProfileUi();

  return <CreatorInfoModal visible={isAboutOpen} onClose={closeAbout} />;
}

function ProfileShellInner({ variant, children }: ProfileShellProps) {
  const { isPublicView, publicCreatorId } = useCreatorChannelProfile();
  const user = useStoredLoginUser();
  const [accessType, setAccessType] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (publicCreatorId) {
      const savedAccessType =
        localStorage.getItem(
          `kiibee.creator.settings.accessType.${publicCreatorId}`,
        ) || ADMISSION_TYPE.FREE;
      const unlocked =
        localStorage.getItem(`kiibee.profile.unlocked.${publicCreatorId}`) ===
        "true";

      Promise.resolve().then(() => {
        setAccessType(savedAccessType);
        setIsUnlocked(unlocked);
      });
    }
  }, [publicCreatorId]);

  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
  };

  const isOwner = user?.id && publicCreatorId && user.id === publicCreatorId;
  const isGated =
    isPublicView &&
    !isOwner &&
    (accessType === ADMISSION_TYPE.SET_PASSWORD ||
      accessType === ADMISSION_TYPE.REQUEST_EMAIL);
  const showGate = isGated && !isUnlocked;

  return (
    <PageShell>
      <ProfileNavbar variant={variant} />
      <ProfileHero variant={variant} />
      {showGate ? (
        <ProfileGate
          creatorId={publicCreatorId || ""}
          accessType={
            accessType as
              | typeof ADMISSION_TYPE.SET_PASSWORD
              | typeof ADMISSION_TYPE.REQUEST_EMAIL
          }
          onUnlockSuccess={handleUnlockSuccess}
        />
      ) : (
        children
      )}
      <Footer />
      <ProfileAboutModal />
    </PageShell>
  );
}

export default function ProfileShell({ variant, children }: ProfileShellProps) {
  useProfileSync();

  return (
    <CreatorProfileUiProvider>
      <ProfileShellInner variant={variant}>{children}</ProfileShellInner>
    </CreatorProfileUiProvider>
  );
}
