'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { serviceAreas, WHATSAPP_URL } from '../data';

type Point = { x: number; y: number };
type Stop = { x: number; roadY: number; cy: number };

type Layout = {
  width: number;
  height: number;
  radius: number; // stop circle radius
  font: number;
  riderScale: number;
  road: string; // SVG path the rider follows
  stops: Stop[];
  trees: { x: number; y: number; r: number }[];
};

function smoothPath(pts: Point[]) {
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * A winding road that snakes across in lanes (alternating direction, joined by U-turns).
 * Within each lane it zig-zags toward each stop; stops alternate above/below the road by
 * column, so the circles of neighbouring lanes interlock instead of colliding.
 */
function buildLayout(opts: {
  width: number;
  height: number;
  bases: number[]; // lane centre lines
  xs: number[]; // stop columns, left→right
  amp: number; // zig-zag amplitude
  stopOffset: number; // distance from road to stop centre
  turnOut: number; // how far U-turns swing past the outer column
  leadIn: number;
  radius: number;
  font: number;
  riderScale: number;
  trees: { x: number; y: number; r: number }[];
}): Layout {
  const { bases, xs, amp, stopOffset, turnOut, leadIn } = opts;
  const first = xs[0];
  const last = xs[xs.length - 1];
  const way: Point[] = [{ x: first - leadIn, y: bases[0] }];
  const stops: Stop[] = [];

  bases.forEach((base, k) => {
    const rightward = k % 2 === 0;
    const order = xs.map((x, i) => ({ x, i }));
    if (!rightward) order.reverse();
    order.forEach(({ x, i }) => {
      const above = i % 2 === 0;
      const roadY = base + (above ? -amp : amp);
      way.push({ x, y: roadY });
      stops.push({ x, roadY, cy: roadY + (above ? -stopOffset : stopOffset) });
    });

    const next = bases[k + 1];
    if (next !== undefined) {
      const edge = rightward ? last : first;
      const dir = rightward ? 1 : -1;
      const gap = next - base;
      [
        [0.75, 0.2],
        [1, 0.5],
        [0.75, 0.8],
      ].forEach(([fx, fy]) => way.push({ x: edge + dir * turnOut * fx, y: base + gap * fy }));
    } else {
      way.push({ x: rightward ? last + leadIn : first - leadIn, y: base });
    }
  });

  return { ...opts, road: smoothPath(way), stops: stops.slice(0, serviceAreas.length) };
}

const desktopLayout = buildLayout({
  width: 1240,
  height: 690,
  bases: [230, 450],
  xs: [140, 330, 520, 710, 900, 1090],
  amp: 35,
  stopOffset: 120,
  turnOut: 125,
  leadIn: 170,
  radius: 64,
  font: 15,
  riderScale: 0.72,
  trees: [
    { x: 235, y: 340, r: 15 },
    { x: 425, y: 340, r: 11 },
    { x: 615, y: 340, r: 14 },
    { x: 805, y: 340, r: 10 },
    { x: 995, y: 340, r: 13 },
    { x: 40, y: 110, r: 12 },
    { x: 1200, y: 610, r: 12 },
  ],
});

const mobileLayout = buildLayout({
  width: 420,
  height: 1400,
  bases: [190, 390, 590, 790, 990, 1190],
  xs: [110, 290],
  amp: 25,
  stopOffset: 103,
  turnOut: 100,
  leadIn: 160,
  radius: 58,
  font: 14,
  riderScale: 0.5,
  trees: [0, 1, 2, 3, 4].map((k) => ({ x: 200, y: 290 + k * 200, r: 11 })),
});

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const WHEEL_R = 14;

/** Side view, facing right. Origin = ground point between the wheels. */
function Rider({ rearWheel, frontWheel }: { rearWheel: React.Ref<SVGGElement>; frontWheel: React.Ref<SVGGElement> }) {
  const wheel = (cx: number, ref: React.Ref<SVGGElement>) => (
    <g>
      <circle cx={cx} cy={-WHEEL_R} r={WHEEL_R} fill="#111827" />
      <circle cx={cx} cy={-WHEEL_R} r={WHEEL_R - 4} fill="#374151" />
      <g ref={ref}>
        <circle cx={cx} cy={-WHEEL_R} r="6" fill="#d1d5db" />
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1={cx}
            y1={-WHEEL_R - 9}
            x2={cx}
            y2={-WHEEL_R + 9}
            stroke="#e5e7eb"
            strokeWidth="1.6"
            transform={`rotate(${a} ${cx} ${-WHEEL_R})`}
          />
        ))}
        <circle cx={cx} cy={-WHEEL_R} r="2.2" fill="#4b5563" />
      </g>
    </g>
  );

  return (
    <g filter="url(#rd-shadow)">
      {/* headlight */}
      <path d="M44 -50 L150 -80 L150 -16 Z" fill="url(#rd-beam)" />

      {/* delivery box */}
      <rect x="-60" y="-90" width="42" height="36" rx="5" fill="url(#rd-box)" />
      <rect x="-60" y="-90" width="42" height="8" rx="4" fill="#ffffff" opacity="0.2" />
      <text x="-39" y="-67" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#fff" fontFamily="Arial">
        Cleanova
      </text>
      <path d="M-52 -54 H-22 L-18 -44" stroke="#4b5563" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* scooter */}
      <path d="M-46 -22 C-50 -36 -38 -47 -16 -47 H2 C8 -47 9 -40 4 -36 L-10 -24 Z" fill="url(#rd-body)" stroke="#cbd5e1" strokeWidth="0.8" />
      <path d="M-44 -30 C-30 -34 -14 -34 0 -38" stroke="#0d7e9a" strokeWidth="2.5" fill="none" />
      <path d="M-24 -20 H24" stroke="#374151" strokeWidth="5" strokeLinecap="round" />
      <path d="M18 -20 L29 -56 C30 -61 36 -61 37 -56 L41 -30 C42 -24 37 -19 31 -19 Z" fill="url(#rd-body)" stroke="#cbd5e1" strokeWidth="0.8" />
      <path d="M34 -16 L37 -44" stroke="#4b5563" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="41" cy="-50" r="3.2" fill="#fde68a" />
      <path d="M31 -64 L44 -62" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M-36 -48 C-32 -54 -6 -54 2 -48 Z" fill="#111827" />

      {wheel(-30, rearWheel)}
      {wheel(34, frontWheel)}

      {/* rider */}
      <path d="M-14 -52 L7 -46 L13 -24" stroke="#1f2937" strokeWidth="7.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 -22 H20" stroke="#0b0f19" strokeWidth="5" strokeLinecap="round" />
      <path d="M-20 -50 C-22 -66 -16 -82 -6 -86 C2 -88 6 -80 4 -70 L-2 -50 Z" fill="url(#rd-jacket)" />
      <path d="M-4 -80 C6 -76 18 -68 32 -64" stroke="#0b5a65" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="-64" r="3" fill="#b07a4f" />
      <rect x="-6" y="-92" width="7" height="7" rx="2" fill="#b07a4f" />
      <circle cx="-1" cy="-99" r="9.5" fill="#b07a4f" />
      <path d="M-12 -99 C-12 -112 10 -114 11 -100 L11 -96 L-12 -96 Z" fill="url(#rd-helmet)" />
      <path d="M3 -103 C8 -103 11 -100 11 -96 L3 -96 Z" fill="#111827" opacity="0.85" />
    </g>
  );
}

