import styled from "styled-components";
import { typography } from "@repo/ui/typography";
import { typographyStyles } from "./typography.styles";

type TypographyKey = keyof typeof typography;

interface MonoTextProps {
  $use?: TypographyKey;
  color?: string;
}

export const MonoText = styled.span<MonoTextProps>`
  margin: 0;
  padding: 0;
  color: ${({ color, theme }) => color || theme.colors.primary.BLACK};
  ${({ $use = "Body_Regular" }) => typographyStyles[$use]}
`;
