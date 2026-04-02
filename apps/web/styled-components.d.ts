import "styled-components";
import type { Theme as AppTheme } from "../../packages/ui/src/theme";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
