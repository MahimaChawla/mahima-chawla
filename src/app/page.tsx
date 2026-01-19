import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top,_#111827,_#020617_60%)] text-slate-100">
      {/* soft glow behind everything */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.08),transparent_60%)]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 lg:flex-row lg:items-stretch lg:py-20">
        {/* LEFT: window / outside world */}
        <section className="flex-1">
          <div className="relative h-full min-h-[260px] rounded-[2.25rem] border border-slate-700/60 bg-[radial-gradient(circle_at_top,_#fbbf24_0,_#1f2937_40%,_#020617_80%)] shadow-[0_40px_90px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* window panes */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-500/40" />
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-500/40" />
            </div>

            {/* distant trees / skyline suggestion */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* little caption in corner */}
            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-slate-200/80 backdrop-blur">
            </div>
          </div>
        </section>

        {/* RIGHT: notebook + coffee */}
        <section className="relative flex-1">
          {/* desk shadow */}
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-black/40 blur-3xl" />

          <div className="relative rounded-[2rem] bg-[#1b1713]/95 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.95)] ring-1 ring-neutral-900/80">
            {/* coffee cup + small details at top */}
            <div className="mb-4 flex items-center justify-between gap-3 text-xs text-neutral-300/80">
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6 rounded-full border border-amber-300/40 bg-gradient-to-b from-amber-100/80 to-amber-700/80 shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-[5px] rounded-full bg-[radial-gradient(circle_at_30%_20%,_#fef9c3,_#f97316_40%,_#1b1108_90%)]" />
                </div>
                <span className="text-[11px] text-neutral-400">
                  tinker to learn
                </span>
              </div>
            </div>

            {/* the “paper” */}
            <div className="relative rounded-xl border border-amber-900/60 bg-[radial-gradient(circle_at_top,_#fefce8,_#f5e6c8_45%,_#e5d1ac_100%)] px-5 pb-6 pt-4 text-neutral-900 shadow-[0_18px_40px_rgba(0,0,0,0.85)]">
              {/* faux binding / tape */}
              <div className="pointer-events-none absolute -left-3 top-4 h-14 w-5 rotate-[-4deg] rounded-sm bg-gradient-to-b from-amber-200 to-amber-500/80 opacity-80 shadow-md" />

              <h1 className="max-w-[24rem] text-balance text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                Engineering systems and ways to understand them.
              </h1>

              <p className="mt-4 max-w-[26rem] text-sm leading-relaxed text-neutral-800/90">
                Designing resilient backend systems, visual tools, and
                interactive learning experiences that make complex engineering
                concepts intuitive and fun to learn.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Button asChild className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-neutral-50 shadow-sm hover:bg-neutral-800">
                  <Link href="/deployment">
                    That service you're working on - where does it run?
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="rounded-full border border-dashed border-neutral-400/70 bg-amber-50/40 px-5 py-2 text-sm text-neutral-900 hover:bg-amber-100/70"
                >
                  <Link href="/failure-shapes">
                   If we build very very carefully, can we avoid failure?
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
