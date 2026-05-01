/* eslint-disable @typescript-eslint/no-empty-object-type */
import "styled-components";
import type { Theme } from "../../../packages/ui/src/theme";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
