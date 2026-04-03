import "styled-components";
import { Theme } from "@repo/ui/theme/types";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {
    name: Theme["name"];
  }
}
