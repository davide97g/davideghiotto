import Reveal from "@/components/motion/Reveal";
import SplitReveal from "@/components/motion/SplitReveal";
import { useLanguage } from "@/context/LanguageContext";
import { stackGroups, ui } from "@/data/content";
import { DuckSectionMarker } from "@/components/ui/duck-section-marker";

export default function StackSection() {
  const { t } = useLanguage();

  return (
    <section id="stack" className="group/section section-container section-spacing">
      {/* Reveal has to stay the outer element: it needs a ref, and it
          staggers the parts of the marker rather than the marker itself. */}
      <Reveal selector="[data-slot='duck-section-marker'] > *" stagger={0.06}>
        <DuckSectionMarker index="03" className="border-b border-border pb-6">
          {t(ui.stack.label)}
        </DuckSectionMarker>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
        <SplitReveal as="h2" text={t(ui.stack.title)} className="display-lg" />
        <Reveal>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {t(ui.stack.lead)}
          </p>
        </Reveal>
      </div>

      <Reveal
        selector=".stack-group"
        stagger={0.1}
        className="mt-20 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3"
      >
        {stackGroups.map((group, i) => (
          <div key={group.name.en} className="stack-group bg-background p-7">
            <div className="mb-6 flex items-baseline justify-between">
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {t(group.name)}
              </h3>
              <span className="hud">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <ul className="space-y-2.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-mono text-sm text-muted-foreground"
                >
                  <span className="text-primary">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Fills the trailing grid cell so the container's border colour never
            shows through as an empty block. */}
        <div className="stack-group hidden bg-background p-7 md:block">
          <span className="hud mb-6 block">{t(ui.stack.nextLabel)}</span>
          <p className="font-mono text-sm text-muted-foreground">
            <span className="mr-2 text-primary animate-blink">▌</span>
            {t(ui.stack.nextValue)}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
