import { serviceAreas, services } from '../data';

const quickFaqs = [
  ['How fast is delivery?', 'Usually within 24–48 hours.'],
  ['Is pickup free?', 'Yes, on orders above $30.'],
  ['Do you clean shoes?', 'Sneakers, leather and suede.'],
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-[#0d7e9a] via-[#0f6f93] to-[#0b5a65] text-white">
      <svg className="absolute -top-px left-0 w-full text-slate-50" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path fill="currentColor" d="M0 0h1440v20c-240 40-480 40-720 10S240 0 0 30V0Z" />
      </svg>
      <span className="absolute -right-16 top-24 h-56 w-56 animate-float rounded-full bg-white/5" aria-hidden />
      <span
        className="absolute -left-10 bottom-10 h-40 w-40 animate-float rounded-full bg-white/5"
        style={{ animationDelay: '1.5s' }}
        aria-hidden
      />

      <div className="container-shell relative pb-8 pt-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm md:flex-row md:items-center">
          <div>
            <h3 className="text-3xl font-black">Ready for fresh clothes?</h3>
            <p className="mt-2 text-sky-50/90">Book your first pickup today and get 20% off.</p>
          </div>
          <button className="relative overflow-hidden rounded-xl bg-white px-6 py-3 font-bold text-sky-700 shadow-lg transition hover:scale-[1.03]">
            <span className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-sky-100 to-transparent" aria-hidden />
            <span className="relative">Book a Pickup</span>
          </button>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl font-bold">C</div>
              <p className="text-2xl font-extrabold tracking-tight">Cleanova</p>
            </div>
            <p className="mt-4 text-sky-50/80">
              Laundry, dry cleaning, shoe care and more — picked up and delivered to your door.
            </p>
            <div className="mt-5 space-y-1 text-sm text-sky-50/80">
              <p>support@cleanova.com</p>
              <p>+91 70190 65181</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold">Services</h4>
            <ul className="mt-4 space-y-2 text-sky-50/80">
              {services.map((s) => (
                <li key={s.kind}>
                  <a href="#services" className="inline-block transition hover:translate-x-1 hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold">Bengaluru Coverage</h4>
            <ul className="mt-4 flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <li key={area.name} className="rounded-full bg-white/10 px-3 py-1 text-sm transition hover:bg-white/20">
                  <a href="#coverage">{area.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold">Quick FAQ</h4>
            <div className="mt-4 space-y-2">
              {quickFaqs.map(([q, a]) => (
                <details key={q} className="group rounded-xl bg-white/10 px-4 py-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold">
                    {q}
                    <span className="transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-1 text-sm text-sky-50/80">{a}</p>
                </details>
              ))}
              <a href="#faq" className="inline-block pt-1 text-sm font-semibold underline-offset-4 hover:underline">
                View all FAQs →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-sm text-sky-50/70 md:flex-row">
          <p>© {year} Cleanova. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
