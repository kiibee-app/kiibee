import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const CollectionListShell = styled.section`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 35px 0 100px 0;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.primary.WHITE};

  ${media.tablet} {
    padding-top: 28px;
  }
`;
