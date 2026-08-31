"use client";

import type { ReactNode } from "react";
import COLORS from "@repo/ui/colors";
import ProfileHero from "@/components/Feature/ProfileLayout/Hero";
import ProfileFooter from "@/components/Feature/ProfileLayout/shared/Footer";
import ProfileNavbar from "@/components/Feature/ProfileLayout/Navbar";
import CreatorInfoModal from "@/components/Feature/ProfileLayout/shared/CreatorInfoModal";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { Page as PageShell } from "@/components/Feature/ProfileLayout/pageStyles";
import { useProfileSync } from "@/hooks/auth/useProfileSync";
import {
  CreatorProfileUiProvider,
  useCreatorProfileUi,
} from "@/hooks/useCreatorChannelLayout";
import { usePublicCreatorLayoutRedirect } from "@/hooks/usePublicCreatorLayoutRedirect";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import {
  API_BUTTON_COLOR,
  API_TEXT_COLOR,
  getReadableTextColor,
  HEX_COLOR_RE,
  TEXT_COLOR_VALUES,
} from "@/utils/appearance";

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
  usePublicCreatorLayoutRedirect(variant);
  const { textColor, buttonColor } = useCreatorChannelProfile();
  const resolvedTextColor =
    textColor === TEXT_COLOR_VALUES.DARK_TEXT
      ? COLORS.primary.BLACK
      : textColor === TEXT_COLOR_VALUES.WHITE_TEXT
        ? COLORS.primary.WHITE
        : null;
  const resolvedButtonColor =
    buttonColor &&
    buttonColor !== API_BUTTON_COLOR &&
    HEX_COLOR_RE.test(buttonColor)
      ? buttonColor
      : null;

  return (
    <CreatorProfileUiProvider>
      <PageShell
        $textColor={textColor === API_TEXT_COLOR ? null : resolvedTextColor}
        $buttonColor={resolvedButtonColor}
        $buttonTextColor={
          resolvedButtonColor
            ? getReadableTextColor(resolvedButtonColor)
            : undefined
        }
      >
        <ProfileNavbar variant={variant} />
        <ProfileHero variant={variant} />
        {children}
        <ProfileFooter />
        <ProfileAboutModal />
      </PageShell>
    </CreatorProfileUiProvider>
  );
}
