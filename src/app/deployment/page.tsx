"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Where = "on-prem" | "cloud";
type Hw = "bare-metal" | "vm";
type Launch = "direct" | "container";

function Pill({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 text-sm border " +
        (active
          ? "bg-neutral-100 text-neutral-950 border-neutral-100"
          : "bg-neutral-950 text-neutral-200 border-neutral-800")
      }
    >
      {children}
    </span>
  );
}

function ChoiceRow<T extends string>(props: {
  label: string;
  value: T;
  options: { value: T; title: string; subtitle: string }[];
  onChange: (v: T) => void;
}) {
  const { label, value, options, onChange } = props;
  return (
    <div className="space-y-3">
      <div className="text-sm uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={
                "rounded-2xl border p-4 text-left transition " +
                (active
                  ? "border-neutral-100 bg-neutral-900"
                  : "border-neutral-800 bg-neutral-950 hover:border-neutral-600")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-medium text-neutral-100">{o.title}</div>
                  <div className="mt-1 text-sm text-neutral-300">{o.subtitle}</div>
                </div>
                <Pill active={active}>{active ? "Selected" : "Select"}</Pill>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  const [where, setWhere] = useState<Where>("cloud");
  const [hw, setHw] = useState<Hw>("vm");
  const [launch, setLaunch] = useState<Launch>("container");

  const summary = useMemo(() => {
    const whereLabel = where === "on-prem" ? "on‑prem" : "cloud";
    const hwLabel = hw === "bare-metal" ? "bare metal" : "a virtual machine";
    const launchLabel = launch === "direct" ? "directly on the OS" : "in a container";

    const ownerHint =
      where === "on-prem"
        ? "Your company owns the data center + hardware."
        : "A cloud provider owns the hardware; your company leases it.";

    const hwHint =
      hw === "bare-metal"
        ? "No hypervisor layer: your OS talks to physical hardware."
        : "There’s a hypervisor: your OS is running on virtual hardware.";

    const launchHint =
      launch === "direct"
        ? "Your process is started like a normal OS service (e.g., systemd)."
        : "Your process is packaged + started by a container runtime (often via Kubernetes).";

    return {
      line: `This process runs in ${launchLabel} on ${hwLabel}, hosted in the ${whereLabel}.`,
      hints: [ownerHint, hwHint, launchHint],
    };
  }, [where, hw, launch]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-100">
            How To Always Know Where A Process Runs
          </h1>
          <p className="text-lg leading-relaxed text-neutral-200">
            All the systems we work on as software makers can be understood by separating the{" "}
            <span className="font-medium text-neutral-100">three independent questions</span> that are
            often confused and mixed together.
          </p>
        </header>

        {/* Optional: add your drawing/photo here (see instructions below) */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
          <div className="relative w-full min-h-[400px] p-[2px]">
            {/* Put your image at: /public/images/IMG_1901(or .png) */}
            <Image
              src="/images/IMG_1901.jpg"
              alt="Three-axis mental model diagram"
              width={1600}
              height={1200}
              className="object-contain bg-neutral-950"
              priority
            />
          </div>
        </div>

        <section className="space-y-8">
          <p className="text-lg leading-relaxed text-neutral-200">
            First: <span className="font-medium">where does it run?</span> That’s either{" "}
            <span className="font-medium">on‑premise</span> (a physical data center, full of servers,
            that your company owns) or <span className="font-medium">cloud</span> (hardware owned by a
            cloud provider, like AWS, that your company leases). This determines the first layer — who
            physically owns the machines, who pays for them, which country they’re in, and who is
            responsible when infrastructure fails.
          </p>

          <p className="text-lg leading-relaxed text-neutral-200">
            Second: <span className="font-medium text-neutral-100">what level of hardware abstraction exists?</span>{" "}
            A workload runs either on <span className="font-medium">bare metal</span> (directly on a
            physical server) or inside a <span className="font-medium">virtual machine</span> (via a
            hypervisor). Virtualization affects performance isolation and operational flexibility, but
            it doesn’t change the core reality: software is still just a process running on an operating
            system.
          </p>

          <p className="text-lg leading-relaxed text-neutral-200">
            Third: <span className="font-medium text-neutral-100">how is the process launched and isolated?</span>{" "}
            Software can run <span className="font-medium">directly</span> on the OS or be{" "}
            <span className="font-medium">containerized</span> using tools like Docker or Kubernetes.
            Containers do not replace machines or virtual machines; they only change how processes are
            packaged, started, and managed. Nearly every system can be described using these three axes —
            everything else is abstraction layered on top.
          </p>
        </section>

        {/* One-screen interactive widget */}
        <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-100">Classify a system in 10 seconds</h2>
            <p className="text-neutral-300">
              Pick one option per axis. You’ll get a crisp sentence you can use in design reviews,
              onboarding, or incident discussions.
            </p>
          </div>

          <ChoiceRow
            label="1) Where"
            value={where}
            onChange={setWhere}
            options={[
              {
                value: "on-prem",
                title: "On‑prem",
                subtitle: "Your company owns the data center + servers.",
              },
              {
                value: "cloud",
                title: "Cloud",
                subtitle: "A provider owns the hardware; you lease it.",
              },
            ]}
          />

          <ChoiceRow
            label="2) Hardware abstraction"
            value={hw}
            onChange={setHw}
            options={[
              {
                value: "bare-metal",
                title: "Bare metal",
                subtitle: "OS runs directly on a physical server.",
              },
              {
                value: "vm",
                title: "Virtual machine",
                subtitle: "OS runs on virtual hardware via a hypervisor.",
              },
            ]}
          />

          <ChoiceRow
            label="3) Process launch"
            value={launch}
            onChange={setLaunch}
            options={[
              {
                value: "direct",
                title: "Direct",
                subtitle: "Started like a normal OS service (systemd, etc.).",
              },
              {
                value: "container",
                title: "Containerized",
                subtitle: "Packaged + started by Docker/Kubernetes.",
              },
            ]}
          />

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5 space-y-3">
            <div className="text-sm uppercase tracking-wide text-neutral-400">Result</div>
            <div className="text-lg font-medium text-neutral-100">{summary.line}</div>
            <ul className="list-disc pl-5 text-neutral-200 space-y-1">
              {summary.hints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-neutral-400">
            Tip: in real teams, “managed” isn’t a deployment type — it’s ownership. Ask: who patches,
            who restarts, who gets paged?
          </div>
        </section>
      </div>
    </main>
  );
}
