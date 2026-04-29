"use client";

import { API, usePostAPI } from "@/lib/http/api";

export type CreatorRequestPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cvr?: string;
  address: string;
  city: string;
  postalCode: string;
  exampleWorkLink: string;
  contentDescription: string;
};

export type CreatorRequestResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
};

export const useCreatorRequest = () =>
  usePostAPI<CreatorRequestResponse, CreatorRequestPayload>(
    API.auth.creatorRequest,
  );
