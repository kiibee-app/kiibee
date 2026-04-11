"use client";

import Image from "next/image";
import {
  HeroWrapper,
  HeroContent,
  ActionButton,
  HeroImage,
  LogoRow,
  ContentRow,
  TopBar,
  BackButtonWrapper,
} from "./styles";
import { BackButtonIcon } from "@/assets/icons";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import collection from "@/assets/images/singleCollection.jpg";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { useRouter } from "next/navigation";
import { ShareIcon } from "@/assets/icons/shareIcon";
import { useTranslation } from "react-i18next";

type Props = {
  title: string;
};

export default function SingleCollectionHero({ title }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <HeroWrapper>
      <TopBar>
        <BackButtonWrapper onClick={handleBack}>
          <BackButtonIcon />
        </BackButtonWrapper>

        <GenericButton variant="primary-lite" href="#">
          <ShareIcon />
          {t("common.share")}
        </GenericButton>
      </TopBar>
      <ContentRow>
        <HeroContent>
          <LogoRow>
            <Image src={logo} alt="Kiibee Logo" width={30} height={30} />
            <MonoText $use="H4_Medium">{t("nav.logoAlt")}</MonoText>
          </LogoRow>

          <MonoText $use="Heading2">{title}</MonoText>
          <MonoText $use="Body_Medium">
            {t("singleCollection.subtitle")}
          </MonoText>
          <ActionButton>{t("singleCollection.seeContent")}</ActionButton>
        </HeroContent>

        <HeroImage>
          <Image
            src={collection}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
          />
        </HeroImage>
      </ContentRow>
    </HeroWrapper>
  );
}
