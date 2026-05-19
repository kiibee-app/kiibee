"use client";

import { API, usePutAPI } from "@/lib/http/api";

export type AssignViewerPreferencesPayload = {
  categoryIds: string[];
  typeIds: string[];
};

type AssignViewerPreferencesResponse = {
  success?: boolean;
  message?: string;
};

export const useAssignViewerPreferences = () =>
  usePutAPI<AssignViewerPreferencesResponse, AssignViewerPreferencesPayload>(
    API.content.assign,
  );
