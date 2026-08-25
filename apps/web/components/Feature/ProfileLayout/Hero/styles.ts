import styled, { css } from "styled-components";
import Image from "next/image";
import { MonoText } from "@/components/UI/Monotext";
import { profileNavShellProps } from "@/utils/Constants";

const imageContainStyles = css`
  object-fit: contain;
  object-position: center;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

const layoutAlignCss = css`
  width: 100%;
  max-width: ${profileNavShellProps.innerMaxWidth};
  margin: 0 auto;
  padding: 0 110px;
  box-sizing: border-box;

  ${({ theme }) => theme.media.desktop} {
    padding: 0 28px;
  }

  ${({ theme }) => theme.media.mobileXl} {
    padding: 0 16px;
  }
`;

export const HeroWrapper = styled.section`
  width: 100%;
  max-width: 100%;
  margin: 70px auto 0;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const HeroWrapperCentered = styled.section`
  width: 100%;
  margin-top: 0;
  padding: 0;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const CoverFrame = styled.div`
  ${layoutAlignCss};
`;

export const CoverMedia = styled.div`
  position: relative;
  height: 360px;
  overflow: hidden;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${({ theme }) => theme.media.desktopMd} {
    height: 310px;
  }

  ${({ theme }) => theme.media.desktopSm} {
    height: 260px;
    border-radius: 18px;
  }

  ${({ theme }) => theme.media.mobileXl} {
    height: 190px;
    border-radius: 14px;
  }
`;

export const CoverFrameFull = styled.div`
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${({ theme }) => theme.media.desktopMd} {
    height: 420px;
  }

  ${({ theme }) => theme.media.desktopSm} {
    height: 350px;
  }

  ${({ theme }) => theme.media.mobileXl} {
    height: 260px;
  }
`;

export const CoverImage = styled(Image)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const CoverInitial = styled(MonoText).attrs(({ theme }) => ({
  $use: "Heading1",
  color: theme.colors.primary.BLACK,
}))`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gradient.PALE_GREEN};
  user-select: none;
`;

export const CoverImageTop = styled(CoverImage)`
  object-position: center;
`;

export const AvatarImage = styled(Image)`
  ${imageContainStyles}
`;

export const ContentInner = styled.div`
  ${layoutAlignCss};
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  margin-top: 28px;
  padding: 0;

  ${({ theme }) => theme.media.desktopSm} {
    gap: 16px;
    margin-top: 24px;
  }

  ${({ theme }) => theme.media.mobileXl} {
    align-items: center;
    flex-direction: column-reverse;
    gap: 12px;
    margin-top: 20px;
  }
`;

export const AvatarWrap = styled.div`
  position: relative;
  width: 9.5rem;
  height: 9.5rem;
  margin-top: 0;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  flex: 0 0 auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  ${({ theme }) => theme.media.desktopSm} {
    width: 8.125rem;
    height: 8.125rem;
    margin-top: 0;
  }

  ${({ theme }) => theme.media.mobileXl} {
    width: 6.75rem;
    height: 6.75rem;
    margin-top: 0;
  }
`;

export const AvatarWrapCentered = styled.div`
  position: relative;
  width: 170px;
  height: 170px;
  margin-top: -82px;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  ${({ theme }) => theme.media.mobileXl} {
    width: 136px;
    height: 136px;
    margin-top: -66px;
  }
`;
export const ProfileMeta = styled.div`
  padding-bottom: 8px;
  max-width: 760px;

  ${({ theme }) => theme.media.mobileXl} {
    padding-bottom: 0;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 16px 36px;
`;

export const CreatorName = styled.h1`
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

export const CreatorNameText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Heading2",
  color: theme.colors.primary.BLACK,
}))``;

export const NameText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Heading2",
  color: theme.colors.primary.BLACK,
}))`
  margin-top: 22px;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

export const UploadCount = styled.p`
  margin: 10px 0 0;
