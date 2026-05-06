import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SelectorList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding-bottom: 20px;
`;

export const SectionRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

export const SectionLabel = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;

export const SectionValue = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  padding: 4px 8px;
  border-radius: 15px;
  background: ${({ theme }) => theme.colors.primary.GRAY};
  color: ${({ theme }) => theme.colors.neutral.GRAY_400};
`;
