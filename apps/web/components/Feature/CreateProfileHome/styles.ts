import styled from "styled-components";
import Link from "next/link";

export const Page = styled.main`
  min-height: 100vh;
  padding: 0 0 56px;
  width: 100%;
  background:
    radial-gradient(
      circle at top left,
      ${({ theme }) => theme.colors.gredint.FRAME_GLOW},
      ${({ theme }) => theme.colors.gredint.TRANSPARENT} 32%
    ),
    radial-gradient(
      circle at top right,
      ${({ theme }) => theme.colors.gredint.CARD_SHADOW},
      ${({ theme }) => theme.colors.gredint.TRANSPARENT} 28%
    ),
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.neutral.GRAY_100} 0%,
      ${({ theme }) => theme.colors.neutral.OFF_WHITE} 100%
    );
`;

export const HeroFrame = styled.section`
  position: relative;
  width: 100vw;
  max-width: none;
  height: 500px;
  margin: 0;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
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

export const StoryPanel = styled.aside`
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 12px;
  width: min(620px, calc(100% - 220px));
  padding: 50px 110px;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral.GRAY_300} 0%,
    ${({ theme }) => theme.colors.neutral.GRAY_250} 22%,
    ${({ theme }) => theme.colors.gredint.TRANSPARENT} 100%
  );

  @media (max-width: 1200px) {
    width: min(560px, calc(100% - 140px));
    padding: 44px 70px;
  }

  @media (max-width: 900px) {
    width: min(100%, 520px);
    padding: 32px 28px;
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
`;

export const HeroMedia = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  img {
    filter: saturate(0.95) contrast(0.96);
  }
`;
