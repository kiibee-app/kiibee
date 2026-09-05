import { Grid } from "@/components/Feature/TutorialVideos/TutorialsShowcase/styles";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { ProfileLayoutVariant } from "../../config";
import { fluidCardColumns } from "@/styles/exploreCardGrid";

export const CollectionSection = styled.section<{
  $variant?: ProfileLayoutVariant;
}>`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 10px 0;

  ${media.tablet} {
    width: 100%;
    padding: 10px 0;
  }
`;

export const CollectionSectionTag = styled.span`
  padding: 0;
`;

export const FourColumnGrid = styled(Grid)`
  width: 100%;
  max-width: none;
  margin: 0;
  justify-content: start;
  grid-template-columns: ${fluidCardColumns(4)};

  ${media.desktop} {
    grid-template-columns: ${fluidCardColumns(3)};
  }

  ${media.tablet} {
    grid-template-columns: ${fluidCardColumns(2)};
  }

  ${media.mobileXl} {
    grid-template-columns: 1fr;
  }
`;
