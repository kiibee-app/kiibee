import styled from "styled-components";
import { BG_WHITE, type BgVariant } from "@/utils/Constants";
import { FOR_CREATORS_LAYOUT } from "@/utils/forCreatorsLayout";
import { media } from "@repo/ui/breakpoints";

type SectionProps = {
  $bgVariant: BgVariant;
  $alignWide?: boolean;
};

export const Section = styled.section<SectionProps>`
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme, $bgVariant }) =>
    $bgVariant === BG_WHITE
      ? theme.colors.neutral.WHITE
      : theme.colors.secondary.MEDIUM_GREEN};
  padding: ${({ $alignWide }) =>
    $alignWide
      ? `3.5rem ${FOR_CREATORS_LAYOUT.sectionPaddingX} 1rem`
      : "3.5rem 0 1rem"};

  ${media.tablet} {
    padding: ${({ $alignWide }) =>
      $alignWide ? "2.5rem 1.25rem 1rem" : "3.5rem 0 1rem"};
  }
`;

export const Inner = styled.div<{ $alignWide?: boolean }>`
  width: 100%;
  max-width: ${({ $alignWide }) =>
    $alignWide ? FOR_CREATORS_LAYOUT.contentMaxWidth : "1440px"};
  margin: 0 auto;
  padding: ${({ $alignWide }) => ($alignWide ? "3rem 0" : "3rem 2rem")};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
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
