"use client";

import { CrossIcon } from "@/assets/icons/crossIcon";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YouTubeIcon,
  LinkIcon,
} from "@/assets/icons";
import { ShareIcon } from "@/assets/icons/shareIcon";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { useTranslation } from "react-i18next";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import useShare from "@/hooks/useShare";
import ShareModal from "@/components/UI/Modals/ShareModal";
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
} from "./styles";
import { MODAL_PADDINGS } from "@/lib/theme/tokens";
import {
  getDisplayUrl,
  isCreatorWebsiteLink,
  matchSocialPlatform,
  type SocialIconEntry,
} from "@/utils/creatorProfile";
import { CREATE_PROFILE_HOME, COMMON } from "@/utils/translationKeys";

const ICON_SIZE = { width: 19, height: 19 } as const;
const ICON_COLOR = COLORS.primary.BLACK;
const HTTP_PREFIX = "http";
const HTTPS_PREFIX = "https://";

const SOCIAL_ENTRIES: SocialIconEntry[] = [
  { domains: ["youtube.com", "youtu.be"], Icon: YouTubeIcon },
  { domains: ["facebook.com"], Icon: FacebookIcon },
  { domains: ["twitter.com", "x.com"], Icon: TwitterIcon },
  { domains: ["instagram.com"], Icon: InstagramIcon },
];

function toAbsoluteUrl(url: string): string {
  return url.startsWith(HTTP_PREFIX) ? url : `${HTTPS_PREFIX}${url}`;
}

function SocialIcon({ url }: { url: string }) {
  const match = matchSocialPlatform(url, SOCIAL_ENTRIES);
  const Icon = match?.Icon ?? LinkIcon;
  return <Icon {...ICON_SIZE} color={ICON_COLOR} />;
}

type CreatorInfoModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CreatorInfoModal({
  visible,
  onClose,
}: CreatorInfoModalProps) {
  const { t } = useTranslation();
  const { displayName, about } = useCreatorChannelProfile();
  const { share, shareUrl, showShareModal, setShowShareModal } = useShare();

  const title = displayName ?? "";
  const body = about?.description ?? "";
  const joinedDate = about?.joinedDate ?? "";
  const uploadsCount = about?.uploadCount ?? 0;
  const links =
    about?.websiteLink && isCreatorWebsiteLink(about.websiteLink)
      ? [about.websiteLink]
      : [];
  const contactEmail = about?.contactEmail ?? "";
  const showLinksSection = links.length > 0 || Boolean(contactEmail);

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      size="md"
      height="570px"
      padding={MODAL_PADDINGS.start}
      borderRadius="8px"
      showCloseButton={false}
    >
      <CreatorInfoContent data-lenis-prevent>
        <CreatorInfoHeader>
          <MonoText $use="H4_Medium">{title}</MonoText>
          <CloseIconButton
            type="button"
            onClick={onClose}
            aria-label={t(COMMON.close)}
          >
            <CrossIcon width={18} height={18} crossColor={ICON_COLOR} />
          </CloseIconButton>
        </CreatorInfoHeader>

        <BodyText>
          <MonoText $use="Body_Medium">{body}</MonoText>
        </BodyText>

        <Section>
          <SectionTitle>
            <MonoText $use="H5_Medium">
              {t(CREATE_PROFILE_HOME.aboutModal.moreInfo)}
            </MonoText>
          </SectionTitle>
          <InfoList>
            <MonoText $use="Body_Medium">
              {t(CREATE_PROFILE_HOME.aboutModal.joined)} {joinedDate}
            </MonoText>
            <MonoText $use="Body_Medium">
              {t(CREATE_PROFILE_HOME.uploads, { count: uploadsCount })}
            </MonoText>
          </InfoList>
        </Section>

        {showLinksSection && (
          <Section>
            <SectionTitle>
              <MonoText $use="H5_Medium">
                {t(CREATE_PROFILE_HOME.aboutModal.links)}
              </MonoText>
            </SectionTitle>
            <LinksList>
              {links.map((url) => (
                <LinkItem
                  key={url}
                  href={toAbsoluteUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon url={url} />
                  <MonoText $use="Body_Medium">{getDisplayUrl(url)}</MonoText>
                </LinkItem>
              ))}
              {contactEmail ? (
                <LinkItem href={`mailto:${contactEmail}`}>
                  <LinkIcon {...ICON_SIZE} color={ICON_COLOR} />
                  <MonoText $use="Body_Medium">{contactEmail}</MonoText>
                </LinkItem>
              ) : null}
            </LinksList>
          </Section>
        )}

        <ShareButton type="button" aria-label={t(COMMON.share)} onClick={share}>
          <ShareIcon width={18} height={18} />
          <MonoText $use="Body_Medium">{t(COMMON.share)}</MonoText>
        </ShareButton>
      </CreatorInfoContent>

      <ShareModal
        visible={showShareModal}
        url={shareUrl}
        onClose={() => setShowShareModal(false)}
      />
    </GenericModal>
  );
}
