import styled from "styled-components";
import { MonoText } from "@/components/UI/Monotext";

export const Container = styled.div`
  padding: 8px 28px;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
`;

export const Card = styled.section`
  margin-top: 16px;
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border-radius: 12px;
  padding: 28px;
`;

export const Row = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 9999px;
  background: ${(p) => p.theme.colors.gredint.PALE_GREEN};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Fields = styled.div`
  max-width: 540px;
`;

export const TwoColumnRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;

  & > * {
    flex: 1 1 0;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  box-shadow: inset 0 0 0 1px ${(p) => p.theme.colors.primary.GRAY};
`;

export const Action = styled.div`
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Button = styled.button`
  padding: 10px 22px;
  border-radius: 10px;
  background: ${(p) => p.theme.colors.neutral.GRAY};
  color: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  ${MonoText} {
    color: inherit;
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  color: ${(p) => p.theme.colors.primary.BLACK};
  border: 1px solid ${(p) => p.theme.colors.primary.GRAY};
`;

export const PasswordFields = styled.div`
  margin-top: 12px;
  max-width: 420px;
`;

export const Optional = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin-left: 8px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const OptionalSmall = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  margin-left: 8px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const InlineLabel = styled(MonoText).attrs({
  $use: "Body_SemiBold",
})`
  display: inline-block;
  padding-left: 4px;
  color: ${(p) => p.theme.colors.primary.BLACK};
`;

export const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
