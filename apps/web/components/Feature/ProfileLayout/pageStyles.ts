import styled, { css } from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { media } from "@repo/ui/breakpoints";
import { TONE_DARK, TONE_LIGHT } from "@/utils/Constants";

type CreatorButtonColorProps = {
  $buttonColor?: string | null;
  $buttonTextColor?: string;
};

const creatorButtonColorCss = css<CreatorButtonColorProps>`
  ${({ $buttonColor, $buttonTextColor }) =>
    $buttonColor &&
    css`
      &&
        :is(
          [data-creator-content-button],
          [data-creator-collection] [data-variant],
          [data-creator-join-button]
        ) {
        background: ${$buttonColor};
        border-color: ${$buttonColor};
        color: ${$buttonTextColor};
      }

      &&
        :is(
          [data-creator-content-button],
          [data-creator-collection] [data-variant],
          [data-creator-join-button]
        )
        * {
        color: inherit;
      }

      &&
        :is(
          [data-creator-content-button],
          [data-creator-collection] [data-variant],
          [data-creator-join-button]
        ):not([type="submit"]):hover {
        background: ${$buttonColor};
        border-color: ${$buttonColor};
        color: ${$buttonTextColor};
      }
    `}
`;

export const avatarFrameCss = css`
  position: relative;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border-radius: 50%;
  flex: 0 0 auto;
  background: ${({ theme }) => theme.colors.gradient.PALE_GREEN};
`;

export const Page = styled.main<
  CreatorButtonColorProps & {
    $textColor?: string | null;
  }
>`
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  display: flow-root;

  ${({ $textColor }) =>
    $textColor &&
    css`
      [data-creator-cover-text],
      [data-creator-cover-text] * {
        color: ${$textColor};
      }
    `}

  ${creatorButtonColorCss}
`;

export const BrandWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  ${media.mobileXl} {
    max-width: calc(100vw - 140px);
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
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
  ${avatarFrameCss};
`;

export const BrandAvatarImage = styled(Image)`
  object-fit: contain;
  object-position: center;
  width: 100%;
  height: 100%;
  padding: 12% 8%;
  box-sizing: border-box;
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

  & * {
    color: inherit;
  }

  ${media.mobileXl} {
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
`;
