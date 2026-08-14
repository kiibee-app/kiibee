"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/utils/path";
import { CREATE_PROFILE_FOOTER } from "@/utils/translationKeys";
import { VARIANT } from "@/utils/Constants";
import {
  Container,
  Inner,
  BrandBlock,
  BrandCopy,
  Content,
  CTA,
  JoinButton,
} from "./styles";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Container aria-label={t("common.createProfileFooterAria")}>
      <Inner>
        <BrandBlock>
          <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
          <BrandCopy>{t(CREATE_PROFILE_FOOTER.tagline)}</BrandCopy>
        </BrandBlock>

        <Content>
          <CTA>
            <JoinButton
              asAnchor
              data-creator-join-button
              href={PATHS.AUTH_SIGNUP_CREATOR}
              variant={VARIANT.PRIMARY}
            >
              {t(CREATE_PROFILE_FOOTER.cta)}
            </JoinButton>
          </CTA>
        </Content>
      </Inner>
    </Container>
  );
}
