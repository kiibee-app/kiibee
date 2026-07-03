import styled from "styled-components";
import { typography } from "@repo/ui/typography";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";

export const SectionTitle = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${COLORS.primary.BLACK};
  margin-top: 6px;
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

export const DiscountWarningNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 8px;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  background: rgba(255, 140, 66, 0.12);
  color: ${COLORS.primary.ORANGE};

  svg {
    flex-shrink: 0;
  }
`;
