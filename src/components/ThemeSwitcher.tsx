import { useTheme, ThemeId } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Palette, X } from "lucide-react";

const themes: { id: ThemeId; label: string; description: string }[] = [
  { id: "modern", label: "Modern", description: "Playful SaaS" },
  { id: "luxury", label: "Luxury", description: "High-End Brand" },
  { id: "editorial", label: "Editorial", description: "Minimal Product" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="card-themed theme-transition p-2 flex flex-col gap-1 min-w-[200px]"
          >
            <div className="px-3 py-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Select Theme
            </div>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all
                  ${theme === t.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-foreground"
                  }
                `}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 flex-shrink-0 theme-transition"
                  style={{
                    borderColor: theme === t.id ? "currentColor" : "hsl(var(--muted-foreground))",
                    backgroundColor: theme === t.id ? "currentColor" : "transparent",
                  }}
                />
                <div>
                  <div className="font-display text-sm font-semibold">{t.label}</div>
                  <div className={`text-xs ${theme === t.id ? "opacity-70" : "text-muted-foreground"}`}>
                    {t.description}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg theme-transition"
        aria-label="Toggle theme switcher"
      >
        {open ? <X size={20} /> : <Palette size={20} />}
      </motion.button>
    </div>
  );
}
