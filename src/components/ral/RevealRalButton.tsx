import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import { Eye, Sparkles } from "lucide-react";

interface RevealRalButtonProps {
  onClick: () => void;
  /** Larger hero treatment vs compact chart overlay. */
  size?: "hero" | "compact";
  className?: string;
}

export default function RevealRalButton({
  onClick,
  size = "hero",
  className = "",
}: RevealRalButtonProps) {
  const { t } = useLanguage();
  const compact = size === "compact";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-ral group ${compact ? "btn-ral-compact" : ""} ${className}`.trim()}
    >
      <span className="btn-ral-glow" aria-hidden />
      {compact ? (
        <Eye size={13} className="relative text-primary" />
      ) : (
        <Sparkles size={14} className="relative text-primary" />
      )}
      <span className="relative flex flex-col items-start gap-0.5 text-left">
        <span>{t(ui.ral.reveal)}</span>
        {!compact && (
          <span className="text-[0.6rem] font-normal tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-primary/80">
            {t(ui.ral.revealHint)}
          </span>
        )}
      </span>
    </button>
  );
}
