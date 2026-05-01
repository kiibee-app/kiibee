import type { ReactNode } from "react";
import type { CreatorRequest } from "./creator-request";

export interface CreatorDetailsModalProps {
  creator: CreatorRequest | null;
  onClose: () => void;
}

export interface CreatorDetailFieldConfig {
  key: keyof CreatorRequest | "exampleWorkLinkField";
  label: string;
  renderValue: (creator: CreatorRequest) => ReactNode;
}
