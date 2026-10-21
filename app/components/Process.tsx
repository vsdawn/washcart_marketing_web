'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { services } from '../data';
import Reveal from './Reveal';

const STEP_MS = 4000;

const stepImage = (kind: string, i: number) => `/images/process/${kind}-${i + 1}.jpg`;

export default function Process() {
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sectionRef, inView] = useSectionVisible();
  const barRef = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);

  const service = services[active];
  const current = service.steps[step];

  const selectService = (i: number) => {
    setActive(i);
    setStep(0);
  };

  // after the last step, move on to the next service
  const nextStep = () => {
    if (step < service.steps.length - 1) {
      setStep(step + 1);
    } else {
      selectService((active + 1) % services.length);
    }
  };

  // JS-driven step timer: pauses on hover and while the section is off screen
  useEffect(() => {
    elapsed.current = 0;
  }, [active, step]);

  const nextRef = useRef(nextStep);
  nextRef.current = nextStep;

  useEffect(() => {
    if (paused || !inView) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += Math.min(now - last, 100);
      last = now;
      const p = Math.min(1, elapsed.current / STEP_MS);
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;
      if (p >= 1) {
        nextRef.current();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, step, paused, inView]);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-sky-50 to-white py-24">
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 animate-blob bg-cyan-100/70 blur-3xl" aria-hidden />

      <div className="container-shell relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Our Process</p>
          <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">What happens to your clothes</h2>
          <p className="mt-4 text-lg text-slate-600">
            Every service follows its own careful process. Pick one to see how we handle it step by step.
          </p>
        </Reveal>

        {/* service tabs */}
        <Reveal delay={100}>
          <div className="-mx-4 mt-10 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:justify-center [&::-webkit-scrollbar]:hidden" role="tablist">
            {services.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.kind}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectService(i)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-bold transition-all duration-300 ${
                    selected
                      ? 'bg-gradient-to-r from-[#0d7e9a] to-[#0b5a65] text-white shadow-lg shadow-sky-900/20'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-sky-300'
                  }`}
                >
                  <span className={`relative h-8 w-8 overflow-hidden rounded-full ring-2 ${selected ? 'ring-white/60' : 'ring-slate-100'}`}>
                    <Image src={s.image} alt="" fill sizes="32px" className="object-cover" />
                  </span>
                  {s.title}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          className="mt-10 grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* photo stage */}
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-slate-900 shadow-soft">
              {service.steps.map((s, i) => {
                const isActive = i === step;
                return (
                  <Image
                    key={`${service.kind}-${i}`}
                    src={stepImage(service.kind, i)}
                    alt={`${service.title}: ${s.title}`}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      transition: isActive
                        ? `opacity 800ms ease, transform ${STEP_MS + 800}ms linear`
                        : 'opacity 800ms ease, transform 0ms 800ms',
                    }}
                  />
                );
              })}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/30" />

              {/* story-style progress */}
              <div className="absolute inset-x-5 top-5 flex gap-1.5">
                {service.steps.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => setStep(i)}
                    className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                    aria-label={`Show step ${i + 1}: ${s.title}`}
                  >
                    {i < step && <span className="absolute inset-0 bg-white" />}
                    {i === step && (
                      <span key={`${active}-${step}`} ref={barRef} className="absolute inset-y-0 left-0 w-0 bg-white" />
                    )}
                  </button>
                ))}
              </div>

              <div className="absolute left-5 top-9 flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                {service.title}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">
                  Step {step + 1} of {service.steps.length}
                </p>
                <h3 key={`h-${active}-${step}`} className="mt-2 animate-fade-up text-3xl font-black tracking-tight sm:text-4xl">
                  {current.title}
                </h3>
                <p key={`p-${active}-${step}`} className="mt-2 max-w-md animate-fade-up text-white/85 [animation-delay:120ms]">
                  {current.text}
                </p>
              </div>
            </div>
          </Reveal>

          {/* step list */}
          <ol key={service.kind} className="relative space-y-3">
            <span className="absolute bottom-10 left-[2.4rem] top-10 w-px bg-gradient-to-b from-sky-200 via-sky-200 to-transparent" aria-hidden />
            {service.steps.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <li key={s.title} className="animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                  <button
                    onClick={() => setStep(i)}
                    className={`group relative flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-all duration-500 ${
                      isActive ? 'bg-white shadow-soft ring-1 ring-sky-100' : 'hover:bg-white/70'
                    }`}
                  >
                    <span
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all duration-500 ${
                        isActive
                          ? 'ring-2 ring-sky-500 ring-offset-2'
                          : isDone
                            ? 'opacity-90'
                            : 'opacity-60 grayscale group-hover:opacity-90 group-hover:grayscale-0'
                      }`}
                    >
                      <Image src={stepImage(service.kind, i)} alt="" fill sizes="64px" className="object-cover" />
                      {!isActive && !isDone && (
                        <span className="absolute inset-0 flex items-center justify-center bg-slate-900/40 text-sm font-black text-white">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      )}
                      {isDone && (
                        <span className="absolute right-1 top-1 flex h-5 w-5 animate-pop-in items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow ring-2 ring-white">
                          ✓
                        </span>
                      )}
                    </span>
                    <span className="flex-1">
                      <span className={`block text-lg font-bold transition-colors ${isActive ? 'text-sky-800' : 'text-slate-900'}`}>{s.title}</span>
                      <span className="block text-sm leading-6 text-slate-600">{s.text}</span>
                    </span>
                    <span
                      className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition-all duration-500 sm:flex ${
                        isActive ? 'bg-sky-600 text-white' : 'text-transparent'
                      }`}
                      aria-hidden
                    >
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// visibility that updates both ways (useInView only fires once, for reveal animations)
function useSectionVisible() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, visible] as const;
}
