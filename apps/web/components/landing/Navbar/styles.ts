import styled from "styled-components";

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  display: block;
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.1);
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
`;

export const Nav = styled.nav`
  display: none;
  gap: 1.25rem;

  a {
    color: rgba(0, 0, 0, 0.85);
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    transition:
      background 120ms ease,
      color 120ms ease;
  }

  a:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  @media (min-width: 640px) {
    display: flex;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .login {
    color: rgba(0, 0, 0, 0.8);
    text-decoration: none;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
  }
`;
