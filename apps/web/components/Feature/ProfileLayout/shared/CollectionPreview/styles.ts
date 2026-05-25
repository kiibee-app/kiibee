import { Grid } from "@/components/Feature/TutorialVideos/TutorialsShowcase/styles";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";

export const CollectionSection = styled.section`
  width: 100%;
  padding: 35px 0 0;

  ${media.tablet} {
    padding: 2.5rem 1.25rem 0;
  }
`;

export const CollectionSectionTag = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

export const FourColumnGrid = styled(Grid)`
  grid-template-columns: repeat(4, minmax(0, 1fr));

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;
