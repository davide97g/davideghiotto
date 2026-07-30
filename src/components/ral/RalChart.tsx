import CompanyLogo from "@/components/ral/CompanyLogo";
import RevealRalButton from "@/components/ral/RevealRalButton";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import {
  companyById,
  currentRal,
  formatRal,
  formatRalMonth,
  formatRalShort,
  ralBumps,
  ralCompanies,
  type RalBump,
} from "@/data/ral";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useMemo, useRef } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Customized,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Point {
  t: number;
  label: string;
  amount: number;
  companyId: string;
  bumpId: string;
  note?: string;
}

function CompanyBands({
  xAxisMap,
  yAxisMap,
  offset,
}: {
  // Recharts Customized injects axis maps; keep them loose.
  xAxisMap?: Record<string, { scale: (v: number) => number }>;
  yAxisMap?: Record<string, { scale: (v: number) => number; domain: [number, number] }>;
  offset?: { top: number; left: number; height: number };
}) {
  const xAxis = xAxisMap && Object.values(xAxisMap)[0];
  const yAxis = yAxisMap && Object.values(yAxisMap)[0];
  if (!xAxis || !yAxis || !offset) return null;

  const [, yMax] = yAxis.domain;
  const top = yAxis.scale(yMax);
  const bottom = yAxis.scale(0);
  const height = Math.max(0, bottom - top);

  const now = Date.now();

  return (
    <g className="ral-bands" pointerEvents="none">
      {ralCompanies.map((company) => {
        const from = new Date(`${company.from}-01`).getTime();
        const to = company.to ? new Date(`${company.to}-01`).getTime() : now;
        const x1 = xAxis.scale(from);
        const x2 = xAxis.scale(to);
        const width = Math.max(0, x2 - x1);
        if (width < 1) return null;
        return (
          <g key={company.id}>
            <rect
              x={x1}
              y={top}
              width={width}
              height={height}
              fill={company.color}
              opacity={0.08}
            />
            <rect
              x={x1}
              y={top}
              width={2}
              height={height}
              fill={company.color}
              opacity={0.55}
            />
          </g>
        );
      })}
    </g>
  );
}

function LockedScrim({ onReveal }: { onReveal: () => void }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/70 to-background/25 backdrop-blur-[2px]">
      <RevealRalButton onClick={onReveal} size="compact" />
      <div
        className="pointer-events-none mt-8 h-px w-2/3 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        aria-hidden
      />
    </div>
  );
}

interface RalChartProps {
  unlocked: boolean;
  onReveal: () => void;
}

