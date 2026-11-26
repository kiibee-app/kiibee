"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const hasMeasurementId = !!measurementId && /^G-[A-Z0-9]+$/.test(measurementId);
const subscribeToHost = () => () => {};
const serverHost = () => false;
const isProductionHost = () =>
  window.location.hostname === "www.kiibee.dk" ||
  window.location.hostname === "kiibee.dk";

function useAnalyticsConfigured() {
  const productionHost = useSyncExternalStore(
    subscribeToHost,
    isProductionHost,
    serverHost,
  );
  return hasMeasurementId && productionHost;
}
const CONSENT_KEY = "kiibee_analytics_consent";
const CONSENT_EVENT = "kiibee:analytics-consent";
type Consent = "granted" | "denied" | null;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function getConsent(): Consent {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}
function subscribe(notify: () => void) {
  const syncConsent = () => {
    const consent = getConsent();
    Object.assign(window, {
      [`ga-disable-${measurementId}`]: consent !== "granted",
    });
    (window as AnalyticsWindow).gtag?.("consent", "update", {
      analytics_storage: consent === "granted" ? "granted" : "denied",
    });
    notify();
  };
  window.addEventListener(CONSENT_EVENT, syncConsent);
  window.addEventListener("storage", syncConsent);
  return () => {
    window.removeEventListener(CONSENT_EVENT, syncConsent);
    window.removeEventListener("storage", syncConsent);
  };
}
function setConsent(consent: Exclude<Consent, null>) {
  const analytics = window as AnalyticsWindow;
  Object.assign(window, {
    [`ga-disable-${measurementId}`]: consent !== "granted",
  });
  analytics.gtag?.("consent", "update", { analytics_storage: consent });
  if (consent === "denied") {
    // Remove GA cookies at the current host and its parent domains.
    const domains = window.location.hostname.split(".");
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0].trim();
      if (name !== "_ga" && !name.startsWith("_ga_")) continue;
      document.cookie = `${name}=; Max-Age=0; path=/`;
      for (let i = 0; i < domains.length - 1; i++) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domains.slice(i).join(".")}`;
      }
    }
  }
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // If storage is blocked, leave optional analytics disabled.
    return;
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
const serverConsent = (): Consent => null;
const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;
const Banner = styled.aside`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 520px;
  z-index: 9999;
  background: ${({ theme }) => theme.colors.primary.WHITE};
  border: 1px solid ${({ theme }) => theme.colors.neutral.GRAY};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 24px #0002;
`;

export function AnalyticsPreferences() {
  const configured = useAnalyticsConfigured();
  const { t } = useTranslation();
  const consent = useSyncExternalStore(subscribe, getConsent, serverConsent);
  if (!configured) return null;
  return (
    <div>
      <MonoText $use="Body_Regular" role="status">
        {t(
          consent === "granted"
            ? "analyticsConsent.enabled"
            : "analyticsConsent.disabled",
        )}
      </MonoText>
      <Actions>
        <GenericButton
          onClick={() => setConsent("granted")}
          disabled={consent === "granted"}
        >
          {t("analyticsConsent.accept")}
        </GenericButton>
        <GenericButton
          variant="secondary"
          onClick={() => setConsent("denied")}
          disabled={consent === "denied"}
        >
          {t("analyticsConsent.reject")}
        </GenericButton>
      </Actions>
    </div>
  );
}

export default function Analytics() {
  const configured = useAnalyticsConfigured();
  const { t } = useTranslation();
  const consent = useSyncExternalStore(subscribe, getConsent, serverConsent);
  if (!configured) return null;
  if (consent === null) {
    return (
      <Banner aria-label={t("analyticsConsent.title")}>
        <MonoText $use="Body_SemiBold">{t("analyticsConsent.title")}</MonoText>
        <p>
          <MonoText $use="Body_Regular">
            {t("analyticsConsent.description")}
          </MonoText>
        </p>
        <Actions>
          <GenericButton onClick={() => setConsent("granted")}>
            {t("analyticsConsent.accept")}
          </GenericButton>
          <GenericButton
            variant="secondary"
            onClick={() => setConsent("denied")}
          >
            {t("analyticsConsent.reject")}
          </GenericButton>
        </Actions>
      </Banner>
    );
  }
  if (consent !== "granted") return null;
  return (
    <Script
      id="kiibee-google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
      onReady={() => {
        if (getConsent() !== "granted") return;
        const analytics = window as AnalyticsWindow;
        Object.assign(window, { [`ga-disable-${measurementId}`]: false });
        analytics.dataLayer ??= [];
        analytics.gtag ??= function () {
          // gtag expects the standard arguments object in the data layer.
          // eslint-disable-next-line prefer-rest-params
          analytics.dataLayer!.push(arguments);
        };
        analytics.gtag("consent", "default", {
          analytics_storage: "granted",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        analytics.gtag("js", new Date());
        // GA4 Enhanced Measurement handles subsequent history-based page views.
        analytics.gtag("config", measurementId, {
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        });
      }}
    />
  );
}
