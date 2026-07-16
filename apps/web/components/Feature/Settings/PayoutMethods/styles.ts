import styled from "styled-components";

export { Card, CardTop, TextBlock } from "../Payout/styles";

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;
