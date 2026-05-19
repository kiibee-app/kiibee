"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/assets/icons/searchBarIcon";
import coverImage from "@/assets/images/creators/creator_profile_hero3.png";
import avatarImage from "@/assets/images/creators/profile_pic3.png";
import GenericTabs from "@/components/UI/GenericTabs";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import { ABOUT, HOME, PROFILE_TABS3, ProfileTabKey } from "@/utils/common";

import {
  AvatarImage,
  AvatarWrap,
  BioText,
  CoverFrame,
  CoverImage,
  HeroWrapper,
  InfoSection,
  NameText,
  TabsWrapper,
  UploadsText,
} from "./styles";
import CreatorInfoModal from "@/components/Feature/ProfileLayout/Layout2/Home/CreatorInfoModal";

export default function Hero() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab =
    PROFILE_TABS3.find((tab) => tab.href === pathname)?.key ?? HOME;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCreatorInfoOpen, setIsCreatorInfoOpen] = useState(false);
  const handleTabChange = (tab: ProfileTabKey) => {
    if (tab === ABOUT) {
      setIsCreatorInfoOpen(true);
      return;
    }
    const target = PROFILE_TABS3.find((item) => item.key === tab)?.href;
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
          sizes="100vw"
          priority
        />
      </CoverFrame>

      <InfoSection>
        <AvatarWrap>
          <AvatarImage
            src={avatarImage}
            alt={t(CREATE_PROFILE_HOME.title)}
            fill
            sizes="180px"
          />
        </AvatarWrap>

        <NameText>{t(CREATE_PROFILE_HOME.title)}</NameText>
        <UploadsText>
          {t(CREATE_PROFILE_HOME.uploads, { count: 76 })}
        </UploadsText>
        <BioText>{t(CREATE_PROFILE_HOME.description)}</BioText>

        <TabsWrapper>
          <GenericTabs
            tabs={PROFILE_TABS3}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            search={{
              open: searchOpen,
              value: searchValue,
              onToggle: () => setSearchOpen((prev) => !prev),
              onChange: setSearchValue,
              ariaLabel: t(CREATE_PROFILE_HOME.searchAriaLabel),
              placeholder: t(CREATE_PROFILE_HOME.searchPlaceholder),
              icon: <SearchIcon width={18} height={18} />,
            }}
          />
        </TabsWrapper>
      </InfoSection>

      <CreatorInfoModal
        visible={isCreatorInfoOpen}
        onClose={() => setIsCreatorInfoOpen(false)}
      />
    </HeroWrapper>
  );
}
