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
  font-size: 20px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary.BLACK};
`;

export const Card = styled.section`
  margin-top: 16px;
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE};
  border-radius: 12px;
  padding: 28px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.primary.BLACK};
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

export const Name = styled.h3`
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary.BLACK};
`;

export const Fields = styled.div`
  margin-top: 24px;
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

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
  font-size: 13px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: ${(p) => p.theme.colors.neutral.OFF_WHITE || "#eee"};
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
  background: ${(p) => p.theme.colors.primary.BLACK};
  color: ${(p) => p.theme.colors.primary.WHITE};
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

export { MonoText };

export const PaymentText = styled(MonoText)`
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const Optional = styled.span`
  margin-left: 8px;
  font-size: 13px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const OptionalSmall = styled.span`
  margin-left: 8px;
  font-size: 13px;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;

export const InlineLabel = styled.span`
  display: inline-block;
  padding-left: 4px;
  font-size: 16px;
  color: ${(p) => p.theme.colors.primary.BLACK};
  line-height: 1;
`;

export const EmailText = styled(MonoText)`
  font-weight: 500;
  color: ${(p) => p.theme.colors.neutral.GRAY_400};
`;
