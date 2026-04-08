import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const SectionWrapper = styled.section`
  background: ${({ theme }) => theme.colors.primary.GREEN_100};
  padding: 80px 0;
`;

export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary.PALE_GREEN};
  font-size: 40px;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 25px;
`;

export const Subtitle = styled.div`
  max-width: 800px;
  margin-bottom: 50px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Card = styled.div`
  position: relative;
  width: 100%;
  min-height: 18.35938rem;
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const Text = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  margin-bottom: 12px;
`;
