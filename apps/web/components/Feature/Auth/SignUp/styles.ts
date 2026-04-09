import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const Container = styled.section`
  width: 100%;
  position: relative;
  display: flex;
  align-items: stretch;
  height: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primary.WHITE};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
  }
`;

export const Inner = styled.div`
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  align-items: stretch;
  gap: 4rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.tablet} {
    justify-content: center;
  }
`;

export const Right = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 95vh;
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  overflow: hidden;

  ${media.tablet} {
    display: none;
  }
`;

export const CardsWrap = styled.div`
  position: relative;
  width: min(390px, 100%);
  height: 420px;

  ${media.tablet} {
    width: 100%;
    max-width: 360px;
    height: 390px;
  }
`;

export const BackCard = styled.div`
  position: absolute;
  top: 24px;
  left: 18px;
  width: 230px;
  z-index: 1;

  img {
    display: block;
  }
`;

export const FrontCard = styled.div`
  position: absolute;
  top: 84px;
  left: 128px;
  width: 230px;
  z-index: 2;

  img {
    display: block;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;

  ${media.tablet} {
    align-items: center;
    text-align: center;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  max-width: 100%;
  color: #1a1a1a;

  ${media.tablet} {
    font-size: 2rem;
  }

  ${media.mobile} {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.15rem;
  line-height: 1.6;
  color: #505050;
  margin-bottom: 5rem;
  max-width: 100%;

  ${media.tablet} {
    font-size: 1rem;
  }
`;

export const CTAWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;

  ${media.tablet} {
    width: 100%;
    max-width: 400px;
  }

  a {
    width: 100%;
  }
`;

export const AccountText = styled.p`
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.primary.BLACK_90};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
`;

export const LoginLink = styled.a`
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 1rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
`;
