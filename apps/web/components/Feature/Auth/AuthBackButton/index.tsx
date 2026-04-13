"use client";

import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { BackButtonIcon } from "@/assets/icons";
import { BackLink, TopBar } from "./styles";

type AuthBackButtonProps = {
  href: string;
  ariaLabel?: string;
};

export default function AuthBackButton({
  href,
  ariaLabel,
}: AuthBackButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <TopBar>
      <BackLink
        href={href}
        aria-label={ariaLabel || t("authCreator.backAria", "Back")}
      >
        <BackButtonIcon
          size={40}
          backgroundColor={theme?.colors?.neutral?.GRAY_200}
          strokeColor={theme?.colors?.primary?.BLACK}
        />
      </BackLink>
    </TopBar>
  );
}
