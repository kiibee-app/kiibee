import { HeaderProps, NavStyleProps } from "@/utils/profile";
import styled, { css } from "styled-components";
import Link from "next/link";

export const Header = styled.header<HeaderProps>`
  position: ${({ $position }) => $position};
  top: ${({ $topOffset }) => $topOffset};
  left: 0;
  width: 100%;
  min-height: ${({ $isMegaOpen }) =>
    $isMegaOpen ? "300px" : "var(--navbar-height)"};
  display: block;
  backdrop-filter: blur(24px);
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

  a,
  button {
    color: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.neutral.OFF_WHITE
        : theme.colors.primary.BLACK};
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    white-space: nowrap;
    transition:
      background 120ms ease,
      color 120ms ease;
  }

  button {
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
  }

  a:hover,
  button:hover {
    background: ${({ theme }) => theme.colors.primary.WHITE_18};
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export const NavItemWrapper = styled.div`
  position: relative;
  display: inline-block;

  a,
  button {
    display: inline-block;
  }
`;

export const MegaMenu = styled.div`
  position: fixed;
  top: calc(var(--navbar-height, 73px) + var(--navbar-top-offset, 0px));
  left: 0;
  width: 100%;
  padding: 1.5rem 0;
  min-height: 300px;
  backdrop-filter: blur(16px) saturate(30%);
  background: transparent;
  transition:
    background 180ms ease,
    backdrop-filter 180ms ease;
  pointer-events: none;
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
  pointer-events: auto;

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

export const Actions = styled.div<{ $textTone: "dark" | "light" }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 1rem;
  flex-wrap: wrap;

  .login-btn {
    color: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.neutral.OFF_WHITE
        : theme.colors.primary.BLACK};
    border-color: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.neutral.OFF_WHITE
        : theme.colors.primary.BLACK};
  }

  .login-btn:hover {
    background: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.neutral.OFF_WHITE
        : theme.colors.primary.BLACK};
    color: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.OFF_WHITE};
  }

  .start-btn {
    color: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.OFF_WHITE};
    background: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.neutral.OFF_WHITE
        : theme.colors.primary.BLACK};
    border-color: ${({ theme }) => theme.colors.primary.BLACK};
  }

  .start-btn:hover {
    color: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.primary.BLACK
        : theme.colors.neutral.OFF_WHITE};
    background: ${({ theme, $textTone }) =>
      $textTone === "light"
        ? theme.colors.neutral.OFF_WHITE
        : theme.colors.primary.BLACK};
    border-color: ${({ theme }) => theme.colors.primary.BLACK};
    opacity: 1;
    transform: none;
  }

  @media (max-width: 640px) {
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
    gap: 0.5rem;
    order: 2;
  }
`;

export const NavAccountHost = styled.div<{ $open?: boolean }>`
  position: relative;
  display: inline-flex;
  z-index: ${({ $open }) => ($open ? 1200 : "auto")};
`;

export const NavAccountDropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  z-index: 1100;
  min-width: 200px;
  padding: 8px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY_300};
  box-shadow:
    0 4px 6px rgba(15, 23, 42, 0.04),
    0 16px 40px rgba(15, 23, 42, 0.12);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: navAccountMenuIn 160ms ease;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -10px;
    height: 10px;
  }

  @keyframes navAccountMenuIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const navAccountMenuItemStyles = css`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  text-align: left;
  ${({ theme }) => theme.typography.Body_Medium};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.GRAY};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary.BLACK};
    outline-offset: -2px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const NavAccountMenuItem = styled(Link)`
  ${navAccountMenuItemStyles}
`;

export const NavAccountMenuButton = styled.button`
  ${navAccountMenuItemStyles}
`;

export const NavAccountMenuIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
`;

export const NavAccountMenuDivider = styled.div`
  height: 1px;
  margin: 2px 4px;
  background: ${({ theme }) => theme.colors.neutral.GRAY_300};
`;

export const NavAccountTriggerWrap = styled.div<{ $open?: boolean }>`
  display: inline-flex;
  border-radius: 10px;
  box-shadow: ${({ $open, theme }) =>
    $open ? `0 0 0 2px ${theme.colors.primary.BLACK}` : "none"};
  transition: box-shadow 0.15s ease;
`;
