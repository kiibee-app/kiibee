"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Script from "next/script";
import { useTranslation } from "react-i18next";
import {
  VerificationContainer,
  VerificationStatus,
  VerificationWidget,
} from "./styles";

export const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

export type TurnstileRef = {
  reset: () => void;
  getWidgetId: () => string | null;
};

type TurnstileInstance = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      size: "flexible" | "compact" | "normal";
      theme?: "light" | "dark" | "auto";
      appearance?: "always" | "execute" | "interaction-only";
      execution?: "render" | "execute";
      "response-field"?: boolean;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "timeout-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

export function getTurnstile(): TurnstileInstance | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { turnstile?: TurnstileInstance }).turnstile;
}

export type TurnstileProps = {
  action?: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  resetSignal?: unknown;
  className?: string;
};

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  function Turnstile(
    { action, onVerify, onExpire, onError, resetSignal, className },
    ref,
  ) {
    const { t } = useTranslation();
    const [turnstileReady, setTurnstileReady] = useState(() =>
      Boolean(getTurnstile()),
    );
    const [verificationError, setVerificationError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    const onVerifyRef = useRef(onVerify);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);

    useEffect(() => {
      onVerifyRef.current = onVerify;
      onExpireRef.current = onExpire;
      onErrorRef.current = onError;
    });

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          if (widgetIdRef.current !== null) {
            getTurnstile()?.reset(widgetIdRef.current);
          }
        },
        getWidgetId: () => widgetIdRef.current,
      }),
      [],
    );

    useEffect(() => {
      const turnstile = getTurnstile();
      const container = containerRef.current;
      if (!turnstileReady || !turnstile || !turnstileSiteKey || !container) {
        return;
      }

      if (widgetIdRef.current !== null) {
        try {
          turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }

      try {
        const id = turnstile.render(container, {
          sitekey: turnstileSiteKey,
          action: action || "form",
          size: container.clientWidth < 300 ? "compact" : "flexible",
          theme: "light",
          appearance: "always",
          execution: "render",
          "response-field": false,
          callback: (token: string) => {
            onVerifyRef.current(token);
            setVerificationError(false);
          },
          "expired-callback": () => {
            onExpireRef.current?.();
          },
          "timeout-callback": () => {
            onExpireRef.current?.();
          },
          "error-callback": () => {
            onErrorRef.current?.();
            setVerificationError(true);
          },
        });
        widgetIdRef.current = id;
      } catch {
        // Handle rendering failure safely without direct setState in effect body
        setTimeout(() => setVerificationError(true), 0);
      }

      return () => {
        if (widgetIdRef.current !== null) {
          try {
            turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }
      };
    }, [turnstileReady, action, resetSignal]);

    return (
      <VerificationContainer className={className}>
        {turnstileSiteKey && (
          <>
            <Script
              id="cloudflare-turnstile-script"
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              strategy="afterInteractive"
              onReady={() => setTurnstileReady(true)}
              onError={() => setVerificationError(true)}
            />
            <VerificationWidget ref={containerRef} />
          </>
        )}
        {(!turnstileSiteKey || verificationError) && (
          <VerificationStatus role="status">
            {t(
              "common.verificationUnavailable",
              t("supportPage.form.verificationUnavailable"),
            )}
          </VerificationStatus>
        )}
      </VerificationContainer>
    );
  },
);

export function useTurnstile() {
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileRef>(null);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken("");
    turnstileRef.current?.reset();
  }, []);

  return {
    turnstileToken,
    setTurnstileToken,
    resetTurnstile,
    turnstileRef,
    isConfigured: Boolean(turnstileSiteKey),
  };
}

export default Turnstile;
