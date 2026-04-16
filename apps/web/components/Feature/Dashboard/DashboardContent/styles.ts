import { MonoText } from "@/components/UI/Monotext";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled(MonoText).attrs({
  $use: "H4_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const EmptyState = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;
