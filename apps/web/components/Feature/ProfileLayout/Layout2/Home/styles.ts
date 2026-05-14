import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

export const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  background: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const HeroFrame = styled.section`
  position: relative;
  width: 100%;
  height: 500px;
  margin: 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};

  ${({ theme }) => theme.media.desktopSm} {
    height: 460px;
  }

  ${({ theme }) => theme.media.mobileMd} {
    height: 420px;
  }
`;

export const TopBar = styled.header`
  position: absolute;
  inset: 0 0 auto 0;
  z-index: 3;
  height: 70px;
  display: grid;
  grid-template-columns: minmax(220px, 1.2fr) auto auto;
  align-items: center;
  gap: 20px;
  padding: 0 24px;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.gredint.BLACK_90},
    ${({ theme }) => theme.colors.gredint.OVERLAY_TOP_MID}
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.WHITE_10};

  @media (max-width: 960px) {
    grid-template-columns: 1fr auto;
    height: auto;
    padding: 16px;
    row-gap: 14px;
  }
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  min-width: 0;
`;

export const BrandAvatar = styled.span`
  position: relative;
  width: 38px;
  height: 38px;
  overflow: hidden;
  border-radius: 10px;
  flex: 0 0 auto;
  box-shadow: 0 8px 18px ${({ theme }) => theme.colors.neutral.GRAY_300};
`;

export const BrandAvatarImage = styled(Image)`
  object-fit: cover;
`;

export const BrandName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.primary.WHITE_90};
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
  padding: 0 110px;
  display: flex;
  align-items: flex-end;

  ${({ theme }) => theme.media.desktopMd} {
    padding: 0 70px;
  }

  ${({ theme }) => theme.media.desktopSm} {
    padding: 0 28px;
  }

  ${({ theme }) => theme.media.mobileMd} {
    padding: 0 16px;
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
    ${({ theme }) => theme.colors.gredint.TRANSPARENT} 100%
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
      ${({ theme }) => theme.colors.gredint.TRANSPARENT} 100%
    );
  }
`;

export const StoryMeta = styled.div`
  margin-bottom: 0;
`;

export const UploadsText = styled.div`
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
