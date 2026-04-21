import { css } from "styled-components";
import { typography } from "@repo/ui/typography";

export const typographyStyles = Object.entries(typography).reduce(
  (acc, [key, value]) => {
    acc[key as keyof typeof typography] = css`
      font-size: ${value.fontSize};
      font-family: ${value.fontFamily};
      font-weight: ${value.fontWeight ?? 400};
      line-height: ${value.lineHeight};
      font-style: ${value.fontStyle ?? "normal"};
      letter-spacing: ${value.letterSpacing ?? "0px"};
    `;
    return acc;
  },
  {} as Record<keyof typeof typography, ReturnType<typeof css>>,
);
