'use client';

import { useEffect, useState } from 'react';
import { useInView } from './Reveal';
import Reveal from './Reveal';

const ribbon = ['Wash & Fold', 'Dry Cleaning', 'Steam Iron', 'Shoe Care', 'Blanket Care', 'Curtain Care', 'Express 24h', 'Eco Friendly'];

const stats = [
  { value: 25000, suffix: '+', label: 'Happy customers' },
  { value: 1200000, suffix: '+', label: 'Items cleaned', compact: true },
  { value: 99, suffix: '%', label: 'On-time delivery' },
  { value: 6, suffix: '', label: 'Cities served' },
];

const promises = [
  'Doorstep pickup & delivery in your chosen slot',
  'Skin-friendly, eco-safe detergents and solvents',
  'Every item tagged and tracked end to end',
  'Hygienic, sanitised processing for every order',
];

const orbiters = [
  { icon: '👕', pos: 'left-1/2 top-0' },
  { icon: '👟', pos: 'left-full top-1/2' },
  { icon: '🧥', pos: 'left-1/2 top-full' },
  { icon: '🛏️', pos: 'left-0 top-1/2' },
];

function formatNumber(n: number, compact?: boolean) {
  if (compact && n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function Counter({ value, suffix, compact }: { value: number; suffix: string; compact?: boolean }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(value);
      return;
    }

    const duration = 1800;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {formatNumber(Math.round(current), compact)}
      {suffix}
    </span>
  );
}

