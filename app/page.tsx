import About from './components/About';
import Coverage from './components/Coverage';
import LaundryStory from './components/LaundryStory';
import Faq from './components/Faq';
// import Partners from './components/Partners'; // hidden for now
import { WHATSAPP_URL } from './data';
import Footer from './components/Footer';
import Process from './components/Process';
import Services from './components/Services';
import SiteHeader from './components/SiteHeader';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-[#07061a] text-white">
        {/* aurora backdrop */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-40 -top-40 h-[560px] w-[560px] animate-blob bg-violet-600/40 blur-[130px]" />
          <div className="absolute right-[-10%] top-[10%] h-[520px] w-[520px] animate-blob bg-fuchsia-600/30 blur-[130px]" style={{ animationDelay: '-5s' }} />
          <div className="absolute -bottom-40 left-[20%] h-[480px] w-[620px] animate-blob bg-emerald-500/25 blur-[130px]" style={{ animationDelay: '-9s' }} />
          <div
            className="absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)', backgroundSize: '56px 56px' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07061a] to-transparent" />
        </div>

        <SiteHeader />

        <section className="relative pb-24 pt-32 sm:pt-36">
          <div className="container-shell grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur">
                <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">✦</span>
                Premium laundry care · India
              </span>
              <h1 className="mt-7 max-w-xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
                Your Clothes,{' '}
                <span className="animate-gradient-x bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 bg-[length:200%_auto] bg-clip-text text-transparent">
                  Our Care.
                </span>
              </h1>
              <p className="mt-5 flex items-center gap-3 text-xl font-semibold text-white/85 md:text-2xl">
                <span className="h-px w-10 bg-gradient-to-r from-violet-400 to-fuchsia-400" aria-hidden />
                We Care for Every Thread.
              </p>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/65">
                Cleanova helps you schedule laundry pickup and delivery in minutes, so you can focus on what matters most.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <button className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-slate-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] transition hover:scale-[1.03]">
                  Book a Pickup
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-[#25D366]/20"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#25D366] transition-transform duration-300 group-hover:rotate-12" fill="currentColor" aria-hidden>
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.69 8.24-8.23 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {[
                    ['AS', 'from-violet-400 to-violet-600'],
                    ['RK', 'from-fuchsia-400 to-pink-600'],
                    ['MP', 'from-amber-300 to-orange-500'],
                    ['DV', 'from-emerald-400 to-teal-600'],
                  ].map(([initials, bg]) => (
                    <span
                      key={initials}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${bg} text-xs font-bold ring-2 ring-[#07061a]`}
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    <span className="text-amber-300">★★★★★</span> 4.9/5
                  </p>
                  <p className="text-sm text-white/55">Loved by 25k+ customers</p>
                </div>
              </div>

              <div className="mt-8 grid max-w-md grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-center backdrop-blur">
                {[
                  ['25k+', 'Happy customers'],
                  ['24h', 'Express delivery'],
                  ['24/7', 'Support'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black">{value}</p>
                    <p className="text-xs text-white/55">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="pointer-events-none absolute right-[5%] top-1/2 h-[80%] w-[80%] -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-emerald-400/30 blur-3xl" aria-hidden />
              <div className="relative w-full max-w-md">
                <LaundryStory />
                <div className="absolute -left-14 -top-5 hidden animate-float rounded-2xl border border-white/15 bg-[#15123a]/90 px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md xl:block">
                  <span className="text-emerald-300">✓</span> Eco-friendly detergents
                </div>
                <div
                  className="absolute -right-10 top-[42%] hidden animate-float rounded-2xl border border-white/15 bg-[#15123a]/90 px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md xl:block"
                  style={{ animationDelay: '-2s' }}
                >
                  <span className="text-amber-300">⚡</span> 24h express
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <About />

      <Services />
      <Process />

      <section className="py-20">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-700">Getting started</p>
            <h2 className="mt-4 text-4xl font-black text-slate-900">From pickup to delivery in 3 easy steps</h2>
            <div className="mt-8 space-y-5">
              {[
                ['01', 'Schedule a pickup'],
                ['02', 'We wash and fold'],
                ['03', 'Your laundry is delivered'],
              ].map(([step, label]) => (
                <div key={step} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-lg font-black text-sky-700">
                    {step}
                  </div>
                  <p className="text-xl font-semibold text-slate-800">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-cyan-800 p-8 text-white shadow-soft">
            <div className="rounded-[1.5rem] bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-100">Trusted by busy families</p>
              <h3 className="mt-4 text-3xl font-black">Clean clothes. Reliable service. Zero hassle.</h3>
              <p className="mt-4 text-sky-50/90">
                Whether it is weekly laundry or a special cleaning request, our service is built for speed, care, and peace of mind.
              </p>
              <button className="mt-8 rounded-xl bg-white px-6 py-3 text-base font-bold text-sky-700 transition hover:scale-[1.02]">
                Try Cleanova today
              </button>
            </div>
          </div>
        </div>
      </section>

      <Coverage />
      <Faq />
      {/* <Partners /> — cleaning partners section hidden for now */}
      <Footer />
    </main>
  );
}
