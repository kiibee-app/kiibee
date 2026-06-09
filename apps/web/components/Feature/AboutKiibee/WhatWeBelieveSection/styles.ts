import styled from "styled-components";
import { type CSSProperties } from "react";
import { media } from "@repo/ui/breakpoints";

export const SectionWrapper = styled.section`
  width: 100%;
  padding: 0rem 1.25rem 4.5rem;
  background: ${({ theme }) => theme.colors.neutral.WHITE};
`;
export const Inner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1.25rem;
`;

export const Container = styled.div`
  max-width: 1218px;
  width: 100%;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.neutral.BLACK};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 115px;
  align-items: center;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.Heading2};
  font-weight: 600;
  line-height: normal;
  margin-bottom: 20px;
`;

export const Text = styled.p`
  ${({ theme }) => theme.typography.Body_Regular};
  color: ${({ theme }) => theme.colors.primary.BLACK};
  margin-bottom: 12px;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 519px;
  border-radius: 8px;
  overflow: hidden;
`;

export const beliefRevealStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

export const beliefImageStyle: CSSProperties = {
  objectFit: "cover",
};
