import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import { useLanguage } from "@/context/LanguageContext";
import { bio, principles, summary, ui } from "@/data/content";
import { trackEvent, trackOutbound } from "@/lib/analytics";
import { Github, Linkedin, Mail, MapPin, Youtube } from "lucide-react";
import { channel } from "@/data/youtube";

export default function ProfileSection() {
  const { t } = useLanguage();

  return (
    <section id="profile" className="section-container section-spacing">
      <Reveal className="section-marker" stagger={0.06}>
        <span className="hud text-primary">05</span>
        <span className="hud">{t(ui.profile.label)}</span>
      </Reveal>

      <SplitReveal as="h2" text={t(ui.profile.title)} className="display-lg mt-12" />

      <div className="mt-16 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <SplitReveal
            text={t(summary)}
            className="text-base leading-relaxed text-muted-foreground md:text-lg"
          />

          <Reveal className="mt-12" stagger={0.1}>
            <h3 className="hud mb-6">{t(ui.profile.principles)}</h3>
            <ul className="space-y-4 border-t border-border pt-6">
              {t(principles).map((principle) => (
                <li key={principle} className="flex gap-4 text-sm md:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden />
                  <span className="text-muted-foreground">{principle}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal as="ul" selector=".contact-row" stagger={0.08} className="panel divide-y divide-border">
          <li className="contact-row flex items-center gap-4 p-5">
            <MapPin size={16} className="text-primary" />
            <span className="font-mono text-sm text-muted-foreground">{t(bio.location)}</span>
          </li>
          <li className="contact-row">
            <a
              href={`mailto:${bio.email}`}
              className="contact-link flex items-center gap-4 p-5 hover:text-primary"
              onClick={() => trackEvent("contact_click", { channel: "email" })}
            >
              <Mail size={16} className="text-primary" />
              <span className="font-mono text-sm">{bio.email}</span>
            </a>
          </li>
          <li className="contact-row">
            <a
              href={`https://www.linkedin.com/in/${bio.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link flex items-center gap-4 p-5 hover:text-primary"
              onClick={() => {
                trackEvent("contact_click", { channel: "linkedin" });
                trackOutbound(
                  "profile_linkedin",
                  `https://www.linkedin.com/in/${bio.linkedin}`
                );
              }}
            >
              <Linkedin size={16} className="text-primary" />
              <span className="font-mono text-sm">/{bio.linkedin}</span>
            </a>
          </li>
          <li className="contact-row">
            <a
              href={`https://github.com/${bio.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link flex items-center gap-4 p-5 hover:text-primary"
              onClick={() => {
                trackEvent("contact_click", { channel: "github" });
                trackOutbound("profile_github", `https://github.com/${bio.github}`);
              }}
            >
              <Github size={16} className="text-primary" />
              <span className="font-mono text-sm">/{bio.github}</span>
            </a>
          </li>
          <li className="contact-row">
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link flex items-center gap-4 p-5 hover:text-primary"
              onClick={() => {
                trackEvent("contact_click", { channel: "youtube" });
                trackOutbound("profile_youtube", channel.url);
              }}
            >
              <Youtube size={16} className="text-primary" />
              <span className="font-mono text-sm">{channel.handle}</span>
            </a>
          </li>
        </Reveal>
      </div>
    </section>
  );
}
