import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
      <div className="max-w-3xl space-y-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-6xl">
          Engineering systems and ways to understand them.
        </h1>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300">
          Designing resilient backend systems, visual tools, and interactive learning
          experiences that make complex engineering concepts intuitive and fun to learn.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button size="lg" asChild className="px-8 py-6 text-base">
            <Link href="/exception-game">Play the Exception Flow Game</Link>
          </Button>

          <Link
            href="/writing"
            className="text-sm font-medium text-slate-400 transition hover:text-slate-200"
          >
            Explore my writing →
          </Link>
        </div>
      </div>
    </main>
  );
}
