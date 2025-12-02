import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-semibold text-slate-50">
          Hello, aesthetic web ✨
        </h1>
        <p className="text-slate-400">
          This button is coming from shadcn/ui, styled with Tailwind v4.
        </p>
        <Button size="lg">
          Click me
        </Button>
      </div>
    </main>
  );
}