function RoadMap({ layout, progress, onCurrent }: { layout: Layout; progress: number; onCurrent: (i: number) => void }) {
  const pathRef = useRef<SVGPathElement>(null);
  const riderRef = useRef<SVGGElement>(null);
  const rearRef = useRef<SVGGElement>(null);
  const frontRef = useRef<SVGGElement>(null);
  const flipRef = useRef(1);
  const [stopLens, setStopLens] = useState<number[]>([]);

  const n = layout.stops.length;
  const seg = progress * (n - 1);
  const current = Math.min(n - 1, Math.round(seg));

  useEffect(() => onCurrent(current), [current, onCurrent]);

  // where each stop sits along the road: sample the path once (coarse), then refine each stop locally.
  // (getPointAtLength is slow — calling it thousands of times froze the page for seconds.)
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const samples = 240;
    const step = total / samples;
    const pts = Array.from({ length: samples + 1 }, (_, i) => path.getPointAtLength(i * step));
    const dist = (l: number, s: Stop) => {
      const q = path.getPointAtLength(l);
      return (q.x - s.x) ** 2 + (q.y - s.roadY) ** 2;
    };
    setStopLens(
      layout.stops.map((s) => {
        let bestI = 0;
        let bestD = Infinity;
        pts.forEach((q, i) => {
          const d = (q.x - s.x) ** 2 + (q.y - s.roadY) ** 2;
          if (d < bestD) {
            bestD = d;
            bestI = i;
          }
        });
        // ternary search inside the neighbouring samples
        let lo = Math.max(0, (bestI - 1) * step);
        let hi = Math.min(total, (bestI + 1) * step);
        for (let k = 0; k < 16; k++) {
          const m1 = lo + (hi - lo) / 3;
          const m2 = hi - (hi - lo) / 3;
          if (dist(m1, s) < dist(m2, s)) hi = m2;
          else lo = m1;
        }
        return (lo + hi) / 2;
      }),
    );
  }, [layout]);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const rider = riderRef.current;
    if (!path || !rider || stopLens.length !== n) return;

    // ease between stops so the rider slows down and "stops" at each area
    const i = Math.min(Math.floor(seg), n - 2);
    const t = seg - i;
    const at = stopLens[i] + (stopLens[i + 1] - stopLens[i]) * easeInOut(t);
    const total = path.getTotalLength();
    const p = path.getPointAtLength(at);
    const a = path.getPointAtLength(Math.max(0, at - 3));
    const b = path.getPointAtLength(Math.min(total, at + 3));
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (Math.abs(dx) > 0.5) flipRef.current = dx < 0 ? -1 : 1;
    const flip = flipRef.current;
    const lean = Math.max(-35, Math.min(35, (Math.atan2(dy, Math.abs(dx) || 0.001) * 180) / Math.PI)) * flip;
    const s = layout.riderScale;

    rider.setAttribute('transform', `translate(${p.x} ${p.y + 12 * s}) rotate(${lean}) scale(${flip * s} ${s})`);
    const spin = (at / (2 * Math.PI * WHEEL_R)) * 360;
    rearRef.current?.setAttribute('transform', `rotate(${spin} -30 ${-WHEEL_R})`);
    frontRef.current?.setAttribute('transform', `rotate(${spin} 34 ${-WHEEL_R})`);
  }, [seg, n, stopLens, layout]);

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const fs = (units: number) => `${(units / layout.width) * 100}cqw`;
  const r = layout.radius;

  return (
    <div className="relative w-full [container-type:inline-size]" style={{ aspectRatio: `${layout.width} / ${layout.height}` }}>
      <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden>
        <defs>
          <linearGradient id="rd-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rd-box" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d7e9a" />
            <stop offset="100%" stopColor="#0b5a65" />
          </linearGradient>
          <linearGradient id="rd-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="rd-jacket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f8aa8" />
            <stop offset="100%" stopColor="#0b5a65" />
          </linearGradient>
          <linearGradient id="rd-helmet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <filter id="rd-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>
          <filter id="rd-road-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0b5a65" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* trees */}
        {layout.trees.map((t) => (
          <g key={`${t.x}-${t.y}`}>
            <ellipse cx={t.x + 3} cy={t.y + t.r * 0.9} rx={t.r * 0.9} ry={t.r * 0.3} fill="#0f172a" opacity="0.08" />
            <circle cx={t.x} cy={t.y} r={t.r} fill="#4ade80" />
            <circle cx={t.x} cy={t.y} r={t.r} fill="#15803d" opacity="0.35" />
            <circle cx={t.x - t.r * 0.3} cy={t.y - t.r * 0.35} r={t.r * 0.45} fill="#bbf7d0" opacity="0.6" />
          </g>
        ))}

        {/* road: shadow + kerb, asphalt, edge lines, centre dashes */}
        <g filter="url(#rd-road-shadow)">
          <path d={layout.road} stroke="#e2e8f0" strokeWidth="54" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d={layout.road} stroke="#374151" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" />
        <path d={layout.road} stroke="#f8fafc" strokeOpacity="0.55" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
        <path d={layout.road} stroke="#374151" strokeWidth="37" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={pathRef} d={layout.road} stroke="#fde68a" strokeWidth="2.5" strokeDasharray="16 14" />

        {/* stop connectors + kerb pins */}
        {layout.stops.map((s, i) => {
          const reached = i <= current;
          const dir = Math.sign(s.cy - s.roadY);
          return (
            <g key={i}>
              <line
                x1={s.x}
                y1={s.cy - dir * r}
                x2={s.x}
                y2={s.roadY + dir * 27}
                stroke={reached ? '#0d7e9a' : '#94a3b8'}
                strokeWidth="2"
                strokeDasharray="4 5"
              />
              <circle cx={s.x} cy={s.roadY + dir * 27} r="6" fill={reached ? '#0d7e9a' : '#cbd5e1'} stroke="#fff" strokeWidth="2.5" />
            </g>
          );
        })}

        <g ref={riderRef} transform="translate(-999 -999)">
          <Rider rearWheel={rearRef} frontWheel={frontRef} />
        </g>
      </svg>

      {/* stop circles */}
      {serviceAreas.map((area, i) => {
        const s = layout.stops[i];
        const isCurrent = i === current;
        const visited = i < current;
        return (
          <div
            key={area.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(s.x, layout.width), top: pct(s.cy, layout.height), width: pct(r * 2, layout.width) }}
          >
            {isCurrent && <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/30 [animation-duration:1.8s]" />}
            <div
              className={`relative flex aspect-square flex-col items-center justify-center rounded-full px-[8%] text-center transition-all duration-500 ${
                isCurrent
                  ? 'scale-110 bg-gradient-to-br from-[#0d7e9a] to-[#0b5a65] text-white shadow-[0_18px_40px_-8px_rgba(13,126,154,0.6)] ring-4 ring-white'
                  : visited
                    ? 'bg-white text-slate-900 shadow-soft ring-2 ring-[#0d7e9a]/50'
                    : 'bg-white text-slate-700 shadow-soft ring-1 ring-sky-100'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`mb-[4%] w-[20%] ${isCurrent ? 'text-cyan-200' : visited ? 'text-[#0d7e9a]' : 'text-slate-300'}`}
                fill="currentColor"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <span className="font-black leading-tight" style={{ fontSize: fs(layout.font) }}>
                {area.lines[0]}
              </span>
              {area.lines[1] && (
                <span className="font-semibold leading-tight opacity-80" style={{ fontSize: fs(layout.font * 0.82) }}>
                  {area.lines[1]}
                </span>
              )}
              <span
                className={`mt-[5%] rounded-full px-[10%] py-[2%] font-bold uppercase tracking-wider ${
                  isCurrent ? 'bg-white text-[#0b5a65]' : visited ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
                style={{ fontSize: fs(layout.font * 0.55) }}
              >
                {visited ? '✓ Delivered' : isCurrent ? 'Arrived' : `Stop ${String(i + 1).padStart(2, '0')}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Readout({ progress, idx }: { progress: number; idx: number }) {
  return (
    <div className="flex items-center gap-4 rounded-full border border-white bg-white/90 py-2 pl-2 pr-5 shadow-soft ring-1 ring-sky-100 backdrop-blur-md">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0d7e9a] to-[#0b5a65] shadow-lg shadow-sky-900/20">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="5.5" cy="17" r="2.5" />
          <circle cx="18.5" cy="17" r="2.5" />
          <path d="M8 17h7l3-7h2M10 12h4M5 12h3" />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0d7e9a]">Rider now in</p>
        <p key={idx} className="animate-fade-up truncate text-base font-black text-slate-900">
          {serviceAreas[idx].name}
        </p>
      </div>
      <div className="ml-auto hidden w-28 sm:block">
        <p className="text-right text-xs font-bold text-slate-500">
          {String(idx + 1).padStart(2, '0')} / {String(serviceAreas.length).padStart(2, '0')}
        </p>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-sky-100">
          <div className="h-full rounded-full bg-gradient-to-r from-[#0d7e9a] to-cyan-400" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Where we operate</p>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
        All across{' '}
        <span className="animate-gradient-x bg-gradient-to-r from-sky-600 via-cyan-400 to-teal-500 bg-[length:200%_auto] bg-clip-text text-transparent">
          Bengaluru
        </span>
      </h2>
      <p className="mt-3 text-lg text-slate-600">
        Our riders pick up and deliver across {serviceAreas.length} neighbourhoods — scroll to ride along.
      </p>
    </div>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-sky-50" />
      <div
        className="absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        style={{ backgroundImage: 'radial-gradient(#bae6fd 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="absolute -left-40 top-1/4 h-96 w-96 animate-blob bg-cyan-100/70 blur-3xl" />
      <div className="absolute -right-40 bottom-10 h-96 w-96 animate-blob bg-sky-100 blur-3xl" style={{ animationDelay: '-7s' }} />
    </div>
  );
}

export default function Coverage() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  // null until mounted: only the layout for the current screen is rendered, so its path can be measured
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let target = 0;
    let value = 0;
    let frame = 0;
    const mq = window.matchMedia('(min-width: 1024px)');

    const measure = () => {
      const vh = window.innerHeight;
      if (mq.matches) {
        const rect = desktopRef.current?.getBoundingClientRect();
        if (!rect) return;
        target = Math.min(1, Math.max(0, -rect.top / (rect.height - vh)));
      } else {
        const rect = mobileRef.current?.getBoundingClientRect();
        if (!rect) return;
        target = Math.min(1, Math.max(0, (vh * 0.5 - rect.top) / rect.height));
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // ease toward the scroll position so the rider glides instead of jumping
    const tick = () => {
      value += (target - value) * 0.1;
      if (Math.abs(target - value) < 0.0005) value = target;
      setProgress(value);
      frame = value === target ? 0 : requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="coverage" className="relative scroll-mt-20 overflow-x-clip bg-sky-50">
      {/* desktop: pinned stage while the rider travels */}
      <div ref={desktopRef} className="relative hidden h-[320vh] lg:block">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-3 overflow-hidden py-6">
          <Backdrop />
          <div className="relative">
            <Heading />
          </div>
          <div className="container-shell relative flex min-h-0 w-full flex-1 items-center justify-center">
            <div className="w-full" style={{ maxWidth: `calc(66vh * ${desktopLayout.width / desktopLayout.height})` }}>
              {isDesktop === true && <RoadMap layout={desktopLayout} progress={progress} onCurrent={setCurrent} />}
            </div>
          </div>
          <div className="relative w-full max-w-md px-4">
            <Readout progress={progress} idx={current} />
          </div>
        </div>
      </div>

      {/* mobile: road snakes down the page */}
      <div className="relative py-20 lg:hidden">
        <Backdrop />
        <div className="container-shell relative">
          <Heading />
          <div ref={mobileRef} className="mx-auto mt-10 max-w-sm">
            {isDesktop === false && <RoadMap layout={mobileLayout} progress={progress} onCurrent={setCurrent} />}
          </div>
          <div className="sticky bottom-4 z-10 mx-auto mt-8 max-w-sm">
            <Readout progress={progress} idx={current} />
          </div>
        </div>
      </div>

      <div className="relative bg-sky-50 pb-14 pt-6 text-center">
        <p className="text-slate-600">
          Don&apos;t see your area?{' '}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#0d7e9a] underline decoration-cyan-300 underline-offset-4 hover:text-[#0b5a65]"
          >
            Ask us on WhatsApp
          </a>{' '}
          — we&apos;re expanding fast.
        </p>
      </div>
    </section>
  );
}
