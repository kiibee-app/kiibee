"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import coverImage from "@/assets/images/creators/create_profile_hero1.png";
import avatarImage from "@/assets/images/creators/profile_pic.png";
import GenericTabs from "@/components/UI/GenericTabs";
import {
  AvatarWrap,
  ContentInner,
  CoverFrame,
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
import { HOME, PROFILE_TABS, ProfileTabKey } from "@/utils/common";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";

export default function CreateProfile1Hero() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>(HOME);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <HeroWrapper>
      <CoverFrame>
        <Image
          src={coverImage}
          alt={t(CREATE_PROFILE_HOME.title)}
          fill
          sizes="(max-width: 900px) 100vw, 1300px"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </CoverFrame>

      <ContentInner>
        <ProfileSection>
          <AvatarWrap>
            <Image
              src={avatarImage}
              alt={t(CREATE_PROFILE_HOME.title)}
              fill
              sizes="152px"
              style={{ objectFit: "cover", objectPosition: "center" }}
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
                <MoreTextLabel> {t(CREATE_PROFILE_HOME.more)}</MoreTextLabel>
              </MoreText>
            </CreatorBio>
          </ProfileMeta>
        </ProfileSection>

        <TabsWrapper>
          <GenericTabs
            tabs={PROFILE_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            search={{
              open: searchOpen,
              value: searchValue,
              placeholder: "Search",
              onToggle: () => setSearchOpen((prev) => !prev),
              onChange: setSearchValue,
              ariaLabel: "Search profile content",
              icon: <SearchIcon width={18} height={18} />,
            }}
          />
        </TabsWrapper>
      </ContentInner>
    </HeroWrapper>
  );
}
