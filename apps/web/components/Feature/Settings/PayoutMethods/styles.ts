import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export { Card, CardTop, TextBlock } from "../Payout/styles";
export { Settlement } from "../styles";

export const Subtitle = styled(MonoText)`
  margin-top: 4px;
  display: block;
`;

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
