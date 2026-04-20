import styled from "styled-components";
import type { Variant } from "@/utils/Constants";
import { shared } from "./variants";
import type { ButtonSize } from "./variants";

type ButtonStyleProps = {
  $variant: Variant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $minWidth?: string;
};

export const ButtonEl = styled.button<ButtonStyleProps>`
  ${shared}
`;

export const AnchorEl = styled.a<ButtonStyleProps>`
  ${shared}
`;
