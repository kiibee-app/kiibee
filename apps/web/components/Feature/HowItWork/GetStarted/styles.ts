import styled from "styled-components";
import { BG_WHITE, type BgVariant } from "@/utils/Constants";

type SectionProps = {
  $bgVariant: BgVariant;
};

export const Section = styled.section<SectionProps>`
  width: 100%;
  background: ${({ theme, $bgVariant }) =>
    $bgVariant === BG_WHITE
      ? theme.colors.neutral.WHITE
      : theme.colors.secondary.MEDIUM_GREEN};
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
  ${({ theme }) => theme.typography.Heading2};
  margin: 0 0 1rem 0;
`;

export const Sub = styled.p`
  ${({ theme }) => theme.typography.H5_Regular};
  margin: 0 0 1.75rem 0;
  padding: 1rem 0;
  max-width: 1100px;
`;

export const CTAWrap = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;
