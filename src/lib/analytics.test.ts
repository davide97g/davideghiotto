import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  __resetAnalyticsForTests,
  hasGtagScript,
  initConsentDefaults,
  isAnalyticsGranted,
  readStoredConsent,
  setAnalyticsConsent,
  trackEvent,
  trackPageView,
  writeStoredConsent,
} from "./analytics";

describe("analytics consent gate", () => {
  beforeEach(() => {
    __resetAnalyticsForTests();
    localStorage.clear();
    document.head.innerHTML = "";
    // @ts-expect-error test cleanup
    delete window.gtag;
    // @ts-expect-error test cleanup
    delete window.dataLayer;
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TESTID123");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    __resetAnalyticsForTests();
  });

  it("sets Consent Mode defaults to denied before any grant", () => {
    initConsentDefaults();
    expect(window.dataLayer.length).toBeGreaterThan(0);
    const consentCall = window.dataLayer.find(
      (entry) => Array.isArray(entry) && entry[0] === "consent" && entry[1] === "default"
    ) as unknown[] | undefined;
    expect(consentCall?.[2]).toMatchObject({
      analytics_storage: "denied",
      ad_storage: "denied",
    });
    expect(hasGtagScript()).toBe(false);
  });

  it("does not load gtag until analytics is granted", () => {
    setAnalyticsConsent(false);
    expect(hasGtagScript()).toBe(false);
    expect(isAnalyticsGranted()).toBe(false);
    expect(document.querySelector('script[src*="googletagmanager.com"]')).toBeNull();

    setAnalyticsConsent(true);
    expect(hasGtagScript()).toBe(true);
    expect(isAnalyticsGranted()).toBe(true);
    expect(
      document.querySelector('script[src*="googletagmanager.com/gtag/js?id=G-TESTID123"]')
    ).not.toBeNull();
  });

  it("no-ops trackEvent and trackPageView when analytics is denied", () => {
    setAnalyticsConsent(false);
    const before = window.dataLayer?.length ?? 0;
    trackEvent("cta_click", { cta_id: "work" });
    trackPageView("/");
    const after = window.dataLayer?.length ?? 0;
    expect(after).toBe(before);
  });

  it("emits events after grant", () => {
    setAnalyticsConsent(true);
    trackEvent("cta_click", { cta_id: "ral" });
    trackPageView("/ral");
    const events = window.dataLayer.filter(
      (entry) => Array.isArray(entry) && entry[0] === "event"
    ) as unknown[][];
    expect(events.some((e) => e[1] === "cta_click")).toBe(true);
    expect(events.some((e) => e[1] === "page_view")).toBe(true);
  });

  it("persists consent choice", () => {
    writeStoredConsent(true);
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toContain('"analytics":true');
    expect(readStoredConsent()?.analytics).toBe(true);

    writeStoredConsent(false);
    expect(readStoredConsent()?.analytics).toBe(false);
  });

  it("skips script load when measurement id is empty", () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
    __resetAnalyticsForTests();
    setAnalyticsConsent(true);
    expect(hasGtagScript()).toBe(false);
  });
});
