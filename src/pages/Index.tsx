import Marquee from "@/components/motion/Marquee";
import Nav from "@/components/Nav";
import ChannelSection from "@/components/portfolio/ChannelSection";
import Footer from "@/components/portfolio/Footer";
import HeroSection from "@/components/portfolio/HeroSection";
import PathSection from "@/components/portfolio/PathSection";
import ProfileSection from "@/components/portfolio/ProfileSection";
import StackSection from "@/components/portfolio/StackSection";
import WorkSection from "@/components/portfolio/WorkSection";
import ScrollRail from "@/components/ScrollRail";
import ShaderBackdrop from "@/components/ShaderBackdrop";
import { useLanguage } from "@/context/LanguageContext";
import { marqueeTerms } from "@/data/content";
import { ScrollTrigger } from "@/lib/gsap";
import { useEffect } from "react";

const terms = marqueeTerms.map((term) => (
  <span key={term} className="font-display text-sm font-semibold uppercase tracking-[0.18em]">
    {term}
  </span>
));

export default function Index() {
  const { lang } = useLanguage();

  // Swapping language changes every text length, so every pinned section and
  // scrub range has to be re-measured.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [lang]);

  return (
    <div className="grain relative min-h-screen">
      <ShaderBackdrop />
      <Nav />
      <ScrollRail />

      <main>
        <HeroSection />
        <Marquee items={terms} className="marquee-invert" duration={40} />
        <ChannelSection />
        <WorkSection />
        <Marquee items={terms} direction="right" duration={46} />
        <StackSection />
        <PathSection />
        <ProfileSection />
      </main>

      <Footer />
    </div>
  );
}
