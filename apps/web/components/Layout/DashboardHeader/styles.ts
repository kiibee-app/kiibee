import { MonoText } from "@/components/UI/Monotext";
import { avatarFrameCss } from "@/components/Feature/ProfileLayout/pageStyles";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import Link from "next/link";

export const HeaderWrapper = styled.header`
  height: 70px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  padding: 18px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.GRAY};

  ${media.desktop} {
    padding: 12px 16px;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;
  gap: 10px;

  ${media.desktop} {
    padding-left: 0;
  }
`;

export const HamburgerButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.primary.GRAY};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  padding: 0;

  ${media.desktop} {
    display: inline-flex;
  }
`;

export const HamburgerLine = styled.span`
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  ${media.tablet} {
    position: absolute;
    right: 12px;
  }
`;

export const Divider = styled.span`
  width: 1px;
  height: 54px;
  background: ${({ theme }) => theme.colors.primary.GRAY};

  ${media.tablet} {
    display: none;
  }
`;

export const EmailWrapper = styled.div`
  margin-right: 10px;

  ${media.tablet} {
    display: none;
  }
`;

export const ProfileCircle = styled.div`
  ${avatarFrameCss};
  background: ${({ theme }) => theme.colors.gradient.PALE_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InitialAvatar = styled(MonoText).attrs({
  $use: "H4_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const LogoButton = styled.button`
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;
export const ChannelText = styled(MonoText)`
  ${media.tablet} {
    display: none;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 42px;

  ${media.tablet} {
    display: none;
  }
`;

export const NavItem = styled(Link)`
  ${({ theme }) => theme.typography.Body_Medium};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  cursor: pointer;
  transition: opacity 0.2s;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
  }
`;

export const ProfileButton = styled.button`
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gradient.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.H4_SemiBold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

export const ChannelLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export const RightProfileWrapper = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  border: none;
  background: transparent;
  padding: 0;

  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;
