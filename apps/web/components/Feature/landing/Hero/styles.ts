import styled from "styled-components";
import breakpoints from "../../../../../../packages/ui/src/breakpoints";

export const Hero = styled.section`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  min-height: 95vh;

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
  max-width: 1440px;
  margin: 0 auto;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @media (max-width: calc(${breakpoints.tablet} - 1px)) {
    padding: 3rem 1.25rem;
    align-items: center;
    justify-content: center;
  }
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
  font-weight: 600;
  max-width: 64px;
  line-height: 1.02;
  font-size: clamp(2.25rem, 6vw, 4rem);
  max-width: 58rem;
`;

export const Subtitle = styled.p`
  margin: 0 0 2rem 0;
  max-width: 32rem;
  font-weight: 500;
  font-size: 20px;
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
