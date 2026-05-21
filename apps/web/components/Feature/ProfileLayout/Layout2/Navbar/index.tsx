"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { PATHS } from "@/utils/path";
import { CREATE_PROFILE_HOME, NAV } from "@/utils/translationKeys";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import NavBar from "@/components/Layout/Navbar";
import { PROFILE_NAV_ITEMS } from "@/utils/profile";
import portrait from "@/assets/images/creators/creator-woman-gray-jacket.webp";
import { Brand, BrandAvatar, BrandName } from "../Home/styles";
import CreatorInfoModal from "../Home/CreatorInfoModal";

export default function Navbar() {
  const { t } = useTranslation();
  const [isCreatorInfoOpen, setIsCreatorInfoOpen] = useState(false);

  const navItems = PROFILE_NAV_ITEMS.map((item) =>
    item.key === "nav.profile.about"
      ? { ...item, onClick: () => setIsCreatorInfoOpen(true) }
      : item,
  );

  return (
    <>
      <NavBar
        position="absolute"
        navbarHeight="74px"
        innerPadding="15px 110px"
        tabletInnerPadding="12px 24px"
        mobileInnerPadding="10px 14px"
        innerMaxWidth="1600px"
        navPosition="right"
        brand={
          <Brand href={PATHS.DASHBOARD_CREATOR}>
            <BrandAvatar>
              <Image
                src={portrait}
                alt={t(CREATE_PROFILE_HOME.brandName)}
                fill
                sizes="40px"
                style={{ objectFit: "cover" }}
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
        items={navItems}
        navBefore={<SearchIcon width={18} height={18} />}
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
      <CreatorInfoModal
        visible={isCreatorInfoOpen}
        onClose={() => setIsCreatorInfoOpen(false)}
      />
    </>
  );
}
