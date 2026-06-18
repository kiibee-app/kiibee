import styled, { css } from "styled-components";
import Image from "next/image";
import { MonoText } from "@/components/UI/Monotext";

const imageCoverStyles = css`
  object-fit: cover;
  object-position: center;
`;

export const HeroWrapper = styled.section`
  width: 100%;
  max-width: 100%;
  margin: 70px auto 0;
  padding: 20px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const HeroWrapperCentered = styled.section`
  width: 100%;
  margin-top: 70px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;

export const CoverFrame = styled.div`
  position: relative;
  width: min(100%, 1380px);
  margin: 0 auto;
  height: 265px;
  overflow: hidden;
  border-radius: 22px;

  ${({ theme }) => theme.media.desktopSm} {
    height: 220px;
    border-radius: 18px;
  }

  ${({ theme }) => theme.media.mobileMd} {
    height: 170px;
    border-radius: 14px;
  }
`;

export const CoverFrameFull = styled.div`
  position: relative;
  width: 100%;
  height: 290px;
  overflow: hidden;

  ${({ theme }) => theme.media.desktopSm} {
    height: 250px;
  }

  ${({ theme }) => theme.media.mobileMd} {
    height: 210px;
  }
`;

export const CoverImage = styled(Image)`
  ${imageCoverStyles}
`;

export const AvatarImage = styled(Image)`
  ${imageCoverStyles}
`;

export const ContentInner = styled.div`
  width: min(100%, 1380px);
  margin: 0 auto;
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  margin-top: 25px;
  padding: 0 6px;

  ${({ theme }) => theme.media.desktopSm} {
    gap: 16px;
    margin-top: 20px;
  }

  ${({ theme }) => theme.media.mobileMd} {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
  }
`;

export const AvatarWrap = styled.div`
  position: relative;
  width: 152px;
  height: 152px;
  margin-top: -25px;
  border-radius: 50%;
  overflow: hidden;
  border: 8px solid ${({ theme }) => theme.colors.neutral.OFF_WHITE};
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};
  flex: 0 0 auto;

  ${({ theme }) => theme.media.desktopSm} {
    width: 130px;
    height: 130px;
    margin-top: -20px;
    border-width: 6px;
  }

  ${({ theme }) => theme.media.mobileMd} {
    width: 108px;
    height: 108px;
    margin-top: -16px;
    border-width: 5px;
  }
`;

export const AvatarWrapCentered = styled.div`
  position: relative;
  width: 170px;
  height: 170px;
  margin-top: -82px;
  border-radius: 999px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.GRAY_200};

  ${({ theme }) => theme.media.mobileMd} {
    width: 136px;
    height: 136px;
    margin-top: -66px;
    border-width: 6px;
  }
`;

export const ProfileMeta = styled.div`
  padding-bottom: 8px;
  max-width: 760px;

  ${({ theme }) => theme.media.mobileMd} {
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
  padding: 0 6px 12px;

  ${({ theme }) => theme.media.mobileMd} {
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
  margin: 70px 0 0;
  padding: 0 10px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${({ theme }) => theme.media.desktopSm} {
    height: 460px;
  }

  ${({ theme }) => theme.media.mobileMd} {
    height: 420px;
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

  ${({ theme }) => theme.media.mobileMd} {
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
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral.GRAY_300} 0%,
    ${({ theme }) => theme.colors.neutral.GRAY_250} 22%,
    ${({ theme }) => theme.colors.gradient.TRANSPARENT} 100%
  );

  ${({ theme }) => theme.media.desktopMd} {
    width: min(560px, 100%);
    padding: 44px 0;
  }

  ${({ theme }) => theme.media.desktopSm} {
    width: min(100%, 520px);
    padding: 32px 0;
  }

  ${({ theme }) => theme.media.mobileMd} {
    width: 100%;
    padding: 24px 0 18px;
    gap: 8px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.neutral.GRAY_300} 0%,
      ${({ theme }) => theme.colors.neutral.GRAY_250} 14%,
      ${({ theme }) => theme.colors.gradient.TRANSPARENT} 100%
    );
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
`;

export const StoryDescription = styled.div`
  max-width: 520px;
  margin-top: 0;

  ${({ theme }) => theme.media.mobileMd} {
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

export const HeroMedia = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  img {
    filter: saturate(0.95) contrast(0.96);
  }

  ${({ theme }) => theme.media.mobileMd} {
    img {
      object-position: center top;
    }
  }
`;
