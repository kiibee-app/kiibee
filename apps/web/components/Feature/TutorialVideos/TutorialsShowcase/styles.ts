import styled from "styled-components";
import breakpoints from "../../../../../../packages/ui/src/breakpoints";

export const Grid = styled.div<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth ?? "100%"};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;

  @media (min-width: ${breakpoints.desktop}) {
    gap: 1.75rem;
  }
`;
