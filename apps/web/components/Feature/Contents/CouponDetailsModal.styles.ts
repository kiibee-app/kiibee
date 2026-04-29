import styled from "styled-components";
import { typography } from "@repo/ui/typography";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";
import { media } from "@repo/ui/breakpoints";

export const ModalContent = styled.div`
  display: flex;
  min-height: 380px;
  flex-direction: column;
  align-items: center;
  padding-top: 45px;

  ${media.tablet} {
    min-height: auto;
    padding-top: 28px;
    padding-bottom: 28px;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const FormShell = styled.form`
  width: min(457px, 100%);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

export const ModalTitle = styled(MonoText).attrs({
  $use: "H4_Medium",
})`
  color: ${COLORS.primary.BLACK};
  text-align: center;
  margin-bottom: 12px;
  padding-top: 20px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  ${typography.Body_Medium};
  color: ${COLORS.primary.BLACK};
`;

export const SectionTitle = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${COLORS.primary.BLACK};
  font-weight: 600;
  margin-top: 6px;
`;

export const HelperText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${COLORS.neutral.GRAY};
`;

export const CouponInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid ${COLORS.neutral.GRAY_300};
  border-radius: 10px;
  background: ${COLORS.neutral.GRAY_200};
  padding: 0 16px;
  color: ${COLORS.primary.BLACK};
  ${typography.Body_Medium};
  outline: none;

  &::placeholder {
    color: ${COLORS.neutral.GRAY_400};
  }

  &:focus {
    border-color: ${COLORS.primary.BLACK};
    background: ${COLORS.primary.WHITE};
  }
`;

export const NextButton = styled.button`
  align-self: center;
  width: min(310px, 100%);
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: ${COLORS.neutral.GRAY};
  color: ${COLORS.primary.WHITE};
  margin-top: 14px;
  cursor: pointer;
  ${typography.Body_Bold};

  &:not(:disabled) {
    background: ${COLORS.primary.BLACK};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
