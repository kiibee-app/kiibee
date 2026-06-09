import { Grid } from "@/components/Feature/TutorialVideos/TutorialsShowcase/styles";
import { media } from "@repo/ui/breakpoints";
import styled from "styled-components";
import { ProfileLayoutVariant } from "../../config";

export const CollectionSection = styled.section<{
  $variant?: ProfileLayoutVariant;
}>`
  width: min(100%, 1300px);
  margin: ${({ $variant }) => ($variant === "1" ? "0" : "0 auto")};
  padding: 35px 0 0;

  ${media.tablet} {
    width: 100%;
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
