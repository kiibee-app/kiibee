import styled, { css } from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { media } from "@repo/ui/breakpoints";
import { TONE_DARK, TONE_LIGHT } from "@/utils/Constants";

export const avatarFrameCss = css`
  position: relative;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border-radius: 8px;
  flex: 0 0 auto;
`;

export const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  background: ${({ theme }) => theme.colors.primary.WHITE};
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  min-width: 0;

  ${media.mobileMd} {
    max-width: calc(100vw - 92px);
  }
`;

export const BrandAvatar = styled.span`
  ${avatarFrameCss};
`;

export const BrandAvatarImage = styled(Image)`
  object-fit: cover;
`;

export const BrandName = styled.span<{
  $textTone?: typeof TONE_DARK | typeof TONE_LIGHT;
}>`
  display: block;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme, $textTone }) =>
    $textTone === TONE_LIGHT
      ? theme.colors.primary.WHITE_90
      : theme.colors.primary.BLACK};

  ${media.mobileMd} {
    max-width: 100%;
  }
`;

export const MobileProfileTriggerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
`;

export const MobileProfileTriggerAvatar = styled.span`
  ${avatarFrameCss};
  width: 36px;
  height: 36px;
  border-radius: 8px;
`;
