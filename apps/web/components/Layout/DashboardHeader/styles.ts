import { MonoText } from "@/components/UI/Monotext";
import Link from "next/link";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { USER_ROLES, UserRole } from "@/utils/Constants";

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

  ${media.tablet} {
    padding: 12px;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  min-width: 180px;
  padding-left: 16px;
  gap: 10px;

  ${media.tablet} {
    min-width: 0;
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

  ${media.tablet} {
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
  gap: 12px;
  min-width: 180px;
  justify-content: flex-end;

  ${media.tablet} {
    min-width: 0;
    position: absolute;
    right: 12px;
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
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.gredint.PALE_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
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

export const RoleRight = styled.div<{ $role: UserRole }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $role }) => ($role === USER_ROLES.CREATOR ? "12px" : "0")};
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: transparent;
  padding: 0;
`;
export const ChannelText = styled(MonoText)`
  ${media.tablet} {
    display: none;
  }
`;
