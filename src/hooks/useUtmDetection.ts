import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useUtmDetection() {
  const [searchParams] = useSearchParams();
  const [company, setCompany] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const source = searchParams.get("utm_source");
    if (source && !sessionStorage.getItem(`discovery_dismissed_${source}`)) {
      setCompany(source);
    }
  }, [searchParams]);

  const dismiss = () => {
    if (company) {
      sessionStorage.setItem(`discovery_dismissed_${company}`, "true");
    }
    setDismissed(true);
    setCompany(null);
  };

  return { company: dismissed ? null : company, dismiss };
}
