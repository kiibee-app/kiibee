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
  margin: 60px auto 0;
  padding: 14px 110px 0;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${({ theme }) => theme.media.desktopMd} {
    padding: 14px 72px 0;
  }

  ${({ theme }) => theme.media.desktopSm} {
    padding: 12px 28px 0;
  }

  ${({ theme }) => theme.media.mobileLg} {
    padding: 10px 16px 0;
  }
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

export const ProfileMeta = styled.div`
  padding-bottom: 8px;
  max-width: 760px;

  ${({ theme }) => theme.media.mobileMd} {
    padding-bottom: 0;
  }
`;

export const CreatorName = styled.h1`
  margin: 0;
`;

export const CreatorNameText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Heading2",
  color: theme.colors.primary.BLACK,
}))``;

export const UploadCount = styled.p`
  margin: 10px 0 0;
`;

export const UploadCountText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_Medium",
  color: theme.colors.neutral.GRAY_500,
}))``;

export const CreatorBio = styled.p`
  margin: 10px 0 0;
  max-width: 700px;
`;

export const CreatorBioText = styled(MonoText).attrs(({ theme }) => ({
  $use: "Body_Medium",
  color: theme.colors.neutral.GRAY_500,
}))``;

export const MoreText = styled.span`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const MoreTextLabel = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;

  ${MonoText} {
    text-decoration: underline;
  }
`;

export const TabsWrapper = styled.div`
  margin-top: 24px;
  padding: 0 6px 12px;

  ${({ theme }) => theme.media.mobileMd} {
    margin-top: 16px;
    padding-bottom: 10px;
  }
`;
