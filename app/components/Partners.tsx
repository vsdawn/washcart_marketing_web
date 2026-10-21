'use client';

import Image from 'next/image';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { partners, whatsappLink, type Partner } from '../data';
import { useInView } from './Reveal';

const ALL = 'All areas';

function Stars({ rating }: { rating: number }) {
  // useId returns ids like ":r1:"; colons would break url(#...) references
  const uid = `star${useId().replace(/:/g, '')}`;
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5">
            <defs>
              <linearGradient id={`${uid}-${i}`}>
                <stop offset={`${fill * 100}%`} stopColor="#fbbf24" />
                <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.2)" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.8L10 1.5Z"
              fill={`url(#${uid}-${i})`}
            />
          </svg>
        );
      })}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-label="Verified partner">
      <path
        d="M12 1.5l2.4 1.8 3-.2 1 2.8 2.6 1.6-.7 2.9 1.4 2.6-2 2.2-.1 3-2.9.8-1.6 2.5-2.9-.9-2.7 1.4-2-2.2-3-.3-.6-2.9L1.5 14l1-2.8-.8-2.9 2.4-1.8.6-3 3-.2L10 1.7l2-.2Z"
        fill="#38bdf8"
      />
      <path d="M8 12.3l2.6 2.6L16 9.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PartnerCard({ partner, index, show }: { partner: Partner; index: number; show: boolean }) {
  const first = partner.name.split(' ')[0];
  return (
    <article
      className={`group relative w-[82%] shrink-0 snap-start sm:w-auto ${show ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {/* gold border glow on hover */}
      <div className="relative h-full rounded-[1.75rem] bg-gradient-to-b from-white/20 via-white/5 to-white/10 p-px transition-all duration-500 group-hover:-translate-y-2 group-hover:from-amber-300/80 group-hover:via-amber-200/20 group-hover:to-amber-400/40 group-hover:shadow-[0_30px_60px_-20px_rgba(251,191,36,0.35)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[27px] bg-[#0c222b]">
          {/* photo */}
          <div className="relative aspect-[4/4.3] overflow-hidden">
            <Image
              src={`/images/partners/${partner.slug}.jpg`}
              alt={`${partner.name}, ${partner.specialty}`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 82vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c222b] via-[#0c222b]/10 to-black/20" />

            <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-300" fill="currentColor">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
                {partner.area}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-2.5 py-1 text-xs font-black text-slate-900 shadow-lg">
                ★ {partner.rating.toFixed(1)}
              </span>
            </div>

            {partner.topRated && (
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-amber-300/50 bg-amber-300/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-200 backdrop-blur-md">
                <span className="absolute inset-y-0 left-0 w-1/2 animate-shine bg-gradient-to-r from-transparent via-amber-100/40 to-transparent" aria-hidden />
                <span className="relative">♛ Top rated</span>
              </span>
            )}
          </div>

          {/* details */}
          <div className="flex flex-1 flex-col px-5 pb-5 pt-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-black tracking-tight text-white">{partner.name}</h3>
              <VerifiedBadge />
            </div>
            <p className="mt-0.5 text-sm font-bold uppercase tracking-[0.12em] text-amber-300">{partner.specialty}</p>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <Stars rating={partner.rating} />
              <span className="text-white/60">({partner.reviews.toLocaleString('en-IN')} reviews)</span>
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-center">
              <div>
                <p className="text-lg font-black text-white">{partner.years}y</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Experience</p>
              </div>
              <div>
                <p className="text-lg font-black text-white">{partner.orders}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Orders</p>
              </div>
              <div>
                <p className="text-lg font-black text-white">{partner.rating.toFixed(1)}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Rating</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {partner.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-white/80">
                  {tag}
                </span>
              ))}
            </div>

            <figure className="mt-4 flex-1 rounded-2xl bg-white/[0.04] p-3.5">
              <blockquote className="text-sm italic leading-6 text-white/75">“{partner.review.text}”</blockquote>
              <figcaption className="mt-1.5 text-xs font-semibold text-amber-200/80">— {partner.review.by}, verified customer</figcaption>
            </figure>

            <div className="mt-5 flex items-center gap-2">
              <a
                href={whatsappLink(`Hi Cleanova! I'd like to book ${partner.name} (${partner.specialty}) in ${partner.area}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-[length:200%_auto] px-4 py-3 text-center text-sm font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-all duration-500 hover:bg-right"
              >
                Book {first}
              </a>
              <a
                href={whatsappLink(`Hi Cleanova! I have a question for ${partner.name} in ${partner.area}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-[#25D366] transition hover:border-[#25D366]/60 hover:bg-[#25D366]/10"
                aria-label={`Message ${partner.name} on WhatsApp`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm4.52 11.99c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.48.64 2.06.69 2.8.58.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Partners() {
  const areas = useMemo(() => [ALL, ...partners.map((p) => p.area)], []);
  const [area, setArea] = useState(ALL);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [gridRef, inView] = useInView<HTMLDivElement>(0.1);

  const shown = area === ALL ? partners : partners.filter((p) => p.area === area);
  const avg = (partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1);
  const totalReviews = partners.reduce((sum, p) => sum + p.reviews, 0);

  useEffect(() => {
    const update = () => {
      const tab = tabRefs.current[area];
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [area]);

  return (
    <section id="partners" className="relative scroll-mt-20 overflow-hidden bg-[#071a21] py-24 text-white">
      {/* ambient light */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#0d7e9a]/30 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 animate-blob bg-amber-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />
      </div>

      <div className="container-shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-200">
            ♛ Cleanova certified partners
          </span>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-5xl">
            Meet the{' '}
            <span className="animate-gradient-x bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-[length:200%_auto] bg-clip-text text-transparent">
              experts
            </span>{' '}
            behind every fresh fold
          </h2>
          <p className="mt-4 text-lg text-white/65">
            Hand-picked, background-verified specialists in your neighbourhood — each one rated by real Cleanova customers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">{avg}</span>
              <Stars rating={Number(avg)} />
            </span>
            <span className="hidden h-6 w-px bg-white/15 sm:block" />
            <span>
              <span className="font-black text-white">{totalReviews.toLocaleString('en-IN')}+</span> customer reviews
            </span>
            <span className="hidden h-6 w-px bg-white/15 sm:block" />
            <span className="flex items-center gap-1.5">
              <VerifiedBadge /> 100% background verified
            </span>
          </div>
        </div>

        {/* area filter */}
        <div className="-mx-4 mt-10 flex overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:justify-center [&::-webkit-scrollbar]:hidden">
          <div className="relative inline-flex shrink-0 gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur" role="tablist">
            <span
              className="absolute bottom-1 top-1 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 shadow-lg shadow-amber-500/20 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ left: indicator.left, width: indicator.width }}
              aria-hidden
            />
            {areas.map((a) => (
              <button
                key={a}
                ref={(el) => {
                  tabRefs.current[a] = el;
                }}
                role="tab"
                aria-selected={area === a}
                onClick={() => setArea(a)}
                className={`relative z-10 shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 ${
                  area === a ? 'text-slate-900' : 'text-white/70 hover:text-white'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* cards */}
        <div ref={gridRef}>
          <div
            key={area}
            className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
          >
            {shown.map((p, i) => (
              <PartnerCard key={p.slug} partner={p} index={i} show={inView} />
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-white/55">
          Are you a laundry or dry-cleaning expert in Bengaluru?{' '}
          <a
            href={whatsappLink('Hi Cleanova! I would like to become a cleaning partner.')}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-amber-300 underline decoration-amber-300/40 underline-offset-4 hover:text-amber-200"
          >
            Become a Cleanova partner →
          </a>
        </p>
      </div>
    </section>
  );
}
