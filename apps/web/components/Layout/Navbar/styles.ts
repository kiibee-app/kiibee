import styled from "styled-components";

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  display: block;
  backdrop-filter: blur(28px);
  background: ${({ theme }) => theme.colors.primary.WHITE_10};
  transition:
    background 180ms ease,
    backdrop-filter 180ms ease;
  z-index: 50;
`;

export const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Logo = styled.span`
  font-weight: 700;
  font-size: 1.125rem;
  font-family: ${({ theme }) => theme.typography.Heading1.fontFamily};
`;

export const Nav = styled.nav`
  display: none;
  gap: 1.25rem;

  a {
    color: ${({ theme }) => theme.colors.primary.BLACK};
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    transition:
      background 120ms ease,
      color 120ms ease;
  }

  a:hover {
    background: ${({ theme }) => theme.colors.primary.WHITE_18};
  }

  @media (min-width: 640px) {
    display: flex;
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
  top: 72px;
  left: 0;
  width: 100%;
  padding: 1.5rem 0;
  background: ${({ theme }) => theme.colors.primary.WHITE_10};
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
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

  .login {
    color: ${({ theme }) => theme.colors.primary.BLACK};
    text-decoration: none;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
  }
`;
