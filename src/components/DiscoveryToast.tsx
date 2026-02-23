import { motion, AnimatePresence } from "framer-motion";
import { useUtmDetection } from "@/hooks/useUtmDetection";
import { useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

export default function DiscoveryToast() {
  const { company, dismiss } = useUtmDetection();
  const navigate = useNavigate();

  const handleEnter = () => {
    if (company) {
      navigate(`/discovery/${encodeURIComponent(company)}`);
      dismiss();
    }
  };

  return (
    <AnimatePresence>
      {company && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: 1.5 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[90vw] max-w-md"
        >
          <div className="card-themed p-5 flex flex-col gap-3 relative border border-primary/20">
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={18} />
              <span className="font-display text-sm font-semibold uppercase tracking-wider">
                Custom Experience
              </span>
            </div>

            <p className="font-display text-lg font-bold text-foreground leading-tight">
              Hey, are you here from{" "}
              <span className="text-primary">
                {decodeURIComponent(company).charAt(0).toUpperCase() +
                  decodeURIComponent(company).slice(1)}
              </span>
              ?
            </p>

            <p className="text-sm text-muted-foreground font-body">
              I've prepared a tailored experience showcasing why we'd be a great fit.
            </p>

            <button
              onClick={handleEnter}
              className="mt-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-primary text-primary-foreground font-display font-medium text-sm hover:opacity-90 transition-opacity"
              style={{ borderRadius: "var(--radius)" }}
            >
              Enter Custom Experience
              <Sparkles size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
