"use client";

import { CrossIcon } from "@/assets/icons/crossIcon";
import { FacebookIcon, TwitterIcon } from "@/assets/icons";
import { ShareIcon } from "@/assets/icons/shareIcon";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";
import { creatorInfoModalData } from "@/utils/dummyData/profile.data";
import {
  CloseIconButton,
  CreatorInfoContent,
  CreatorInfoHeader,
  InfoList,
  LinkItem,
  LinksList,
  SectionTitle,
  BodyText,
  Section,
  ShareButton,
} from "./CreatorInfoModal.styles";

type CreatorInfoModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CreatorInfoModal({
  visible,
  onClose,
}: CreatorInfoModalProps) {
  const { t } = useTranslation();
  const title = creatorInfoModalData.name;
  const body = creatorInfoModalData.description;

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      size="md"
      height="570px"
      padding="start"
      borderRadius="8px"
      showCloseButton={false}
    >
      <CreatorInfoContent data-lenis-prevent>
        <CreatorInfoHeader>
          <MonoText $use="H4_Medium">{title}</MonoText>
          <CloseIconButton type="button" onClick={onClose} aria-label="Close">
            <CrossIcon
              width={18}
              height={18}
              crossColor={COLORS.primary.BLACK}
            />
          </CloseIconButton>
        </CreatorInfoHeader>

        <BodyText>
          <MonoText $use="Body_Medium">{body}</MonoText>
        </BodyText>

        <Section>
          <SectionTitle>
            <MonoText $use="H5_Medium">
              {t("createProfileHome.aboutModal.moreInfo")}
            </MonoText>
          </SectionTitle>
          <InfoList>
            <MonoText $use="Body_Medium">
              {t("createProfileHome.aboutModal.joined")}{" "}
              {creatorInfoModalData.joinedDate}
            </MonoText>
            <MonoText $use="Body_Medium">
              {t("createProfileHome.uploads", {
                count: creatorInfoModalData.uploads,
              })}
            </MonoText>
          </InfoList>
        </Section>

        <Section>
          <SectionTitle>
            <MonoText $use="H5_Medium">
              {t("createProfileHome.aboutModal.links")}
            </MonoText>
          </SectionTitle>
          <LinksList>
            <LinkItem href={`https://${creatorInfoModalData.links.facebook}`}>
              <FacebookIcon
                width={19}
                height={19}
                color={COLORS.primary.BLACK}
              />
              <MonoText $use="Body_Medium">
                {creatorInfoModalData.links.facebook}
              </MonoText>
            </LinkItem>
            <LinkItem href={`https://${creatorInfoModalData.links.twitter}`}>
              <TwitterIcon
                width={19}
                height={19}
                color={COLORS.primary.BLACK}
              />
              <MonoText $use="Body_Medium">
                {creatorInfoModalData.links.twitter}
              </MonoText>
            </LinkItem>
          </LinksList>
        </Section>

        <ShareButton type="button" aria-label={t("common.share")}>
          <ShareIcon width={18} height={18} />
          <MonoText $use="Body_Medium">{t("common.share")}</MonoText>
        </ShareButton>
      </CreatorInfoContent>
    </GenericModal>
  );
}
