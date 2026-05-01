import styled from "styled-components";
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
