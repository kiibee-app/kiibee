import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary.GREEN_50};
  padding: 3.5rem 0;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  ${media.tablet} {
    grid-template-columns: 1fr;
    padding: 2rem 1.25rem;
    gap: 1.5rem;
  }
`;

export const ImgWrap = styled.div`
  position: relative;
  width: 93%;
  height: 530px;
  border-radius: 10px;
  overflow: hidden;

  ${media.tablet} {
    height: 300px;
    width: 100%;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${media.tablet} {
    align-items: center;
  }
`;

export const Title = styled.h2`
  margin: 0;

  ${media.tablet} {
    text-align: center;
    font-size: 28px;
  }
`;

export const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary.BLACK};
  max-width: 595px;
  ${({ theme }) => theme.typography.Body_Regular};

  ${media.tablet} {
    max-width: 100%;
    text-align: center;
  }
`;

export const CTAWrap = styled.div`
  margin-top: 1rem;
`;
