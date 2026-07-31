/**
 * GA4 loader gated by Consent Mode v2.
 *
 * Defaults stay denied. The gtag script is injected only after analytics consent
 * is granted (or restored from a prior grant). Events and page views no-op when
 * analytics is off. Never send email, OTP, or other PII in event params.
 */

export const CONSENT_STORAGE_KEY = "dg-consent-v1";

export type ConsentRecord = {
  analytics: boolean;
  updatedAt: string;
};

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let scriptLoaded = false;
let configured = false;
let analyticsGranted = false;
let defaultsReady = false;

const measurementId = (): string =>
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim() ?? "";

/** Ensure the dataLayer stub exists before any consent or config calls. */
export function ensureGtagStub(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
  }
}

/** Consent Mode v2 defaults — must run before the gtag.js network request. */
export function initConsentDefaults(): void {
  if (typeof window === "undefined" || defaultsReady) return;
  ensureGtagStub();
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
  defaultsReady = true;
}

function loadGtagScript(id: string): void {
  if (scriptLoaded || typeof document === "undefined") return;
  ensureGtagStub();
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
  scriptLoaded = true;

  window.gtag("js", new Date());
}

function configure(id: string): void {
  if (configured) return;
  ensureGtagStub();
  window.gtag("config", id, {
    anonymize_ip: true,
    send_page_view: false,
  });
  configured = true;
}

/** Apply analytics consent and load/config GA when newly granted. */
export function setAnalyticsConsent(granted: boolean): void {
  analyticsGranted = granted;
  if (typeof window === "undefined") return;

  initConsentDefaults();
  const id = measurementId();

  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });

  if (granted && id) {
    loadGtagScript(id);
    configure(id);
  }
}

export function isAnalyticsGranted(): boolean {
  return analyticsGranted;
}

export function hasGtagScript(): boolean {
  return scriptLoaded;
}

/** Reset module state — tests only. */
export function __resetAnalyticsForTests(): void {
  scriptLoaded = false;
  configured = false;
  analyticsGranted = false;
  defaultsReady = false;
}

export function trackPageView(path: string): void {
  if (!analyticsGranted) return;
  const id = measurementId();
  if (!id || typeof window === "undefined") return;
  ensureGtagStub();
  window.gtag("event", "page_view", {
    page_path: path,
    send_to: id,
  });
}

export function trackEvent(name: string, params?: EventParams): void {
  if (!analyticsGranted || typeof window === "undefined") return;
  if (!measurementId()) return;
  ensureGtagStub();
  window.gtag("event", name, params);
}

export function trackOutbound(linkId: string, href: string): void {
  let destination: string | undefined;
  try {
    destination = new URL(href, typeof window !== "undefined" ? window.location.origin : "https://davideghiotto.it").host;
  } catch {
    destination = undefined;
  }
  trackEvent("outbound_click", { link_id: linkId, destination });
}

export function readStoredConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (typeof parsed?.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredConsent(analytics: boolean): ConsentRecord {
  const record: ConsentRecord = {
    analytics,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  }
  return record;
}
