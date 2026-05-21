"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import coverImage from "@/assets/images/creators/create_profile_hero1.png";
import avatarImage from "@/assets/images/creators/profile_pic.png";
import GenericTabs from "@/components/UI/GenericTabs";
import {
  AvatarImage,
  AvatarWrap,
  ContentInner,
  CoverFrame,
  CoverImage,
  CreatorBio,
  CreatorBioText,
  CreatorName,
  CreatorNameText,
  HeroWrapper,
  MoreText,
  MoreTextLabel,
  ProfileMeta,
  ProfileSection,
  TabsWrapper,
  UploadCount,
  UploadCountText,
} from "./styles";
import { ABOUT, HOME, ProfileTabKey } from "@/utils/common";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import CreatorInfoModal from "../../Layout2/Home/CreatorInfoModal";
import {
  useCreatorAboutModal,
  useCreatorProfileTabs,
} from "@/hooks/useCreatorChannelLayout";

export default function Hero() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const profileTabs = useCreatorProfileTabs();
  const { isAboutOpen, openAbout, closeAbout } = useCreatorAboutModal();
  const activeTab =
    profileTabs.find((tab) => tab.href === pathname)?.key ?? HOME;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleTabChange = (tab: ProfileTabKey) => {
    if (tab === ABOUT) {
      openAbout();
      return;
    }
    const target = profileTabs.find((item) => item.key === tab)?.href;
    if (!target) return;
    router.push(target);
  };

  return (
    <HeroWrapper>
      <CoverFrame>
        <CoverImage
          src={coverImage}
          alt={t(CREATE_PROFILE_HOME.title)}
          fill
          sizes="(max-width: 900px) 100vw, 1300px"
          priority
        />
      </CoverFrame>

      <ContentInner>
        <ProfileSection>
          <AvatarWrap>
            <AvatarImage
              src={avatarImage}
              alt={t(CREATE_PROFILE_HOME.title)}
              fill
              sizes="152px"
            />
          </AvatarWrap>

          <ProfileMeta>
            <CreatorName>
              <CreatorNameText>{t(CREATE_PROFILE_HOME.title)}</CreatorNameText>
            </CreatorName>
            <UploadCount>
              <UploadCountText>
                {t(CREATE_PROFILE_HOME.uploads, { count: 42 })}
              </UploadCountText>
            </UploadCount>
            <CreatorBio>
              <CreatorBioText>
                {t(CREATE_PROFILE_HOME.description)}
              </CreatorBioText>
              <MoreText>
                <MoreTextLabel onClick={openAbout}>
                  {t(CREATE_PROFILE_HOME.more)}
                </MoreTextLabel>
              </MoreText>
            </CreatorBio>
          </ProfileMeta>
        </ProfileSection>

        <TabsWrapper>
          <GenericTabs
            tabs={profileTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            search={{
              open: searchOpen,
              value: searchValue,
              placeholder: t(CREATE_PROFILE_HOME.searchPlaceholder),
              onToggle: () => setSearchOpen((prev) => !prev),
              onChange: setSearchValue,
              ariaLabel: t(CREATE_PROFILE_HOME.searchAriaLabel),
              icon: <SearchIcon width={18} height={18} />,
            }}
          />
        </TabsWrapper>
      </ContentInner>

      <CreatorInfoModal visible={isAboutOpen} onClose={closeAbout} />
    </HeroWrapper>
  );
}
