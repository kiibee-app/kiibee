import { HeaderProps, NavStyleProps } from "@/utils/profile";
import styled, { css } from "styled-components";

export const Header = styled.header<HeaderProps>`
  --navbar-height: ${({ $navbarHeight }) => $navbarHeight ?? "74"};
  position: ${({ $position }) => $position};
  top: ${({ $topOffset }) => $topOffset};
  left: 0;
  width: 100%;
  min-height: var(--navbar-height);
  display: block;
  backdrop-filter: blur(28px);
  background: ${({ theme }) => theme.colors.primary.WHITE_10};
  transition:
    background 180ms ease,
    backdrop-filter 180ms ease;
  z-index: 50;

  @media (max-width: 640px) {
    height: auto;
  }
`;

export const Inner = styled.div`
  max-width: var(--navbar-inner-max-width, 1440px);
  width: 100%;
  margin: 0 auto;
  padding: var(--navbar-inner-padding, 1rem 1.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1024px) {
    padding: var(--navbar-inner-tablet-padding, 0.9rem 1.5rem);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    padding: var(--navbar-inner-mobile-padding, 0.75rem 1rem);
    gap: 0.5rem;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const Logo = styled.span`
  font-weight: 700;
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.Heading1.fontFamily};
`;

export const Nav = styled.nav<NavStyleProps>`
  display: flex;
  gap: 1.25rem;
  align-items: center;
  flex-wrap: nowrap;
  ${({ $navPosition }) =>
    $navPosition === "right"
      ? css`
          margin-left: auto;
          justify-content: flex-end;
        `
      : css`
          justify-content: center;
        `}

  a {
    color: ${({ theme }) => theme.colors.primary.BLACK};
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    white-space: nowrap;
    transition:
      background 120ms ease,
      color 120ms ease;
  }

  a:hover {
    background: ${({ theme }) => theme.colors.primary.WHITE_18};
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const NavItemWrapper = styled.div`
  position: relative;
  display: inline-block;

  a {
    display: inline-block;
  }
`;

export const MegaMenu = styled.div`
  position: fixed;
  top: calc(var(--navbar-height, 108px) + var(--navbar-top-offset, 0px));
  left: 0;
  width: 100%;
  padding: 1.5rem 0;
  backdrop-filter: blur(28px);
  background: ${({ theme }) => theme.colors.primary.WHITE_80};
  transition:
    background 180ms ease,
    backdrop-filter 180ms ease;
  box-shadow: 0 6px 24px ${({ theme }) => theme.colors.neutral.GRAY_300};
  pointer-events: auto;
  z-index: 1000;
`;

export const MegaInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 32px 40px;
  align-items: start;
  padding: 0 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`;

export const MegaColumn = styled.div`
  min-width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const ColumnTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
  padding-left: 5px;
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ColumnItem = styled.a`
  display: block;
  padding: 5px !important;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  text-decoration: none;
  transition:
    color 120ms ease,
    transform 120ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.BLACK};
    transform: translateX(0px);
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 1rem;
  flex-wrap: wrap;

  .login {
    color: ${({ theme }) => theme.colors.primary.BLACK};
    text-decoration: none;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
  }

  @media (max-width: 640px) {
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
    gap: 0.5rem;
    order: 2;
  }
`;
