import { useTheme } from "@/context/ThemeContext";
import { bio } from "@/data/content";

export default function Footer() {
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer
      className={`section-container py-8 border-t border-border theme-transition ${
        theme === "editorial" ? "border-t-2 border-foreground" : ""
      }`}
    >
      <div
        className={`flex flex-col md:flex-row justify-between items-center gap-4 ${
          theme === "luxury" ? "text-muted-foreground" : ""
        }`}
      >
        <p className="text-sm font-body text-muted-foreground">
          © {year} {bio.name}. All rights reserved.
        </p>
        <p className="text-xs font-mono text-muted-foreground tracking-wider">
          Adaptive Theme Engine v1.0
        </p>
      </div>
    </footer>
  );
}
