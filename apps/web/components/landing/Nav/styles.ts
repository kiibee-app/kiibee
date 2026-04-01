import styled from "styled-components";

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  display: block;
  backdrop-filter: blur(3px);
  background: rgba(255, 255, 255, 0.6);
  z-index: 50;
`;

export const Inner = styled.div`
  max-width: 72rem;
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
  letter-spacing: -0.02em;
  color: black;
`;

export const Nav = styled.nav`
  display: none;
  gap: 2rem;
  align-items: center;
  font-size: 0.875rem;
  color: #374151;

  a {
    text-decoration: none;
    color: inherit;
    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: 768px) {
    display: flex;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  a.login {
    font-size: 0.875rem;
    color: #374151;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const CTA = styled.a`
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  &:hover {
    opacity: 0.95;
  }
`;
