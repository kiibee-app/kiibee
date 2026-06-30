import { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ApiError, normalizeApiError } from "@/lib/http/errors/apiError";

type ApiFieldErrors = Record<string, string>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const firstString = (value: unknown): string | undefined => {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (Array.isArray(value)) {
    const first = value.find(
      (item) => typeof item === "string" && item.length > 0,
    );
    return typeof first === "string" ? first : undefined;
  }

  return undefined;
};

const extractFieldErrors = (payload: unknown): ApiFieldErrors => {
  if (!isRecord(payload)) {
    return {};
  }

  const fieldErrorsContainer = isRecord(payload.errors)
    ? payload.errors
    : isRecord(payload.fieldErrors)
      ? payload.fieldErrors
      : null;

  if (fieldErrorsContainer) {
    return Object.entries(fieldErrorsContainer).reduce<ApiFieldErrors>(
      (acc, [key, value]) => {
        const message = firstString(value);
        if (message) {
          acc[key] = message;
        }
        return acc;
      },
      {},
    );
  }

  const message = payload.message;
  if (Array.isArray(message)) {
    return message.reduce<ApiFieldErrors>((acc, rawMessage) => {
      if (typeof rawMessage !== "string") {
        return acc;
      }
      const [field, ...rest] = rawMessage.split(" ");
      if (field && rest.length > 0) {
        acc[field] = rawMessage;
      }
      return acc;
    }, {});
  }

  return {};
};

export const useApiErrorMessage = () => {
  const { t } = useTranslation();

  const mapKnownApiMessage = (
    message: string,
    fallbackKey?: string,
  ): string => {
    const normalized = message.trim().toLowerCase();

    if (normalized === "reset link has expired") {
      return t("resetPassword.expiredLink");
    }

    if (
      normalized === "invalid or expired token" ||
      normalized === "token already used"
    ) {
      return t("resetPassword.invalidLink");
    }

    if (normalized === "invalid email or password") {
      return t("authForm.errors.invalidCredentials");
    }

    if (
      normalized === "internal server error" &&
      fallbackKey === "authForm.errors.submitFailed"
    ) {
      return t("authForm.errors.invalidCredentials");
    }

    return message;
  };

  const getErrorMessage = (error: unknown, fallbackKey: string): string => {
    const fallbackMessage = t(fallbackKey);
    const normalizedError = normalizeApiError(error);

    if (normalizedError.status === 413) {
      return t("errors.imageTooLarge");
    }

    const message = normalizedError.message || fallbackMessage;
    return t(mapKnownApiMessage(message, fallbackKey));
  };

  const getFieldErrors = (error: unknown): ApiFieldErrors => {
    const normalizedError = normalizeApiError(error);
    if (normalizedError.status !== 422) {
      return {};
    }

    return extractFieldErrors(normalizedError.payload);
  };

  const applyFieldErrors = <TFieldValues extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<TFieldValues>,
  ): boolean => {
    const fieldErrors = getFieldErrors(error);
    const entries = Object.entries(fieldErrors);

    if (entries.length === 0) {
      return false;
    }

    entries.forEach(([field, message]) => {
      setError(field as FieldPath<TFieldValues>, {
        type: "server",
        message,
      });
    });

    return true;
  };

  return {
    getErrorMessage,
    getFieldErrors,
    applyFieldErrors,
    isApiError: (error: unknown): error is ApiError =>
      normalizeApiError(error) instanceof ApiError,
  };
};
