import CompanyLogo from "@/components/ral/CompanyLogo";
import RevealRalButton from "@/components/ral/RevealRalButton";
import { useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/content";
import {
  companyById,
  formatRal,
  formatRalMonth,
  formatRalShort,
  ralBumps,
  ralCompanies,
  type RalBump,
  type RalCompanyId,
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

/**
 * Exclusive salary tenures for chart bands — first bump per company through
 * the next company's first bump. Avoids the CV Infodati/Namirial overlap that
 * muddied the mid-chart framing.
 */
function salaryBandRanges(now = Date.now()) {
  const firstBumpAt = new Map<RalCompanyId, number>();
  for (const bump of ralBumps) {
    if (!firstBumpAt.has(bump.companyId)) {
      firstBumpAt.set(bump.companyId, new Date(bump.date).getTime());
    }
  }

  return ralCompanies.map((company, index) => {
    const from =
      firstBumpAt.get(company.id) ?? new Date(`${company.from}-01`).getTime();
    const next = ralCompanies[index + 1];
    const to = next
      ? (firstBumpAt.get(next.id) ?? new Date(`${next.from}-01`).getTime())
      : now;
    return { company, from, to };
  });
}

function CompanyBands({
  xAxisMap,
  yAxisMap,
}: {
  // Recharts Customized injects axis maps; keep them loose.
  xAxisMap?: Record<string, { scale: (v: number) => number }>;
  yAxisMap?: Record<string, { scale: (v: number) => number; domain: [number, number] }>;
  offset?: { top: number; left: number; height: number };
}) {
  const xAxis = xAxisMap && Object.values(xAxisMap)[0];
  const yAxis = yAxisMap && Object.values(yAxisMap)[0];
  if (!xAxis || !yAxis) return null;

  const [, yMax] = yAxis.domain;
  const top = yAxis.scale(yMax);
  const bottom = yAxis.scale(0);
  const height = Math.max(0, bottom - top);
  const bands = salaryBandRanges();

  return (
    <g className="ral-bands" pointerEvents="none">
      <defs>
        {bands.map(({ company }) => (
          <linearGradient
            key={`grad-${company.id}`}
            id={`ral-band-${company.id}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor={company.color} stopOpacity={0.32} />
            <stop offset="40%" stopColor={company.color} stopOpacity={0.16} />
            <stop offset="100%" stopColor={company.color} stopOpacity={0.07} />
          </linearGradient>
        ))}
        {/* Namirial reads as black & white: pale wash + fine white hatch. */}
        <pattern
          id="ral-namirial-hatch"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(28)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="7"
            stroke="#FFFFFF"
            strokeWidth="1.25"
            strokeOpacity="0.16"
          />
        </pattern>
      </defs>

      {bands.map(({ company, from, to }) => {
        const x1 = xAxis.scale(from);
        const x2 = xAxis.scale(to);
        const width = Math.max(0, x2 - x1);
        if (width < 1) return null;

        const isNamirial = company.id === "namirial";
        const edge = isNamirial ? "#FFFFFF" : company.color;

        return (
          <g key={company.id}>
            {isNamirial && (
              <rect
                x={x1}
                y={top}
                width={width}
                height={height}
                fill="#111111"
                opacity={0.55}
              />
            )}
            <rect
              x={x1}
              y={top}
              width={width}
              height={height}
              fill={`url(#ral-band-${company.id})`}
            />
            {isNamirial && (
              <rect
                x={x1}
                y={top}
                width={width}
                height={height}
                fill="url(#ral-namirial-hatch)"
              />
            )}
            {/* Top brand rail — reads company colour even when the wash is soft. */}
            <rect
              x={x1}
              y={top}
              width={width}
              height={3}
              fill={edge}
              opacity={0.9}
            />
            {/* Soft edge bloom, then a crisp 3px divider at each company start. */}
            <rect
              x={x1}
              y={top}
              width={10}
              height={height}
              fill={edge}
              opacity={0.22}
            />
            <rect
              x={x1}
              y={top}
              width={3}
              height={height}
              fill={edge}
              opacity={1}
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
  bumps: RalBump[];
  currentAmount: number | null;
  onReveal: () => void;
}

export default function RalChart({
  unlocked,
  bumps,
  currentAmount,
  onReveal,
}: RalChartProps) {
  const { lang, t } = useLanguage();
  const scope = useRef<HTMLDivElement>(null);

  const data = useMemo<Point[]>(() => {
    return bumps
      .filter((bump) => typeof bump.amount === "number")
      .map((bump) => ({
        t: new Date(bump.date).getTime(),
        label: formatRalMonth(bump.date, lang),
        amount: bump.amount as number,
        companyId: bump.companyId,
        bumpId: bump.id,
        note: bump.note ? t(bump.note) : undefined,
      }));
  }, [bumps, lang, t]);

  const axisSeries = useMemo(() => {
    const points = bumps.map((bump) => ({
      t: new Date(bump.date).getTime(),
      amount: 0,
      bumpId: bump.id,
      companyId: bump.companyId,
      label: formatRalMonth(bump.date, lang),
    }));
    const last = points[points.length - 1];
    if (!last) return points;
    return [
      ...points,
      {
        ...last,
        t: Date.now(),
        bumpId: "now",
        label: formatRalMonth(new Date().toISOString(), lang),
      },
    ];
  }, [bumps, lang]);

  // Salary series only when unlocked — locked chart keeps the time axis + company bands.
  const series = useMemo(() => {
    if (!unlocked || !data.length) return axisSeries;
    const last = data[data.length - 1];
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
  }, [axisSeries, data, lang, unlocked]);

  const yMax = Math.ceil(((currentAmount ?? 50_000) * 1.18) / 5000) * 5000;

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
                stroke="var(--border)"
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
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                minTickGap={48}
              />

              <YAxis
                domain={[0, yMax]}
                tickFormatter={(v: number) =>
                  unlocked ? formatRalShort(v) : "···"
                }
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />

              {unlocked && (
                <Tooltip
                  cursor={{ stroke: "var(--primary)", strokeOpacity: 0.35 }}
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

              {unlocked && series.length > 0 && (
                <Area
                  type="stepAfter"
                  dataKey="amount"
                  stroke="#8CFF2E"
                  strokeWidth={2.5}
                  fill="url(#ralFill)"
                  isAnimationActive={!prefersReducedMotion()}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  activeDot={{
                    r: 5,
                    fill: "#8CFF2E",
                    stroke: "#08090A",
                    strokeWidth: 2,
                  }}
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
                          r={5}
                          fill={company.color}
                          stroke="#08090A"
                          strokeWidth={2}
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={9}
                          fill="none"
                          stroke={company.color}
                          strokeOpacity={0.35}
                        />
                      </g>
                    );
                  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4 border-t border-border/60 pt-3">
          <p className="hud text-muted-foreground">{t(ui.ral.chartAxis)}</p>
          <p className="hud text-primary">
            {unlocked && currentAmount != null
              ? `${t(ui.ral.currentLabel)} ${formatRal(currentAmount, lang)}`
              : t(ui.ral.lockedHint)}
          </p>
        </div>
      </div>

      {unlocked && <BumpRail bumps={bumps} />}
    </div>
  );
}

function BumpRail({ bumps }: { bumps: RalBump[] }) {
  const { lang, t } = useLanguage();

  return (
    <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {bumps.map((bump, index) => {
        if (typeof bump.amount !== "number") return null;
        const company = companyById[bump.companyId];
        const prev = bumps[index - 1];
        const delta =
          prev && typeof prev.amount === "number" ? bump.amount - prev.amount : null;
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
              <p className="mt-2 hud text-primary">+{formatRalShort(delta)}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