`;

export const UploadCountText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_Medium",
  color: theme.colors.neutral.GRAY_500,
}))``;

export const UploadsText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_Medium",
  color: theme.colors.neutral.GRAY_500,
}))`
  margin-top: 8px;
`;

export const CreatorBio = styled.div`
  margin: 10px 0 0;
  max-width: 700px;
`;

export const CreatorBioText = styled.div`
  max-height: 2.4em;
  overflow: hidden;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
`;

export const MoreTextLabel = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_SemiBold",
  color: theme.colors.primary.BLACK,
}))`
  cursor: pointer;
  margin-top: 2px;
`;

export const BioText = styled.div`
  margin-top: 10px;
  max-width: 540px;
  max-height: 2.4em;
  overflow: hidden;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.neutral.GRAY_500};
`;

export const BioMoreButton = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_SemiBold",
  color: theme.colors.primary.BLACK,
}))`
  cursor: pointer;
  margin-top: 2px;
`;

export const MoreText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const TabsWrapper = styled.div`
  margin-top: 24px;
  padding: 0 0 12px;

  ${({ theme }) => theme.media.mobileXl} {
    margin-top: 16px;
    padding-bottom: 10px;
  }
`;

export const TabsWrapperCentered = styled.div`
  margin: 15px auto;
  display: flex;
  justify-content: center;
  width: 100%;
`;

/* --- Variant 2: story hero --- */

export const HeroFrame = styled.section`
  position: relative;
  width: 100%;
  height: 500px;
  margin: 0 0 48px;
  padding: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${({ theme }) => theme.media.desktopSm} {
    height: 460px;
    margin-bottom: 36px;
  }

  ${({ theme }) => theme.media.mobileXl} {
    height: 420px;
    margin-bottom: 24px;
  }
`;

export const HeroGrid = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 0 73px;
  display: flex;
  align-items: flex-end;

  ${({ theme }) => theme.media.tablet} {
    padding: 0 73px;
  }

  ${({ theme }) => theme.media.desktopMd} {
    padding: 0 73px;
  }

  ${({ theme }) => theme.media.desktopSm} {
    padding: 0 28px;
  }

  ${({ theme }) => theme.media.mobileXl} {
    padding: 0 10px;
  }
`;

export const StoryPanel = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 12px;
  width: min(620px, 100%);
  padding: 50px 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  background: none;

  ${({ theme }) => theme.media.desktopMd} {
    width: min(560px, 100%);
    padding: 44px 0;
  }

  ${({ theme }) => theme.media.desktopSm} {
    width: min(100%, 520px);
    padding: 32px 0;
  }

  ${({ theme }) => theme.media.mobileXl} {
    width: 100%;
    padding: 24px 0 18px;
    gap: 8px;
  }
`;

export const StoryMeta = styled.div`
  margin-bottom: 0;
`;

export const StoryUploadsText = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0;
`;

export const StoryTitle = styled.h1`
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

export const StoryDescription = styled.div`
  max-width: 520px;
  margin-top: 0;

  ${({ theme }) => theme.media.mobileXl} {
    max-width: 100%;
  }
`;

export const StoryBioText = styled.div`
  max-height: 2.4em;
  overflow: hidden;
  word-break: break-word;
`;

export const StoryMoreButton = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_SemiBold",
  color: theme.colors.primary.WHITE,
}))`
  cursor: pointer;
  margin-top: 2px;
`;

export const HeroMedia = styled.div<{ $hasImage?: boolean }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: ${({ $hasImage, theme }) =>
    $hasImage ? theme.colors.neutral.WHITE : theme.colors.gradient.PALE_GREEN};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ theme }) =>
      `linear-gradient(262deg, ${theme.colors.gradient.TRANSPARENT} 36.41%, ${theme.colors.primary.BLACK_90} 100%)`};
    pointer-events: none;
    z-index: 1;
    display: ${({ $hasImage }) => ($hasImage ? "block" : "none")};
  }

  img {
    filter: saturate(0.95) contrast(0.96);
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    background: ${({ theme }) => theme.colors.neutral.WHITE};
  }
`;
