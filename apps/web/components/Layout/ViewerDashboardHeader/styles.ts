import Link from "next/link";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const HeaderWrapper = styled.header`
  height: 70px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  padding: 14px 24px;
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
  gap: 10px;

  ${media.tablet} {
    min-width: 0;
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

export const LogoButton = styled.button`
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
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

export const Right = styled.div`
  min-width: 180px;
  display: flex;
  justify-content: flex-end;

  ${media.tablet} {
    min-width: 0;
  }
`;

export const ProfileButton = styled.button`
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gradient.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  ${({ theme }) => theme.typography.H4_SemiBold};
  cursor: pointer;
`;
