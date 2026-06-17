"use client";

import Image from "@/components/UI/SafeImage";
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
import collection from "@/assets/images/singleCollection.webp";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { useRouter } from "next/navigation";
import { ShareIcon } from "@/assets/icons/shareIcon";
import { useTranslation } from "react-i18next";
import { NAV } from "@/utils/translationKeys";
import { VARIANT } from "@/utils/Constants";
import { pathPublishedContent } from "@/utils/path";
import useShare from "@/hooks/useShare";

type Props = {
  title: string;
  primaryContentId?: string;
};

export default function SingleCollectionHero({
  title,
  primaryContentId,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { share } = useShare();
  const handleBack = () => {
    router.back();
  };
  const primaryContentHref = primaryContentId
    ? pathPublishedContent(primaryContentId)
    : undefined;

  return (
    <HeroWrapper>
      <TopBar>
        <BackButtonWrapper onClick={handleBack}>
          <BackButtonIcon />
        </BackButtonWrapper>
        <GenericButton variant={VARIANT.PRIMARY_LITE} onClick={share}>
          <ShareIcon />
          {t("common.share")}
        </GenericButton>
      </TopBar>
      <ContentRow>
        <HeroContent>
          <LogoRow>
            <Image
              src={logo}
              alt="Kiibee Logo"
              width={30}
              height={30}
              priority
            />
            <MonoText $use="H4_Medium">{t(NAV.logoAlt)}</MonoText>
          </LogoRow>

          <MonoText $use="Heading2">{title}</MonoText>
          <MonoText $use="Body_Medium">
            {t("singleCollection.subtitle")}
          </MonoText>
          <ActionButton
            asAnchor
            href={primaryContentHref}
            disabled={!primaryContentHref}
          >
            {t("singleCollection.seeContent")}
          </ActionButton>
        </HeroContent>

        <HeroImage>
          <Image
            src={collection}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            style={{ objectFit: "cover" }}
            priority
          />
        </HeroImage>
      </ContentRow>
    </HeroWrapper>
  );
}
