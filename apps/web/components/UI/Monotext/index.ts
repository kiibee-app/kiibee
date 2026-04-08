import styled from "styled-components";
import { typography } from "@repo/ui/typography";

type TypographyKey = keyof typeof typography;

interface MonoTextProps {
  $use?: TypographyKey;
  color?: string;
}

export const MonoText = styled.span<MonoTextProps>`
  ${({ $use = "Body_Regular", color, theme }) => {
    const style = typography[$use];

    return `
      font-size: ${style.fontSize};
      font-family: ${style.fontFamily};
      font-weight: ${style.fontWeight ?? 400};
      line-height: ${style.lineHeight};
      letter-spacing: ${style.letterSpacing ?? "0px"};
      font-style: ${style.fontStyle ?? "normal"};
      color: ${color || theme.colors.primary.BLACK};
      margin: 0;
      padding: 0;
    `;
  }}
`;
