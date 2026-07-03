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
})<{ $hasError?: boolean }>`
  color: ${({ $hasError }) =>
    $hasError ? COLORS.primary.RED : COLORS.neutral.GRAY};
`;
