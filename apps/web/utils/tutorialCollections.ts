import type { TutorialVideoSection } from "./types";

export type TutorialCollection = TutorialVideoSection & {
  tutorials: import("./types").TutorialVideo[];
};
