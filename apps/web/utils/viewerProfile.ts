import type { LoginUser } from "@/hooks/auth/useLogin";

export const IMAGE_DATA_PREFIX = /^data:image\//;

export const USER_STORAGE_KEY = "kiibee.user";

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

export type ForgotPasswordNotice =
  | null
  | { variant: "success"; email: string }
  | { variant: "error"; message: string };

export function readViewerBootstrapFromStorage(): ViewerBootstrap {
  if (typeof window === "undefined") {
    return EMPTY_VIEWER_BOOTSTRAP;
  }

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    const user = raw ? (JSON.parse(raw) as LoginUser) : null;

    const name =
      typeof user?.fullName === "string" && user.fullName.trim().length > 0
        ? user.fullName.trim()
        : "";
    const email =
      typeof user?.email === "string" && user.email.trim().length > 0
        ? user.email.trim()
        : "";
    const avatarUrl =
      typeof user?.avatarUrl === "string" &&
      user.avatarUrl.trim().length > 0 &&
      IMAGE_DATA_PREFIX.test(user.avatarUrl)
        ? user.avatarUrl.trim()
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

/**
 * Notifies listeners after reading localStorage (microtask). Use from a React effect that
 * only subscribes — setState belongs in the listener callback, not in the effect body.
 */
export function subscribeViewerBootstrap(listener: BootstrapListener) {
  if (typeof window === "undefined") {
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
