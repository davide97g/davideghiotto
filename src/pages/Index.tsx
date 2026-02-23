import DarkVeil from "@/components/DarkVeil";
import DiscoveryToast from "@/components/DiscoveryToast";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import Footer from "@/components/portfolio/Footer";
import HeroSection from "@/components/portfolio/HeroSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useTheme } from "@/context/ThemeContext";
import { sectionOrder } from "@/data/content";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

const sectionComponents: Record<string, React.FC> = {
  hero: HeroSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  about: AboutSection,
};

const Index = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.has("admin");
  const order = sectionOrder[theme];

  return (
    <div
      className={`min-h-screen text-foreground theme-transition relative ${theme === "modern" ? "dark-veil-background" : "bg-background"}`}
    >
      {theme === "modern" && (
        <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 w-full h-full min-w-[1080px] min-h-[1080px]">
            <DarkVeil
              hueShift={0}
              noiseIntensity={0}
              scanlineIntensity={0}
              speed={0.5}
              scanlineFrequency={0}
              warpAmount={0}
              resolutionScale={1}
            />
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.main className="relative z-10"
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {order.map((sectionId) => {
            const Component = sectionComponents[sectionId];
            return Component ? <Component key={sectionId} /> : null;
          })}
          <Footer />
        </motion.main>
      </AnimatePresence>
      {isAdmin && <ThemeSwitcher />}
      <DiscoveryToast />
    </div>
  );
};

export default Index;
