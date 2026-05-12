"use client";

import { useMemo, useState } from "react";
import type {
  CreatorRequest,
  CreatorStatus,
} from "../../../types/creator-request";

export function useCreatorRequestOverrides(serverCreators: CreatorRequest[]) {
  const [creatorOverrides, setCreatorOverrides] = useState<CreatorRequest[]>(
    [],
  );

  const creators = useMemo(() => {
    const creatorMap = new Map<string, CreatorRequest>();

    for (const creator of serverCreators) {
      creatorMap.set(creator.id, creator);
    }

    for (const creator of creatorOverrides) {
      creatorMap.set(creator.id, creator);
    }

    return Array.from(creatorMap.values()).sort(
      (firstCreator, secondCreator) =>
        new Date(secondCreator.createdAt).getTime() -
        new Date(firstCreator.createdAt).getTime(),
    );
  }, [creatorOverrides, serverCreators]);

  const updateCreatorStatus = (
    creator: CreatorRequest,
    status: CreatorStatus,
  ) => {
    const updatedCreator: CreatorRequest = {
      ...creator,
      status,
      updatedAt: new Date().toISOString(),
    };

    setCreatorOverrides((currentOverrides) => {
      const nextOverrides = currentOverrides.filter(
        (currentCreator) => currentCreator.id !== creator.id,
      );

      return [...nextOverrides, updatedCreator];
    });

    return updatedCreator;
  };

  return {
    creators,
    updateCreatorStatus,
  };
}
