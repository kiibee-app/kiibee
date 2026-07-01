import { isProduction } from "@/utils/common";
import { z } from "zod";

const requiredApiUrlSchema = z.preprocess(
  (value) => (typeof value === "string" ? value : ""),
  z
    .string()
    .trim()
    .min(1, "NEXT_PUBLIC_API_URL is required")
    .pipe(
      z
        .string()
        .url("NEXT_PUBLIC_API_URL must be a valid absolute URL")
        .refine((value) => !value.endsWith("/"), {
          message: "NEXT_PUBLIC_API_URL must not have a trailing slash",
        }),
    ),
);

const basePublicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: requiredApiUrlSchema,
});

function isLoopbackHttpApiUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:") {
      return false;
    }
    return url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

const productionPublicEnvSchema = basePublicEnvSchema.extend({
  NEXT_PUBLIC_API_URL: basePublicEnvSchema.shape.NEXT_PUBLIC_API_URL.refine(
    (value) => value.startsWith("https://") || isLoopbackHttpApiUrl(value),
    {
      message:
        "NEXT_PUBLIC_API_URL must use https:// in production (http allowed only for localhost / 127.0.0.1)",
    },
  ),
});

function resolveApiBaseUrl(): string {
  const schema = isProduction ? productionPublicEnvSchema : basePublicEnvSchema;

  const parsed = schema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `[env] Invalid environment configuration:\n${parsed.error.issues
        .map((issue) => `  - ${issue.message}`)
        .join("\n")}`,
    );
  }

  return parsed.data.NEXT_PUBLIC_API_URL;
}

export const API_BASE_URL = resolveApiBaseUrl();
