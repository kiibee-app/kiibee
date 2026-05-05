import { useMemo } from "react";

import { Direction, Directions } from "@/utils/ui";

const DIRECTION_ROTATION_MAP: Record<Direction, string> = {
  [Directions.DOWN]: "0deg",
  [Directions.UP]: "180deg",
  [Directions.RIGHT]: "-90deg",
  [Directions.LEFT]: "90deg",
};

export const useDirection = (direction: Direction = Directions.LEFT) =>
  useMemo(() => DIRECTION_ROTATION_MAP[direction] ?? "0deg", [direction]);
