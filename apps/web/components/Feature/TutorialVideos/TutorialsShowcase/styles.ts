import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Grid = styled.div<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth ?? "100%"};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.75rem;

  ${media.desktop} {
    gap: 1.25rem;
  }
`;
