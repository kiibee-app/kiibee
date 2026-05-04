"use client";

import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { BackButtonIcon } from "@/assets/icons";
import { BackLink, TopBar } from "./styles";
import { useRouter } from "next/navigation";

type AuthBackButtonProps = {
  href?: string;
  ariaLabel?: string;
  onClick?: () => void;
  marginBottom?: string;
};

export default function AuthBackButton({
  href,
  ariaLabel,
  onClick,
  marginBottom,
}: AuthBackButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const handleClick = () => {
    if (onClick) return onClick();
    return href ? router.push(href) : router.back();
  };

  return (
    <TopBar $marginBottom={marginBottom}>
      <BackLink
        onClick={handleClick}
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
