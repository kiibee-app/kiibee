import styled from "styled-components";

export const TopBar = styled.div<{ $marginBottom?: string }>`
  display: flex;
  justify-content: flex-start;
  margin-bottom: ${({ $marginBottom }) => $marginBottom ?? "18px"};
`;

export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;
