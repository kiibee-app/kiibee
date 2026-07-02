import styled from "styled-components";
import { MODAL_ALIGN } from "@/utils/ui";

export const ButtonGroup = styled.div<{ $row?: boolean; $align?: string }>`
  display: flex;
  flex-direction: ${({ $row }) => ($row ? "row" : "column")};
  gap: 12px;
  justify-content: ${({ $align }) =>
    $align === MODAL_ALIGN.CENTER
      ? "center"
      : $align === MODAL_ALIGN.START
        ? "flex-start"
        : "flex-end"};
  margin-top: 24px;
`;
