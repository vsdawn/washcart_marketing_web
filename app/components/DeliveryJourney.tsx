'use client';

import { useEffect, useRef, useState } from 'react';

const timeline = [
  { key: 'pickup', duration: 2000 },
  { key: 'to-centre', duration: 3400 },
  { key: 'cleaning', duration: 3900 },
  { key: 'to-home', duration: 3400 },
  { key: 'delivered', duration: 2600 },
] as const;

const TOTAL = timeline.reduce((sum, p) => sum + p.duration, 0);

const statusText = [
  'Rider at your doorstep',
  'Heading to care centre',
  'Cleaning in progress',
  'Arriving in 12 min',
  'Delivered · 10:42 AM',
];

const cleaningSteps = ['Washing', 'Steam pressing', 'Quality check'];

const ROUTE = 'M40 128 H160 Q172 128 172 116 V76 Q172 64 184 64 H312';
const HOME = { x: 40, y: 128 };
const CENTRE = { x: 312, y: 64 };
const RING = 2 * Math.PI * 14;

const blocks = [
  [8, 8, 68, 48], [92, 8, 72, 48], [180, 8, 56, 48], [252, 8, 100, 48],
  [8, 72, 68, 48], [92, 72, 72, 48], [180, 72, 56, 48], [252, 72, 100, 48],
  [8, 136, 68, 56], [180, 136, 56, 56], [252, 136, 100, 56],
];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const icons = {
  bag: <path d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2" />,
  route: <path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 15V9a3 3 0 0 1 3-3h7M18 9v6a3 3 0 0 1-3 3H8" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" />,
  scooter: <path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM7 16h8l3-7h2M9 12h5" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};

const steps = [
  { label: 'Picked up', icon: icons.bag },
  { label: 'In transit', icon: icons.route },
  { label: 'Cleaning', icon: icons.sparkle },
  { label: 'Delivering', icon: icons.scooter },
  { label: 'Delivered', icon: icons.check },
];

function Icon({ children, className = 'h-4 w-4' }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export default function DeliveryJourney() {
  const [phase, setPhase] = useState(0);
  const [subStep, setSubStep] = useState(0);

  const routeRef = useRef<SVGPathElement>(null);
  const outboundRef = useRef<SVGPathElement>(null);
  const returnRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;

    const len = route.getTotalLength();
    outboundRef.current?.setAttribute('stroke-dasharray', `${len} ${len}`);
    returnRef.current?.setAttribute('stroke-dasharray', `${len} ${len}`);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = (t: number) => (reduced ? (t < 0.5 ? 0 : 1) : easeInOut(t));

    let lastPhase = -1;
    let lastSub = -1;
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      let elapsed = (now - start) % TOTAL;
      let i = 0;
      while (elapsed >= timeline[i].duration) {
        elapsed -= timeline[i].duration;
        i += 1;
      }
      const t = elapsed / timeline[i].duration;

      if (i !== lastPhase) {
        lastPhase = i;
        setPhase(i);
      }

      // position along route: 0 = home, 1 = care centre
      const pos = [0, ease(t), 1, 1 - ease(t), 0][i];
      const outbound = [0, ease(t), 1, 1, 1][i];
      const inbound = [0, 0, 0, ease(t), 1][i];

      const point = route.getPointAtLength(pos * len);
      markerRef.current?.setAttribute('transform', `translate(${point.x} ${point.y})`);
      outboundRef.current?.setAttribute('stroke-dashoffset', String(len * (1 - outbound)));
      returnRef.current?.setAttribute('stroke-dashoffset', String(-len * (1 - inbound)));

      if (i === 2) {
        ringRef.current?.setAttribute('stroke-dashoffset', String(RING * (1 - t)));
        const sub = Math.min(Math.floor(t * cleaningSteps.length), cleaningSteps.length - 1);
        if (sub !== lastSub) {
          lastSub = sub;
          setSubStep(sub);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const returning = phase >= 3;

  return (
    <div className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-soft backdrop-blur-sm sm:p-5">
      <div className="rounded-[1.5rem] bg-white p-4 text-slate-900 shadow-2xl sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live tracking
            </p>
            <h2 className="mt-1 text-xl font-black sm:text-2xl">Order #WC-2048</h2>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">On Time</div>
        </div>

        {/* map */}
        <div className="relative mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <svg viewBox="0 0 360 200" className="block w-full" fill="none">
            <defs>
              <linearGradient id="dj-route" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0f6f93" />
              </linearGradient>
              <linearGradient id="dj-centre" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0d7e9a" />
                <stop offset="100%" stopColor="#0b5a65" />
              </linearGradient>
              <filter id="dj-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.25" />
              </filter>
            </defs>

            <rect width="360" height="200" fill="#f8fafc" />
            {blocks.map(([x, y, w, h]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="6" fill="#eef2f6" />
            ))}
            <rect x="92" y="136" width="72" height="56" rx="6" fill="#dcfce7" />
            <circle cx="118" cy="162" r="10" fill="#bbf7d0" />
            <circle cx="140" cy="172" r="7" fill="#bbf7d0" />
            <path d="M252 192c20-14 44-10 64-22s24-18 36-18v40H252Z" fill="#dbeafe" />

            {/* route */}
            <path ref={routeRef} d={ROUTE} stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 7" />
            <path
              ref={outboundRef}
              d={ROUTE}
              stroke="url(#dj-route)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-opacity duration-700"
              style={{ opacity: returning ? 0.25 : 1 }}
            />
            <path ref={returnRef} d={ROUTE} stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            {/* home pin */}
            <g transform={`translate(${HOME.x} ${HOME.y})`}>
              {(phase === 0 || phase === 4) && (
                <circle r="14" className="svg-origin animate-ping" fill={phase === 4 ? '#10b981' : '#0ea5e9'} opacity="0.35" />
              )}
              <circle r="13" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#dj-shadow)" />
              <path d="M-5 0l5-5 5 5M-3.5-1.5V5h7v-6.5" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <g
                className="transition-all duration-500"
                style={{ opacity: phase === 4 ? 1 : 0, transform: `translate(9px, -9px) scale(${phase === 4 ? 1 : 0.4})` }}
              >
                <circle r="6" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                <path d="M-2.5 0l1.8 1.8L2.6-1.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
            <g transform={`translate(${HOME.x} ${HOME.y + 26})`}>
              <rect x="-18" y="-7" width="36" height="14" rx="7" fill="#fff" stroke="#e2e8f0" />
              <text textAnchor="middle" y="3" fontSize="8" fontWeight="700" fill="#334155" fontFamily="Arial">Home</text>
            </g>

            {/* care centre pin */}
            <g transform={`translate(${CENTRE.x} ${CENTRE.y})`}>
              {phase === 2 && <circle r="15" className="svg-origin animate-ping" fill="#0f6f93" opacity="0.3" />}
              <circle r="15" fill="url(#dj-centre)" filter="url(#dj-shadow)" />
              <rect x="-6" y="-7" width="12" height="14" rx="2" stroke="#fff" strokeWidth="1.5" />
              <circle cy="1.5" r="3.2" stroke="#fff" strokeWidth="1.5" />
              <circle cx="-3" cy="-4.5" r="0.8" fill="#fff" />
            </g>
            <g transform={`translate(${CENTRE.x} ${CENTRE.y + 28})`}>
              <rect x="-34" y="-7" width="68" height="14" rx="7" fill="#fff" stroke="#e2e8f0" />
              <text textAnchor="middle" y="3" fontSize="8" fontWeight="700" fill="#0b5a65" fontFamily="Arial">Cleanova Centre</text>
            </g>

            {/* rider marker */}
            <g ref={markerRef} transform={`translate(${HOME.x} ${HOME.y})`}>
              {(phase === 1 || phase === 3) && (
                <circle r="11" className="svg-origin animate-ping" fill={returning ? '#10b981' : '#0ea5e9'} opacity="0.4" />
              )}
              <circle r="11" fill="#fff" filter="url(#dj-shadow)" />
              <circle r="8.5" fill={returning ? '#059669' : '#0284c7'} className="transition-colors duration-500" />
              <g fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" transform="translate(-6 -6.5) scale(0.5)">
                {icons.scooter}
              </g>
              <circle cx="7.5" cy="-7.5" r="3.5" fill={returning ? '#34d399' : '#f59e0b'} stroke="#fff" strokeWidth="1.2" />
            </g>
          </svg>

          {/* status chip */}
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-md ring-1 ring-slate-200 backdrop-blur">
            <Icon className="h-3.5 w-3.5 text-sky-600">
              <path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </Icon>
            <span key={phase} className="animate-fade-up">
              {statusText[phase]}
            </span>
          </div>

          {/* cleaning progress card */}
          <div
            className={`absolute bottom-2.5 right-2.5 flex items-center gap-2.5 rounded-xl bg-white/95 p-2.5 shadow-lg ring-1 ring-slate-200 backdrop-blur transition-all duration-500 ${
              phase === 2 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
            }`}
          >
            <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90" fill="none">
              <circle cx="18" cy="18" r="14" stroke="#e0f2fe" strokeWidth="4" />
              <circle
                ref={ringRef}
                cx="18"
                cy="18"
                r="14"
                stroke="#0f6f93"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={RING}
                strokeDashoffset={RING}
              />
            </svg>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Care centre</p>
              <p key={subStep} className="animate-fade-up text-xs font-bold text-slate-800">
                {cleaningSteps[subStep]}
              </p>
            </div>
          </div>
        </div>

        {/* rider */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0d7e9a] to-[#0b5a65] text-sm font-bold text-white">
            RK
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">Rahul K.</p>
            <p className="text-xs text-slate-500">Cleanova Partner · ★ 4.9</p>
          </div>
          {[
            <path key="c" d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />,
            <path key="p" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
          ].map((glyph) => (
            <span key={glyph.key} className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-100">
              <Icon>{glyph}</Icon>
            </span>
          ))}
        </div>

        {/* stepper */}
        <div className="relative mt-5">
          <div className="absolute left-4 right-4 top-4 h-0.5 bg-slate-200" />
          <div
            className="absolute left-4 top-4 h-0.5 bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-700"
            style={{ width: `calc((100% - 2rem) * ${phase / (steps.length - 1)})` }}
          />
          <div className="relative flex justify-between">
            {steps.map((s, i) => {
              const done = i < phase;
              const active = i === phase;
              return (
                <div key={s.label} className="flex w-14 flex-col items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${
                      active
                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/40 ring-4 ring-sky-100'
                        : done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-slate-400 ring-1 ring-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4">{done ? icons.check : s.icon}</Icon>
                  </span>
                  <span className={`mt-1.5 text-center text-[10px] font-semibold ${active ? 'text-sky-700' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#0d7e9a] to-[#0b5a65] p-4 text-white">
          <div>
            <p className="text-sm font-bold">9 items</p>
            <p className="text-xs text-sky-100">Wash · Dry clean · Steam iron</p>
          </div>
          <span className="text-2xl font-black">$42</span>
        </div>
      </div>
    </div>
  );
}
