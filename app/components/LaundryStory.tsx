'use client';

import { useEffect, useRef, useState } from 'react';

const STEP_MS = 4500;

// Stock clips from Pexels (free to use) — replace with footage from your own care centre when available.
const steps = [
  { key: 'wash', short: 'Wash', video: '/videos/wash.mp4', poster: '/videos/wash.jpg', start: 1, title: 'Washing', detail: 'Sorted and machine-washed at the right temperature', icon: 'M4 3h16v18H4zM4 8h16M8 5.5h.01M12 14.5m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0' },
  { key: 'iron', short: 'Iron', video: '/videos/iron.mp4', poster: '/videos/iron.jpg', start: 1, title: 'Steam ironing', detail: 'Every piece pressed crisp, crease by crease', icon: 'M3 17h18v-3a6 6 0 0 0-6-6H9M7 8V6h8M3 17l2-6h4' },
  { key: 'fold', short: 'Fold', video: '/videos/fold.mp4', poster: '/videos/fold.jpg', start: 1, title: 'Folding', detail: 'Neatly hand-folded so nothing wrinkles', icon: 'M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4' },
  { key: 'ready', short: 'Ready', video: '/videos/ready.mp4', poster: '/videos/ready.jpg', start: 0, title: 'Packed & ready', detail: 'Fresh, folded and on its way back to you', icon: 'M5 12.5l4.5 4.5L19 7.5' },
];

export default function LaundryStory() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [paused, setPaused] = useState(false);
  // videos are only fetched after the page has finished loading (and never with data-saver on)
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const fetched = useRef(new Set<number>()); // clips keep their src once loaded, so revisiting doesn't re-download

  // pause everything while the card is off screen
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const enable = () => setCanLoadVideo(true);
    if (document.readyState === 'complete') {
      const t = setTimeout(enable, 300);
      return () => clearTimeout(t);
    }
    window.addEventListener('load', enable, { once: true });
    return () => window.removeEventListener('load', enable);
  }, []);

  // play the active clip from its start point, pause the rest
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && inView && !paused) {
        if (video.dataset.step !== String(active)) {
          video.currentTime = steps[i].start;
          video.dataset.step = String(active);
        }
        video.play().catch(() => {});
      } else {
        video.pause();
        if (i !== active) delete video.dataset.step;
      }
    });
  }, [active, inView, paused, canLoadVideo]);

  // Timer runs in JS (not a CSS animation) so it can't be cut short while the page hydrates,
  // and pausing/resuming keeps the time already elapsed.
  useEffect(() => {
    elapsed.current = 0;
  }, [active]);

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
        setActive((a) => (a + 1) % steps.length);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, paused, inView]);
  const step = steps[active];

  return (
    <div ref={rootRef} className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-soft backdrop-blur-sm sm:p-4">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-slate-900"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {steps.map((s, i) => {
          const isActive = i === active;
          const isNext = i === (active + 1) % steps.length;
          if (canLoadVideo && (isActive || isNext)) fetched.current.add(i);
          return (
            <video
              key={s.key}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={fetched.current.has(i) ? s.video : undefined}
              poster={s.poster}
              muted
              playsInline
              loop
              preload={isActive ? 'auto' : 'metadata'}
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1.06)' : 'scale(1)',
                transition: isActive
                  ? `opacity 800ms ease, transform ${STEP_MS + 800}ms linear`
                  : 'opacity 800ms ease, transform 0ms 800ms',
              }}
            />
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

        {/* story progress */}
        <div className="absolute inset-x-4 top-4 flex gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActive(i)}
              className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/30"
              aria-label={`Show ${s.title}`}
            >
              {i < active && <span className="absolute inset-0 bg-white" />}
              {i === active && (
                <span key={active} ref={barRef} className="absolute inset-y-0 left-0 w-0 bg-white" />
              )}
            </button>
          ))}
        </div>

        <div className="absolute left-4 top-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Care in progress
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-200">
            Step {active + 1} of {steps.length}
          </p>
          <h3 key={`t-${active}`} className="mt-1.5 animate-fade-up text-3xl font-black tracking-tight">
            {step.title}
          </h3>
          <p key={`d-${active}`} className="mt-1 animate-fade-up text-sm text-white/80 [animation-delay:120ms]">
            {step.detail}
          </p>
        </div>
      </div>

      {/* step chips */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((s, i) => {
          const isActive = i === active;
          const done = i < active;
          return (
            <button
              key={s.key}
              onClick={() => setActive(i)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2.5 text-[11px] font-bold transition-all duration-500 ${
                isActive ? 'bg-white text-slate-900 shadow-lg' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-500 ${
                  isActive ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white' : done ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10 text-white/70'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={done ? 'M5 12.5l4.5 4.5L19 7.5' : s.icon} />
                </svg>
              </span>
              {s.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
