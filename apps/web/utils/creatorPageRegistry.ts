import type { ComponentType } from "react";
import Layout1Home from "@/components/Feature/ProfileLayout/Layout1/Home";
import Layout1Collections from "@/components/Feature/ProfileLayout/Layout1/Collections";
import Layout2Home from "@/components/Feature/ProfileLayout/Layout2/Home";
import Layout2Collections from "@/components/Feature/ProfileLayout/Layout2/Collections";
import Layout3Home from "@/components/Feature/ProfileLayout/Layout3/Home";
import Layout3Collections from "@/components/Feature/ProfileLayout/Layout3/Collections";
import type { CreatorLayoutParam } from "@/utils/creatorChannel";

export const creatorHomeByLayout: Record<CreatorLayoutParam, ComponentType> = {
  "1": Layout1Home,
  "2": Layout2Home,
  "3": Layout3Home,
};

export const creatorCollectionsByLayout: Record<
  CreatorLayoutParam,
  ComponentType
> = {
  "1": Layout1Collections,
  "2": Layout2Collections,
  "3": Layout3Collections,
};
