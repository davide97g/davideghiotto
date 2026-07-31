import { useConsent } from "@/context/ConsentContext";
import { trackPageView } from "@/lib/analytics";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Sends a GA4 page_view on every client-side route change when analytics is on. */
export default function AnalyticsRouteListener() {
  const { pathname, search } = useLocation();
  const { decided, analytics } = useConsent();

  useEffect(() => {
    if (!decided || !analytics) return;
    trackPageView(`${pathname}${search}`);
  }, [pathname, search, decided, analytics]);

  return null;
}
