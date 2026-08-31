import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const CollectionListShell = styled.section`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 10px 10px 100px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.primary.WHITE};

  ${media.desktopMd} {
    padding: 10px 10px 80px;
  }

  ${media.desktopSm} {
    padding: 10px 10px 88px;
  }

  ${media.tablet} {
    padding: 10px 10px 88px;
  }

  ${media.mobileLg} {
    padding: 10px 10px 56px;
  }
`;

export const CollectionListInner = styled.div`
  width: min(100%, 1380px);
  margin: 0 auto;
  padding: 0 6px;

  ${media.mobileLg} {
    padding: 0;
  }
`;
