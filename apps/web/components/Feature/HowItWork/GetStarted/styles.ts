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
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;

  ${media.tablet} {
    min-height: 300px;
    padding: 60px 0;
  }
`;

export const Inner = styled.div<{ $alignWide?: boolean }>`
  width: 100%;
  max-width: ${({ $alignWide }) =>
    $alignWide ? FOR_CREATORS_LAYOUT.contentMaxWidth : "1440px"};
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;

  ${media.tablet} {
    padding: 0 1.25rem;
  }
`;

export const Heading = styled.h2`
  ${({ theme }) => theme.typography.Heading2};
  margin: 0;
`;

export const Sub = styled.p`
  ${({ theme }) => theme.typography.H5_Regular};
  margin: 0.75rem 0 1.75rem 0;
  max-width: 1100px;
`;

export const CTAWrap = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;
