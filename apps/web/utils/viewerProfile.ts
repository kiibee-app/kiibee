import type { LoginUser } from "@/hooks/auth/useLogin";
import { AUTH_STORAGE_KEYS } from "@/lib/auth/storageKeys";
import { toTrimmedString } from "@/utils/Constants";
import { FORM_MESSAGE_TONE, isBrowser } from "@/utils/ui";

export const IMAGE_DATA_PREFIX = /^data:image\//;

/** @deprecated Use AUTH_STORAGE_KEYS.user directly. */
export const USER_STORAGE_KEY = AUTH_STORAGE_KEYS.user;

export type ViewerBootstrap = {
  name: string;
  email: string;
  avatarUrl: string | null;
  downloadsCount: number;
};

export const EMPTY_VIEWER_BOOTSTRAP: ViewerBootstrap = {
  name: "",
  email: "",
  avatarUrl: null,
  downloadsCount: 0,
};

export type ChangePasswordBody = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export type ChangePasswordResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export type ForgotPwNotice =
  | null
  | { variant: typeof FORM_MESSAGE_TONE.SUCCESS; email: string }
  | { variant: typeof FORM_MESSAGE_TONE.ERROR; message: string };

export function forgotPwIsSuccess(
  notice: ForgotPwNotice,
): notice is { variant: typeof FORM_MESSAGE_TONE.SUCCESS; email: string } {
  return notice?.variant === FORM_MESSAGE_TONE.SUCCESS;
}

export function forgotPwIsError(
  notice: ForgotPwNotice,
): notice is { variant: typeof FORM_MESSAGE_TONE.ERROR; message: string } {
  return notice?.variant === FORM_MESSAGE_TONE.ERROR;
}

export function forgotPwEmail(notice: ForgotPwNotice): string {
  return forgotPwIsSuccess(notice) ? notice.email : "";
}

export function forgotPwError(notice: ForgotPwNotice): string {
  return forgotPwIsError(notice) ? notice.message : "";
}

export function readViewerBootstrapFromStorage(): ViewerBootstrap {
  if (!isBrowser) {
    return EMPTY_VIEWER_BOOTSTRAP;
  }

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    const user = raw ? (JSON.parse(raw) as LoginUser) : null;

    const name = toTrimmedString(user?.fullName);
    const email = toTrimmedString(user?.email);
    const trimmedAvatar = toTrimmedString(user?.avatarUrl);
    const avatarUrl =
      trimmedAvatar.length > 0 && IMAGE_DATA_PREFIX.test(trimmedAvatar)
        ? trimmedAvatar
        : null;
    const downloadsCount = Number(user?.downloadsCount ?? 0);

    return {
      name,
      email,
      avatarUrl,
      downloadsCount: Number.isFinite(downloadsCount) ? downloadsCount : 0,
    };
  } catch {
    return EMPTY_VIEWER_BOOTSTRAP;
  }
}

type BootstrapListener = (data: ViewerBootstrap) => void;

const bootstrapListeners = new Set<BootstrapListener>();
let bootstrapFlushScheduled = false;

export function subscribeViewerBootstrap(listener: BootstrapListener) {
  if (!isBrowser) {
    return () => {};
  }
  bootstrapListeners.add(listener);
  if (!bootstrapFlushScheduled) {
    bootstrapFlushScheduled = true;
    queueMicrotask(() => {
      bootstrapFlushScheduled = false;
      const data = readViewerBootstrapFromStorage();
      for (const l of Array.from(bootstrapListeners)) {
        l(data);
      }
    });
  }
  return () => {
    bootstrapListeners.delete(listener);
  };
}
