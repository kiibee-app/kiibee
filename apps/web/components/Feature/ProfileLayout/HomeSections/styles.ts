import styled from "styled-components";
import {
  ContentInner,
  HeroWrapper,
} from "@/components/Feature/ProfileLayout/Hero/styles";
import { media } from "@repo/ui/breakpoints";

export const SectionWrapper = styled(HeroWrapper)`
  margin-top: 0;
  padding: 0;
  background: transparent;

  ${media.mobileXl} {
    margin-top: 0;
    padding: 0;
  }
`;

export const ContentAdjust = styled(ContentInner)``;
