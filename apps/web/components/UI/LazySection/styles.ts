import styled from "styled-components";

export const LazySectionRoot = styled.div<{ $minHeight: number }>`
  width: 100%;
  min-height: ${({ $minHeight }) => $minHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
