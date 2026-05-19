"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/utils/path";
import { CREATE_PROFILE_FOOTER } from "@/utils/translationKeys";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import {
  Container,
  Inner,
  BrandBlock,
  BrandCopy,
  Content,
  CTA,
} from "./styles";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Container aria-label={t("createProfileFooter.ariaLabel")}>
      <Inner>
        <BrandBlock>
          <Image
            src={logo}
            alt={t("createProfileFooter.logoAlt")}
            width={42}
            height={42}
            priority
          />
          <BrandCopy>{t(CREATE_PROFILE_FOOTER.tagline)}</BrandCopy>
        </BrandBlock>

        <Content>
          <CTA>
            <GenericButton
              asAnchor
              href={PATHS.AUTH_SIGNUP_CREATOR}
              variant={VARIANT.PRIMARY}
              minWidth="96px"
            >
              {t(CREATE_PROFILE_FOOTER.cta)}
            </GenericButton>
          </CTA>
        </Content>
      </Inner>
    </Container>
  );
}
