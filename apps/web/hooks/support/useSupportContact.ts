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
  data: {
    id: string;
    firstName: string;
    lastName: string | null;
    companyName: string | null;
    phoneNumber: string | null;
    email: string;
    message: string;
    createdAt: string;
    updatedAt: string;
  };
};

export const useSupportContact = () =>
  usePostAPI<SupportContactResponse, SupportContactPayload>(
    API.support.contact,
  );
