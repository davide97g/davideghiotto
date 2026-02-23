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
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm font-body text-muted-foreground">
          <p>© {year} {bio.name}. All rights reserved.</p>
          <span className="hidden sm:inline">·</span>
          <a href={`mailto:${bio.email}`} className="hover:text-primary transition-colors">
            {bio.email}
          </a>
          {bio.phone && (
            <>
              <span className="hidden sm:inline">·</span>
              <a href={`tel:${bio.phone}`} className="hover:text-primary transition-colors">
                {bio.phone}
              </a>
            </>
          )}
          {bio.linkedin && (
            <a
              href={`https://linkedin.com/in/${bio.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
        <p className="text-xs font-mono text-muted-foreground tracking-wider">
          Adaptive Theme Engine v1.0
        </p>
      </div>
    </footer>
  );
}
