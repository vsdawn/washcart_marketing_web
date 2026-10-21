'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { services } from '../data';
import Reveal from './Reveal';

const AUTOPLAY_MS = 4000;
const GAP = 24;

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

export default function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(services.length - 1);
  const [hovered, setHovered] = useState(false);
  const [touchPaused, setTouchPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const paused = hovered || touchPaused || !inView;

  const step = () => {
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + GAP : 1;
  };

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const s = step();
    setMaxIndex(Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / s)));
    setIndex(Math.round(track.scrollLeft / s));
  }, []);

  const goTo = useCallback((i: number) => {
    trackRef.current?.scrollTo({ left: i * step(), behavior: 'smooth' });
  }, []);

  const next = useCallback(() => goTo(index >= maxIndex ? 0 : index + 1), [goTo, index, maxIndex]);
  const prev = () => goTo(index <= 0 ? maxIndex : index - 1);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!touchPaused) return;
    const t = setTimeout(() => setTouchPaused(false), 6000);
    return () => clearTimeout(t);
  }, [touchPaused]);

  return (
    <section id="services" ref={sectionRef} className="relative scroll-mt-20 overflow-hidden py-24">
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 animate-blob bg-sky-100 blur-3xl" aria-hidden />

      <div className="container-shell relative">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Our Services</p>
            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Everything your fabrics need</h2>
            <p className="mt-4 text-lg text-slate-600">
              From daily wear to your favourite sneakers and heavy winter blankets — we clean it all with care.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:border-sky-300 hover:text-sky-700"
              aria-label="Previous service"
            >
              <Arrow dir="left" />
            </button>
            <button
              onClick={next}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0d7e9a] to-[#0b5a65] text-white shadow-lg transition hover:translate-x-0.5 hover:shadow-xl"
              aria-label="Next service"
            >
              <Arrow dir="right" />
            </button>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div
            ref={trackRef}
            onScroll={measure}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onPointerDown={() => setTouchPaused(true)}
            className="-mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto scroll-smooth px-4 pb-6 pt-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
            aria-roledescription="carousel"
          >
            {services.map((service, i) => (
              <article
                key={service.kind}
                className="group relative h-[440px] shrink-0 basis-[85%] snap-start overflow-hidden rounded-[1.75rem] shadow-soft sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
                aria-label={`${i + 1} of ${services.length}: ${service.title}`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-transparent transition-opacity duration-500 group-hover:from-[#062a33]/95" />

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                  <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-800 shadow-lg">{service.price}</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-black tracking-tight">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/80">{service.text}</p>

                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
                    <ul className="overflow-hidden">
                      {service.steps.map((s) => (
                        <li key={s.title} className="mt-2 flex items-center gap-2 text-sm text-white/90 first:mt-4">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                          {s.title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#how-it-works"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold backdrop-blur-md transition hover:bg-white hover:text-sky-800"
                  >
                    See the process
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Reveal>

        {/* pagination with autoplay progress */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`relative h-2 overflow-hidden rounded-full transition-all duration-500 ${active ? 'w-12 bg-sky-100' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active}
              >
                {active && (
                  <span
                    key={index}
                    className="process-progress absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                    style={{
                      animation: `progress ${AUTOPLAY_MS}ms linear forwards`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                    onAnimationEnd={next}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
