import type { RalCompany, RalLogoTreatment } from "@/data/ral";
import { cn } from "@/lib/utils";

const SIZE = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
} as const;

interface CompanyLogoProps {
  company: RalCompany;
  size?: keyof typeof SIZE;
  className?: string;
}

/**
 * Official employer mark with a per-brand frame:
 * - `round-white` — Reply / Bitrock (white disc, circular crop)
 * - `round` — Namirial (already a badge; clip to circle on white)
 * - `raw` — Infodati (keep the black square as delivered)
 */
export default function CompanyLogo({
  company,
  size = "md",
  className,
}: CompanyLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        SIZE[size],
        frameClass(company.logoTreatment),
        className
      )}
      title={company.name}
    >
      <img
        src={company.logo}
        alt=""
        aria-hidden
        className={cn("h-full w-full", imageClass(company.logoTreatment))}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

function frameClass(treatment: RalLogoTreatment): string {
  switch (treatment) {
    case "round-white":
      return "rounded-full bg-white p-0.5 ring-1 ring-border/60";
    case "round":
      return "rounded-full bg-white p-[2px] ring-1 ring-border/60";
    case "raw":
      return "rounded-sm bg-black ring-1 ring-border/60";
    default: {
      const _exhaustive: never = treatment;
      return _exhaustive;
    }
  }
}

function imageClass(treatment: RalLogoTreatment): string {
  switch (treatment) {
    case "round-white":
      return "rounded-full object-contain";
    case "round":
      return "rounded-full object-cover";
    case "raw":
      return "object-contain";
    default: {
      const _exhaustive: never = treatment;
      return _exhaustive;
    }
  }
}
