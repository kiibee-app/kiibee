import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.secondary.MEDIUM_GREEN};
  padding: 3.5rem 0 1rem;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Heading = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.BLACK};

  ${media.tablet} {
    font-size: 32px;
  }
`;

export const Sub = styled.p`
  margin: 0 0 1.75rem 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  font-size: 20px;
  line-height: 1.6;
  padding: 1rem 0;

  ${media.tablet} {
    font-size: 0.95rem;
  }
`;

export const CTAWrap = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;
