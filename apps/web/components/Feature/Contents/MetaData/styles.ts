import { MonoText } from "@/components/UI/Monotext";
import styled from "styled-components";

export const PanelStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const FieldWrapper = styled.div`
  width: 100%;
  max-width: 460px;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Title = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const Description = styled(MonoText).attrs({
  $use: "Body_Regular",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
`;

export const HelperFormRow = styled.div`
  width: 100%;
  max-width: 460px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HelperText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.BLACK};
`;

export const ErrorText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.primary.RED};
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
`;