export default function RalChart({ unlocked, onReveal }: RalChartProps) {
  const { lang, t } = useLanguage();
  const scope = useRef<HTMLDivElement>(null);

  const data = useMemo<Point[]>(() => {
    return ralBumps.map((bump) => ({
      t: new Date(bump.date).getTime(),
      label: formatRalMonth(bump.date, lang),
      amount: bump.amount,
      companyId: bump.companyId,
      bumpId: bump.id,
      note: bump.note ? t(bump.note) : undefined,
    }));
  }, [lang, t]);

  // Extend the series to "now" so the last step doesn't stop mid-band.
  const series = useMemo(() => {
    const last = data[data.length - 1];
    if (!last) return data;
    return [
      ...data,
      {
        ...last,
        t: Date.now(),
        bumpId: "now",
        label: formatRalMonth(new Date().toISOString(), lang),
        note: undefined,
      },
    ];
  }, [data, lang]);

  const yMax = Math.ceil((currentRal.amount * 1.18) / 5000) * 5000;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".ral-chart-shell",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }
      );
    },
    { scope, dependencies: [unlocked] }
  );

  return (
    <div ref={scope} className="ral-chart-shell relative">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {ralCompanies.map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-2.5 border border-border px-2.5 py-1.5"
            style={{ borderColor: `${c.color}55` }}
          >
            <CompanyLogo company={c} size="sm" />
            <span className="hud text-muted-foreground">{c.name}</span>
          </span>
        ))}
      </div>

      <div className="panel relative overflow-hidden p-3 md:p-5">
        <div className="panel-ticks" aria-hidden />
        {!unlocked && <LockedScrim onReveal={onReveal} />}

        <div className={`h-[320px] w-full md:h-[420px] ${unlocked ? "" : "select-none"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={series} margin={{ top: 16, right: 12, left: 4, bottom: 8 }}>
              <defs>
                <linearGradient id="ralFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8CFF2E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#8CFF2E" stopOpacity={0} />
                </linearGradient>
              </defs>

              <Customized component={CompanyBands as never} />

              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeOpacity={0.55}
                vertical={false}
              />

              <XAxis
                dataKey="t"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v: number) =>
                  formatRalMonth(new Date(v).toISOString(), lang)
                }
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                minTickGap={48}
              />

              <YAxis
                domain={[0, yMax]}
                tickFormatter={(v: number) =>
                  unlocked ? formatRalShort(v) : "···"
                }
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />

              {unlocked && (
                <Tooltip
                  cursor={{ stroke: "hsl(var(--primary))", strokeOpacity: 0.35 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const point = payload[0]?.payload as Point | undefined;
                    if (!point || point.bumpId === "now") return null;
                    const company = companyById[point.companyId as keyof typeof companyById];
                    return (
                      <div className="border border-border bg-surface-raised px-3 py-2 shadow-xl">
                        <div className="flex items-center gap-2">
                          <CompanyLogo company={company} size="sm" />
                          <p className="hud" style={{ color: company.color }}>
                            {company.name}
                          </p>
                        </div>
                        <p className="mt-1 font-display text-xl font-bold tracking-tight">
                          {formatRal(point.amount, lang)}
                        </p>
                        <p className="mt-1 hud text-muted-foreground">{point.label}</p>
                        {point.note && (
                          <p className="mt-2 text-xs text-muted-foreground">{point.note}</p>
                        )}
                      </div>
                    );
                  }}
                />
              )}

              <Area
                type="stepAfter"
                dataKey="amount"
                stroke="#8CFF2E"
                strokeWidth={2.5}
                fill="url(#ralFill)"
                isAnimationActive={!prefersReducedMotion()}
                animationDuration={1200}
                animationEasing="ease-out"
                activeDot={
                  unlocked
                    ? {
                        r: 5,
                        fill: "#8CFF2E",
                        stroke: "#08090A",
                        strokeWidth: 2,
                      }
                    : false
                }
                dot={(props) => {
                  const { cx, cy, payload } = props as {
                    cx?: number;
                    cy?: number;
                    payload?: Point;
                  };
                  if (cx == null || cy == null || !payload || payload.bumpId === "now") {
                    return <g />;
                  }
                  const company = companyById[payload.companyId as keyof typeof companyById];
                  return (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={unlocked ? 5 : 4}
                        fill={company.color}
                        stroke="#08090A"
                        strokeWidth={2}
                      />
                      {unlocked && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={9}
                          fill="none"
                          stroke={company.color}
                          strokeOpacity={0.35}
                        />
                      )}
                    </g>
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4 border-t border-border/60 pt-3">
          <p className="hud text-muted-foreground">{t(ui.ral.chartAxis)}</p>
          <p className="hud hud-accent">
            {unlocked
              ? `${t(ui.ral.currentLabel)} ${formatRal(currentRal.amount, lang)}`
              : t(ui.ral.lockedHint)}
          </p>
        </div>
      </div>

      {unlocked && <BumpRail bumps={ralBumps} />}
    </div>
  );
}

function BumpRail({ bumps }: { bumps: RalBump[] }) {
  const { lang, t } = useLanguage();

  return (
    <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {bumps.map((bump) => {
        const company = companyById[bump.companyId];
        const prev = bumps[bumps.indexOf(bump) - 1];
        const delta = prev ? bump.amount - prev.amount : null;
        return (
          <li
            key={bump.id}
            className="panel panel-interactive relative overflow-hidden p-4"
            style={{ ["--bump-color" as string]: company.color }}
          >
            <span
              className="absolute inset-y-0 left-0 w-0.5"
              style={{ background: company.color }}
              aria-hidden
            />
            <div className="flex items-center justify-between gap-2">
              <CompanyLogo company={company} size="sm" />
              <span className="hud text-muted-foreground">
                {formatRalMonth(bump.date, lang)}
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight">
              {formatRal(bump.amount, lang)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{company.name}</p>
            {bump.note && (
              <p className="mt-2 text-xs text-muted-foreground">{t(bump.note)}</p>
            )}
            {delta != null && delta > 0 && (
              <p className="mt-2 hud hud-accent">+{formatRalShort(delta)}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
