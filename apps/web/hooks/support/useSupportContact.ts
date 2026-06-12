"use client";

import { API, usePostAPI } from "@/lib/http/api";

export type SupportContactPayload = {
  firstName: string;
  lastName?: string;
  companyName?: string;
  phoneNumber?: string;
  email: string;
  message: string;
};

export type SupportContactResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
};

export const useSupportContact = () =>
  usePostAPI<SupportContactResponse, SupportContactPayload>(
    API.support.contact,
  );
