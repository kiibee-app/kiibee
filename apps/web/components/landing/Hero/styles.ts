import styled from "styled-components";

export const Hero = styled.section`
  width: 100%;
  position: relative;
  display: block;
  min-height: 95vh;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
  }
`;

export const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: calc(20rem + 72px) 2rem 6rem 2rem;
  position: relative;
  z-index: 3;
`;

export const Background = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: -72px;
  height: calc(100% + 72px);
  z-index: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.WHITE};

  @media (min-width: 640px) {
    align-items: flex-start;
    text-align: left;
    padding-left: 2rem;
  }
`;

export const Title = styled.h1`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  font-weight: 700;
  line-height: 1.02;
  font-size: clamp(2.25rem, 6vw, 4rem);
  max-width: 58rem;
`;

export const Subtitle = styled.p`
  margin: 0 0 2rem 0;
  max-width: 32rem;
  font-size: clamp(1rem, 2.2vw, 1.125rem);
  color: ${({ theme }) => theme.colors.primary.WHITE_90};
`;

export const CTAWrap = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 24rem;
  justify-content: center;

  @media (min-width: 640px) {
    justify-content: flex-start;
  }
`;

export const Primary = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  padding: 0 1.25rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary.BLACK_90};
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-decoration: none;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
`;

export const Secondary = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  padding: 0 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary.WHITE_18};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  text-decoration: none;
`;
