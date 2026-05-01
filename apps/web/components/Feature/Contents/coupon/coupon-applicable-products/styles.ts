import styled from "styled-components";
import { typography } from "@repo/ui/typography";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";

export const TitleHelperText = styled(MonoText).attrs({
  $use: "Body_Small",
})`
  color: ${COLORS.neutral.GRAY};
  margin: -8px auto 14px;
  max-width: 360px;
  text-align: center;
`;

export const SelectorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const SelectorButton = styled.button`
  width: 100%;
  height: 40px;
  border: 1px solid ${COLORS.neutral.GRAY_300};
  border-radius: 10px;
  background: ${COLORS.primary.WHITE};
  padding: 0 16px;
  color: ${COLORS.primary.BLACK};
  ${typography.Body_Medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  &:focus-visible {
    outline: 2px solid ${COLORS.primary.BLACK};
    outline-offset: 2px;
  }
`;