function WasherScene() {
  return (
    <div className="relative mx-auto aspect-square w-[82%] max-w-[460px] sm:w-full">
      {/* morphing glow blobs */}
      <div className="absolute inset-6 animate-blob bg-gradient-to-br from-sky-300 via-cyan-200 to-teal-200 opacity-70 blur-2xl" />
      <div
        className="absolute inset-16 animate-blob bg-gradient-to-tr from-indigo-200 to-sky-100 opacity-70 blur-2xl"
        style={{ animationDelay: '-5s' }}
      />

      {/* rotating rings */}
      <div className="absolute inset-4 animate-spin-slow rounded-full border-2 border-dashed border-sky-300/70" style={{ animationDuration: '30s' }} />
      <div className="absolute inset-14 animate-spin-reverse rounded-full border border-cyan-400/40" />

      {/* orbiting clothes */}
      <div className="absolute inset-4 animate-orbit">
        {orbiters.map((o) => (
          <div key={o.icon} className={`absolute ${o.pos} -translate-x-1/2 -translate-y-1/2`}>
            <div className="flex h-11 w-11 animate-orbit-reverse sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-soft ring-1 ring-sky-100">
              {o.icon}
            </div>
          </div>
        ))}
      </div>

      {/* washing machine */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 230" className="w-[48%] animate-float drop-shadow-2xl" fill="none">
          <defs>
            <linearGradient id="about-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
            <linearGradient id="about-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0f6f93" />
            </linearGradient>
            <clipPath id="about-drum">
              <circle cx="100" cy="135" r="52" />
            </clipPath>
          </defs>

          <rect x="10" y="10" width="180" height="210" rx="22" fill="url(#about-body)" stroke="#0f6f93" strokeWidth="4" />
          <line x1="10" y1="52" x2="190" y2="52" stroke="#0f6f93" strokeWidth="3" />
          <rect x="26" y="24" width="56" height="14" rx="7" fill="#bae6fd" />
          <circle cx="146" cy="31" r="9" fill="#0ea5e9" className="animate-pulse" />
          <circle cx="170" cy="31" r="6" fill="#34d399" />

          <circle cx="100" cy="135" r="64" fill="#f0f9ff" stroke="#0f6f93" strokeWidth="5" />
          <g clipPath="url(#about-drum)">
            <rect x="40" y="75" width="120" height="120" fill="#e0f2fe" />
            <g className="svg-origin animate-wave">
              <path
                d="M0 130 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 V200 H0 Z"
                fill="url(#about-water)"
                opacity="0.9"
              />
            </g>
            <g className="svg-origin animate-spin-slow" style={{ animationDuration: '3s' }}>
              <circle cx="100" cy="135" r="52" fill="transparent" />
              <rect x="72" y="100" width="22" height="16" rx="4" fill="#f472b6" />
              <rect x="108" y="150" width="24" height="14" rx="4" fill="#facc15" />
              <circle cx="120" cy="112" r="8" fill="#a78bfa" />
              <circle cx="80" cy="158" r="6" fill="#fff" />
            </g>
          </g>
          <circle cx="100" cy="135" r="52" stroke="#7dd3fc" strokeWidth="3" />
          <path d="M70 108a40 40 0 0 1 22-14" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        </svg>
      </div>

      {/* bubbles */}
      {[
        ['left-[30%]', '0s', 'h-4 w-4'],
        ['left-[48%]', '0.9s', 'h-3 w-3'],
        ['left-[62%]', '1.6s', 'h-5 w-5'],
        ['left-[40%]', '2.2s', 'h-2 w-2'],
      ].map(([pos, delay, size]) => (
        <span
          key={pos + delay}
          className={`absolute top-[22%] ${pos} ${size} animate-bubble rounded-full border border-white bg-sky-200/70`}
          style={{ animationDelay: delay }}
        />
      ))}

      {/* floating glass badges */}
      <div className="absolute -left-4 top-[14%] animate-float sm:-left-2 sm:top-[18%] rounded-2xl border border-white/60 bg-white/80 px-3 py-2 shadow-soft backdrop-blur-md sm:px-4 sm:py-3">
        <p className="text-xs font-semibold text-slate-500">Customer rating</p>
        <p className="text-lg font-black text-slate-900">
          <span className="text-amber-400">★★★★★</span> 4.9
        </p>
      </div>
      <div
        className="absolute -right-4 bottom-[12%] animate-float sm:-right-2 sm:bottom-[16%] rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-soft backdrop-blur-md"
        style={{ animationDelay: '-2s' }}
      >
        <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          Delivered in 24h
        </p>
      </div>
    </div>
  );
}

function PromiseList() {
  const [ref, inView] = useInView<HTMLUListElement>(0.3);

  return (
    <ul ref={ref} className="mt-8 space-y-4">
      {promises.map((p, i) => (
        <li
          key={p}
          className={`flex items-center gap-4 transition-all duration-700 ${inView ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'}`}
          style={{ transitionDelay: `${i * 150}ms` }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/30">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="24"
                strokeDashoffset="24"
                className={inView ? 'animate-draw' : ''}
                style={{ animationDelay: `${i * 150 + 350}ms` }}
              />
            </svg>
          </span>
          <span className="text-lg font-medium text-slate-700">{p}</span>
        </li>
      ))}
    </ul>
  );
}

const features = [
  {
    title: 'Pickup & Delivery',
    text: 'Schedule a pickup at your doorstep and get your laundry back fresh and folded on time.',
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9 animate-drive" fill="none">
        <path d="M4 14h24v18H4z" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M28 20h8l6 6v6H28z" fill="#bae6fd" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="12" cy="34" r="4" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="34" cy="34" r="4" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    title: 'Expert Care',
    text: 'From everyday clothes to delicates, our professionals handle every fabric with precision.',
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
        <path d="M24 6l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="svg-origin animate-spin-slow" />
        <path d="M38 32l1.5 3.5L43 37l-3.5 1.5L38 42l-1.5-3.5L33 37l3.5-1.5z" fill="currentColor" className="animate-pulse" />
      </svg>
    ),
  },
  {
    title: 'Transparent Pricing',
    text: 'Simple rates and no surprise charges so you always know what you are paying for.',
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9 origin-top animate-swing" fill="none">
        <path d="M24 4v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 10h20l4 8-14 26L10 18z" fill="#e0f2fe" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24" cy="18" r="3" fill="currentColor" />
      </svg>
    ),
  },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <Reveal delay={index * 150} className="h-full">
      <div
        onMouseMove={onMove}
        className="group relative h-full overflow-hidden rounded-3xl p-[2px] shadow-soft transition duration-500 hover:-translate-y-2"
      >
        {/* rotating glow border */}
        <span className="absolute inset-0 bg-sky-100" />
        <span className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="block h-full w-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0%,#38bdf8_20%,#06b6d4_35%,transparent_50%,transparent_100%)]" style={{ animationDuration: '3s' }} />
        </span>

        <div className="relative h-full overflow-hidden rounded-[22px] bg-white p-8">
          {/* mouse spotlight */}
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'radial-gradient(280px circle at var(--x) var(--y), rgba(56,189,248,0.15), transparent 70%)' }}
          />
          <span className="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-black leading-none text-sky-50 transition-colors duration-500 group-hover:text-sky-100">
            0{index + 1}
          </span>

          <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 text-sky-700 ring-1 ring-sky-200 transition duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-sky-300/40">
            {feature.icon}
          </div>
          <h3 className="relative text-2xl font-bold text-slate-900">{feature.title}</h3>
          <p className="relative mt-4 text-base leading-7 text-slate-600">{feature.text}</p>
          <span className="relative mt-6 block h-1 w-12 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500 group-hover:w-full" />
        </div>
      </div>
    </Reveal>
  );
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden pb-24">
      {/* scrolling ribbon */}
      <div className="relative overflow-hidden border-y border-white/10 bg-[#0b0920] py-4">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...ribbon, ...ribbon].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-lg font-bold uppercase tracking-widest text-white">
              {item}
              <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* dotted backdrop */}
      <div
        className="pointer-events-none absolute inset-0 top-20 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        style={{ backgroundImage: 'radial-gradient(#7dd3fc 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        aria-hidden
      />

      <div className="container-shell relative pt-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <WasherScene />
          </Reveal>

          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
                </span>
                About Cleanova
              </span>
              <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                Smart laundry for{' '}
                <span className="animate-gradient-x bg-gradient-to-r from-sky-600 via-cyan-400 to-teal-500 bg-[length:200%_auto] bg-clip-text text-transparent">
                  modern living
                </span>
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                We combine convenience, quality, and technology to deliver a laundry service that fits your routine
                perfectly. Our trained experts, modern machines and careful processes treat every garment like it
                was our own.
              </p>
            </Reveal>

            <PromiseList />

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 100}>
                  <div className="group rounded-2xl border border-sky-100 bg-white/80 p-4 text-center shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-soft">
                    <p className="bg-gradient-to-br from-sky-700 to-cyan-500 bg-clip-text text-3xl font-black text-transparent">
                      <Counter value={s.value} suffix={s.suffix} compact={s.compact} />
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
