import { useTheme } from "@/context/ThemeContext";
import { sectionOrder } from "@/data/content";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "@/components/portfolio/HeroSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import AboutSection from "@/components/portfolio/AboutSection";
import Footer from "@/components/portfolio/Footer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import DiscoveryToast from "@/components/DiscoveryToast";

const sectionComponents: Record<string, React.FC> = {
  hero: HeroSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  about: AboutSection,
};

const Index = () => {
  const { theme } = useTheme();
  const order = sectionOrder[theme];

  return (
    <div className="min-h-screen bg-background text-foreground theme-transition">
      <AnimatePresence mode="wait">
        <motion.main
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
      <ThemeSwitcher />
      <DiscoveryToast />
    </div>
  );
};

export default Index;
