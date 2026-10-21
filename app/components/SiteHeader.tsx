'use client';

import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Our Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Coverage', href: '#coverage' },
  { label: "FAQ's", href: '#faq' },
  // { label: 'Partners', href: '#partners' }, // hidden for now
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close on Escape, and if the screen grows to desktop size
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 1024px)');
    const onResize = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onResize);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? 'border-white/10 bg-[#07061a]/80 backdrop-blur-lg' : 'border-transparent'
      }`}
    >
      <div className={`container-shell flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5 sm:py-6'}`}>
        <a href="#" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-xl font-black shadow-lg shadow-fuchsia-500/30 sm:h-11 sm:w-11">
            C
          </span>
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">Cleanova</span>
        </a>

        <nav className="hidden items-center gap-9 text-base font-medium text-white/70 lg:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="group relative py-1 transition hover:text-white">
              {item.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full p-px text-sm font-semibold sm:text-base">
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400" />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-[#0d0b24] px-4 py-2 transition group-hover:bg-[#0d0b24]/60 sm:px-5 sm:py-2.5">
              <span>↓</span>
              <span className="sm:hidden">App</span>
              <span className="hidden sm:inline">Download App</span>
            </span>
          </button>

          <button
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className={`absolute h-0.5 w-5 rounded-full bg-white transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-5 rounded-full bg-white transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute h-0.5 w-5 rounded-full bg-white transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 ease-out lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <nav className="container-shell pb-4">
            <div className="rounded-2xl border border-white/10 bg-[#0d0b24]/95 p-2 backdrop-blur-md">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold text-white/85 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                  <span className="text-white/40">→</span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
