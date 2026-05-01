import styled from "styled-components";
import { typography } from "@repo/ui/typography";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";

export const CodesHelperText = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  color: ${COLORS.primary.BLACK};
`;

export const CodesMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const CodesLimitText = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  color: ${COLORS.neutral.GRAY};
`;

export const CouponCodesInput = styled.textarea`
  width: 100%;
  height: 40px;
  border: 1px solid ${COLORS.neutral.GRAY_300};
  border-radius: 10px;
  background: ${COLORS.neutral.GRAY_200};
  padding: 10px 16px;
  color: ${COLORS.primary.BLACK};
  ${typography.Body_Medium};
  line-height: 18px;
  outline: none;
  resize: none;
  overflow: hidden;

  &::placeholder {
    color: ${COLORS.neutral.GRAY_400};
  }

  &:focus {
    border-color: ${COLORS.primary.BLACK};
    background: ${COLORS.primary.WHITE};
  }
`;
