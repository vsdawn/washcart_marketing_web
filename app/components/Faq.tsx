'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { faqCategories, faqs } from '../data';
import { useInView } from './Reveal';

type Category = (typeof faqCategories)[number];

const popularTopics = ['pickup', 'shoes', 'stains', 'payment', 'track'];

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-sky-100 px-0.5 text-sky-800">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function Thumb({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${down ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Zm0 0 4-7a2.5 2.5 0 0 1 3 2.8L13.5 9H19a2 2 0 0 1 2 2.3l-1.2 7.4A2.5 2.5 0 0 1 17.3 21H7" />
    </svg>
  );
}

export default function Faq() {
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(faqs[0].q);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [listRef, listInView] = useInView<HTMLDivElement>(0.1);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: faqs.length };
    faqs.forEach((f) => (c[f.category] = (c[f.category] ?? 0) + 1));
    return c;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter(
      (f) =>
        (category === 'All' || f.category === category) &&
        (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)),
    );
  }, [category, query]);

  useEffect(() => {
    const update = () => {
      const tab = tabRefs.current[category];
      if (tab) setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [category]);

  return (
    <section id="faq" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-white via-sky-50/60 to-slate-50 py-24">
      {/* ambient background */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 animate-blob bg-sky-200/50 blur-3xl" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 animate-blob bg-cyan-200/40 blur-3xl"
        style={{ animationDelay: '-7s' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]"
        style={{ backgroundImage: 'radial-gradient(#bae6fd 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        aria-hidden
      />

      <div className="container-shell relative">
        {/* heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </span>
            FAQ&apos;s
          </span>
          <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
            Questions? We&apos;ve got{' '}
            <span className="animate-gradient-x bg-gradient-to-r from-sky-600 via-cyan-400 to-teal-500 bg-[length:200%_auto] bg-clip-text text-transparent">
              answers
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">Everything you need to know about pickups, cleaning, delivery and payments.</p>
        </div>

        {/* search + categories */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 opacity-0 blur transition duration-500 group-focus-within:opacity-60" />
            <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-400 transition group-focus-within:text-sky-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions…"
                className="w-full bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Search FAQs"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="flex h-7 w-7 shrink-0 animate-pop-in items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="relative mt-5 flex justify-start overflow-x-auto pb-1 sm:justify-center">
            <div className="relative inline-flex gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm" role="tablist">
              <span
                className="absolute bottom-1 top-1 rounded-full bg-gradient-to-r from-[#0d7e9a] to-[#0b5a65] shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ left: indicator.left, width: indicator.width }}
                aria-hidden
              />
              {faqCategories.map((c) => (
                <button
                  key={c}
                  ref={(el) => {
                    tabRefs.current[c] = el;
                  }}
                  role="tab"
                  aria-selected={category === c}
                  onClick={() => setCategory(c)}
                  className={`relative z-10 flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 ${
                    category === c ? 'text-white' : 'text-slate-600 hover:text-sky-700'
                  }`}
                >
                  {c}
                  <span
                    className={`rounded-full px-1.5 text-[10px] leading-4 transition-colors duration-300 ${
                      category === c ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {counts[c]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* accordion */}
          <div ref={listRef}>
            <div key={`${category}-${query}`} className="space-y-4">
              {results.length === 0 && (
                <div className="animate-fade-up rounded-3xl border border-dashed border-sky-200 bg-white/70 p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 animate-float items-center justify-center rounded-2xl bg-sky-100 text-2xl">🔍</div>
                  <p className="mt-4 text-lg font-bold text-slate-900">No results for “{query}”</p>
                  <p className="mt-1 text-slate-500">Try another word, or ask our care team directly.</p>
                  <button
                    onClick={() => {
                      setQuery('');
                      setCategory('All');
                    }}
                    className="mt-5 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-800"
                  >
                    Show all questions
                  </button>
                </div>
              )}

              {results.map((faq, i) => {
                const isOpen = open === faq.q;
                const id = `faq-${faqs.indexOf(faq)}`;
                const vote = feedback[faq.q];
                return (
                  <div
                    key={faq.q}
                    className={listInView ? 'animate-fade-up' : 'opacity-0'}
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <div
                      className={`group relative rounded-2xl p-px transition-all duration-500 ${
                        isOpen
                          ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 shadow-soft'
                          : 'bg-slate-200/80 hover:-translate-y-0.5 hover:bg-sky-200 hover:shadow-lg'
                      }`}
                    >
                      <div className="relative overflow-hidden rounded-[15px] bg-white">
                        <span
                          className={`absolute bottom-5 left-0 top-5 w-1 origin-top rounded-r-full bg-gradient-to-b from-sky-500 to-teal-400 transition-transform duration-500 ${
                            isOpen ? 'scale-y-100' : 'scale-y-0'
                          }`}
                          aria-hidden
                        />
                        <span
                          className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-100 blur-2xl transition-opacity duration-700 ${
                            isOpen ? 'opacity-70' : 'opacity-0'
                          }`}
                          aria-hidden
                        />

                        <button
                          onClick={() => setOpen(isOpen ? null : faq.q)}
                          aria-expanded={isOpen}
                          aria-controls={id}
                          className="relative flex w-full items-center gap-4 p-5 text-left sm:p-6"
                        >
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-all duration-500 ${
                              isOpen
                                ? 'rotate-[-6deg] scale-110 bg-gradient-to-br from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/30'
                                : 'bg-sky-50 text-sky-700 group-hover:bg-sky-100'
                            }`}
                          >
                            {String(faqs.indexOf(faq) + 1).padStart(2, '0')}
                          </span>
                          <span className="flex-1">
                            <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-sky-600/80">{faq.category}</span>
                            <span className={`mt-0.5 block text-base font-bold transition-colors duration-300 sm:text-lg ${isOpen ? 'text-sky-900' : 'text-slate-900'}`}>
                              {highlight(faq.q, query)}
                            </span>
                          </span>
                          <span
                            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                              isOpen ? 'rotate-180 bg-sky-700 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700'
                            }`}
                            aria-hidden
                          >
                            <span className="absolute h-0.5 w-4 rounded-full bg-current" />
                            <span className={`absolute h-4 w-0.5 rounded-full bg-current transition-transform duration-500 ${isOpen ? 'scale-y-0' : 'scale-y-100'}`} />
                          </span>
                        </button>

                        <div
                          id={id}
                          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div
                              className={`px-5 pb-6 transition-all duration-500 sm:pl-[5.5rem] sm:pr-8 ${
                                isOpen ? 'translate-y-0 opacity-100 delay-150' : '-translate-y-2 opacity-0'
                              }`}
                            >
                              <p className="leading-7 text-slate-600">{highlight(faq.a, query)}</p>

                              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-sm">
                                {vote ? (
                                  <span className="inline-flex animate-pop-in items-center gap-2 font-semibold text-emerald-600">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">✓</span>
                                    Thanks for your feedback!
                                  </span>
                                ) : (
                                  <>
                                    <span className="font-medium text-slate-500">Was this helpful?</span>
                                    {(['up', 'down'] as const).map((v) => (
                                      <button
                                        key={v}
                                        onClick={() => setFeedback((f) => ({ ...f, [faq.q]: v }))}
                                        className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:scale-110 ${
                                          v === 'up' ? 'hover:border-emerald-300 hover:text-emerald-600' : 'hover:border-rose-300 hover:text-rose-500'
                                        }`}
                                        aria-label={v === 'up' ? 'Helpful' : 'Not helpful'}
                                      >
                                        <Thumb down={v === 'down'} />
                                      </button>
                                    ))}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* side column */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="group relative overflow-hidden rounded-3xl p-px shadow-soft">
              <span className="absolute left-1/2 top-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2">
                <span
                  className="block h-full w-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0%,#67e8f9_15%,transparent_30%,transparent_100%)]"
                  style={{ animationDuration: '5s' }}
                />
              </span>
              <div className="relative overflow-hidden rounded-[23px] bg-gradient-to-br from-[#0d7e9a] via-[#0f6f93] to-[#0b5a65] p-7 text-white">
                {[
                  ['right-8', '0s', 'h-3 w-3'],
                  ['right-16', '1s', 'h-2 w-2'],
                  ['right-4', '1.8s', 'h-4 w-4'],
                ].map(([pos, delay, size]) => (
                  <span
                    key={pos}
                    className={`absolute bottom-6 ${pos} ${size} animate-bubble rounded-full border border-white/50 bg-white/10`}
                    style={{ animationDelay: delay }}
                    aria-hidden
                  />
                ))}

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      ['AS', 'from-amber-400 to-orange-500'],
                      ['MK', 'from-violet-400 to-fuchsia-500'],
                      ['PR', 'from-emerald-400 to-teal-500'],
                    ].map(([initials, bg], i) => (
                      <span
                        key={initials}
                        className={`flex h-11 w-11 animate-pop-in items-center justify-center rounded-full bg-gradient-to-br ${bg} text-xs font-bold ring-2 ring-[#0f6f93] transition-transform duration-300 hover:-translate-y-1`}
                        style={{ animationDelay: `${i * 120}ms` }}
                      >
                        {initials}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Online now
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black">Still have questions?</h3>
                <p className="mt-2 text-sky-50/85">Our care team typically replies in under 5 minutes, 24/7.</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="mailto:support@cleanova.com"
                    className="relative overflow-hidden rounded-xl bg-white px-5 py-3 text-sm font-bold text-sky-700 shadow-lg transition hover:scale-[1.03]"
                  >
                    <span className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-sky-100 to-transparent" aria-hidden />
                    <span className="relative">Chat with us</span>
                  </a>
                  <a
                    href="tel:+917019065181"
                    className="rounded-xl border border-white/60 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Call support
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">Popular topics</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {popularTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setCategory('All');
                      setQuery(topic);
                    }}
                    className={`rounded-full border px-4 py-1.5 text-sm font-semibold capitalize transition duration-300 hover:-translate-y-0.5 ${
                      query === topic
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700'
                    }`}
                  >
                    #{topic}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-2xl font-black text-sky-700">&lt;5 min</p>
                  <p className="text-xs font-semibold text-slate-500">Avg. reply time</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-2xl font-black text-emerald-600">98%</p>
                  <p className="text-xs font-semibold text-slate-500">Issues resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
