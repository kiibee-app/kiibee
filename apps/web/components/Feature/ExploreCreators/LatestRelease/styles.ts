import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Section = styled.section`
  width: min(100%, 1300px);
  margin: 0 auto;
  padding: 40px 0;

  ${media.tablet} {
    width: 100%;
    padding: 2rem 1.25rem;
  }
`;
