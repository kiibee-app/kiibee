"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CreatorRequest,
  CreatorStatus,
} from "../../../types/creator-request";

const CREATOR_REQUEST_OVERRIDES_STORAGE_KEY = "admin-creator-request-overrides";

function loadCreatorOverrides(): CreatorRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(
      CREATOR_REQUEST_OVERRIDES_STORAGE_KEY,
    );

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as CreatorRequest[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function useCreatorRequestOverrides(serverCreators: CreatorRequest[]) {
  const [creatorOverrides, setCreatorOverrides] = useState<CreatorRequest[]>(
    () => loadCreatorOverrides(),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      CREATOR_REQUEST_OVERRIDES_STORAGE_KEY,
      JSON.stringify(creatorOverrides),
    );
  }, [creatorOverrides]);

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
