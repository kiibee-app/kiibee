"use client";

import { useTranslation } from "react-i18next";
import { PATHS } from "@/utils/path";
import { CREATE_PROFILE_HOME, NAV } from "@/utils/translationKeys";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import NavBar from "@/components/Layout/Navbar";
import portrait from "@/assets/images/creators/profile_pic.png";
import {
  Brand,
  BrandAvatar,
  BrandAvatarImage,
  BrandName,
} from "../../Layout2/Home/styles";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <NavBar
      position="absolute"
      innerPadding="15px 110px"
      tabletInnerPadding="12px 24px"
      mobileInnerPadding="10px 14px"
      innerMaxWidth="1600px"
      navPosition="right"
      navbarHeight="74px"
      items={[]}
      brand={
        <Brand href={PATHS.DASHBOARD_CREATOR}>
          <BrandAvatar>
            <BrandAvatarImage
              src={portrait}
              alt={t(CREATE_PROFILE_HOME.brandName)}
              fill
              sizes="40px"
              priority
            />
          </BrandAvatar>
          <BrandName>
            <MonoText $use="Body_SemiBold">
              {t(CREATE_PROFILE_HOME.brandName)}
            </MonoText>
          </BrandName>
        </Brand>
      }
      actions={
        <>
          <GenericButton
            asAnchor
            href={PATHS.AUTH_LOGIN}
            variant={VARIANT.SECONDARY}
          >
            {t(NAV.login)}
          </GenericButton>
          <GenericButton
            asAnchor
            href={PATHS.AUTH_SIGNUP_CREATOR}
            variant={VARIANT.PRIMARY}
          >
            {t(NAV.startCreating)}
          </GenericButton>
        </>
      }
    />
  );
}
