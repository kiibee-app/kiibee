import styled from "styled-components";
import { typography } from "@repo/ui/typography";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";
import { media } from "@repo/ui/breakpoints";
import { COUPON_STATUS } from "@/types/couponType";

export const ModalContent = styled.div`
  display: flex;
  min-height: 380px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  min-height: 352px;
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

export const HelperText = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${COLORS.neutral.GRAY};
`;

export const NextButton = styled.button`
  align-self: center;
  width: min(310px, 100%);
  height: 38px;
  border: 0;
  border-radius: 8px;
  background: ${COLORS.neutral.GRAY};
  color: ${COLORS.primary.WHITE};
  margin-top: auto;
  cursor: pointer;
  ${typography.Body_Bold};

  &:not(:disabled) {
    background: ${COLORS.primary.BLACK};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const TableSection = styled.div`
  margin-top: 20px;
  overflow-x: auto;
`;

export const CodesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CodeBadge = styled(MonoText).attrs({
  $use: "Body_Medium",
})`
  color: ${({ theme }) => theme.colors.neutral.GRAY};
  display: flex;
  padding: 4px 8px;
  align-items: center;
  gap: 2px;
  border-radius: 15px;
  background: ${({ theme }) => theme.colors.primary.GRAY};
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: 5px;
  min-width: 80px;
  height: 21px;
  white-space: nowrap;
  text-transform: capitalize;
  border: none;
  cursor: default;
  color: ${({ theme }) => theme.colors.primary.WHITE};
  background-color: ${({ $status, theme }) => {
    if ($status === COUPON_STATUS.INACTIVE) return theme.colors.primary.RED;
    return theme.colors.secondary.MEDIUM_GREEN;
  }};
  ${MonoText} {
    color: inherit;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;

  > div > div {
    top: 0;
    right: 24px;
  }
`;

export const CouponActionText = styled.span<{ $danger?: boolean }>`
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors.primary.RED : theme.colors.neutral.GRAY};
  ${typography.Body_Regular};
`;
