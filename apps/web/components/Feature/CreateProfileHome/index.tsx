"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import { PATHS } from "@/utils/path";
import {
  Page,
  HeroFrame,
  Brand,
  BrandAvatar,
  BrandName,
  HeroGrid,
  StoryPanel,
  StoryMeta,
  StoryTitle,
  StoryDescription,
  UploadsText,
  HeroMedia,
} from "./styles";
import portrait from "@/assets/images/creators/creator-woman-gray-jacket.webp";
import heroImage from "@/assets/images/creators/creator_profile_hero.png";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import NavBar from "@/components/Layout/Navbar";
import { PROFILE_NAV_ITEMS } from "@/utils/profile";
import { CREATE_PROFILE_HOME, NAV } from "@/utils/translationKeys";

export default function CreateProfileHome() {
  const { t } = useTranslation();

  return (
    <Page>
      <HeroFrame>
        <NavBar
          position="absolute"
          innerPadding="15px 110px"
          tabletInnerPadding="12px 24px"
          mobileInnerPadding="10px 14px"
          innerMaxWidth="none"
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
          items={PROFILE_NAV_ITEMS}
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
        <HeroGrid>
          <StoryPanel>
            <StoryMeta>
              <UploadsText>
                <MonoText $use="Body_Medium" color={COLORS.primary.WHITE_90}>
                  {t(CREATE_PROFILE_HOME.uploads, { count: 76 })}
                </MonoText>
              </UploadsText>
            </StoryMeta>

            <StoryTitle>
              <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
                {t(CREATE_PROFILE_HOME.title)}
              </MonoText>
            </StoryTitle>

            <StoryDescription>
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE_90}>
                {t(CREATE_PROFILE_HOME.description)}
              </MonoText>
            </StoryDescription>
          </StoryPanel>

          <HeroMedia>
            <Image
              src={heroImage}
              alt="Creator workspace"
              fill
              sizes="(max-width: 900px) 100vw, 70vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </HeroMedia>
        </HeroGrid>
      </HeroFrame>
    </Page>
  );
}
