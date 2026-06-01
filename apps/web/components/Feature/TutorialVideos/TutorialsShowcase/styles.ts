import styled from "styled-components";
import { media } from "@repo/ui/breakpoints";

export const Grid = styled.div<{ $maxWidth?: string; $columnMax?: string }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth ?? "100%"};
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(260px, ${({ $columnMax }) => $columnMax ?? "1fr"})
  );
  gap: 1.75rem;

  ${media.desktop} {
    gap: 1.25rem;
  }
`;
