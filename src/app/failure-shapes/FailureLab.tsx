"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ScenarioKey = "retry_storm" | "backpressure" | "resource_exhaustion" | "quiz";

type Metrics = {
  incomingLoad: number; // 0-100
  errorRate: number; // 0-100
  queueDepth: number; // 0-100
  p50: number; // ms
  p99: number; // ms
  healthyCapacity: number; // 0-100
};

type ActionResult = {
  next: Metrics;
  headline: string;
  narrative: string;
  reveal?: string;
};

export default function FailureLab({ initialScenario }: { initialScenario: ScenarioKey }) {
  const scenario = initialScenario;

  if (scenario === "quiz") return <SymptomQuiz />;

  return <ScenarioLab scenario={scenario} />;
}

function ScenarioLab({ scenario }: { scenario: Exclude<ScenarioKey, "quiz"> }) {
  const spec = useMemo(() => getScenarioSpec(scenario), [scenario]);
  const [metrics, setMetrics] = useState<Metrics>(spec.initial);
  const [step, setStep] = useState<number>(0);
  const [log, setLog] = useState<{ actionId: string; result: ActionResult }[]>([]);
  const [revealed, setRevealed] = useState<boolean>(false);

  function apply(actionId: string) {
    const action = spec.actions.find((a) => a.id === actionId);
    if (!action) return;

    const result = action.transition(metrics, step);
    const nextMetrics = clampMetrics(result.next);

    setMetrics(nextMetrics);
    setStep((s) => s + 1);
    setLog((l) => [...l, { actionId, result }]);

    if (!revealed && result.reveal) setRevealed(true);
  }

  function reset() {
    setMetrics(spec.initial);
    setStep(0);
    setLog([]);
    setRevealed(false);
  }

  return (
    <div className="rounded-2xl border border-[#d2c2ad] bg-[#f4edde] p-5">
      {/* Prompt */}
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8a7a68]">
          interactive lab
        </p>
        <p className="text-sm leading-relaxed text-[#231814]">
          <strong>{spec.promptTitle}</strong>
        </p>
        <p className="text-sm leading-relaxed text-[#5c4c3f]">{spec.promptBody}</p>
      </div>

      {/* Diagram */}
      <div className="mt-4 rounded-xl border border-[#d2c2ad] bg-[#f7efe3] p-4 font-mono text-[12px] text-[#231814]">
        {spec.diagram}
      </div>

      {/* Metrics */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricBar label="Incoming load" value={metrics.incomingLoad} />
        <MetricBar label="Healthy capacity" value={metrics.healthyCapacity} invert />
        <MetricBar label="Error rate" value={metrics.errorRate} />
        <MetricBar label="Queue depth" value={metrics.queueDepth} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <MetricText label="Latency p50" value={`${metrics.p50} ms`} />
        <MetricText label="Latency p99" value={`${metrics.p99} ms`} />
      </div>

      {/* Actions */}
      <div className="mt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8a7a68]">
          choose an instinct
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {spec.actions.map((a) => (
            <button
              key={a.id}
              onClick={() => apply(a.id)}
              className="rounded-full border border-[#cbb9a2] bg-[#f7efe3] px-4 py-2 text-sm text-[#231814] transition hover:bg-[#efe3d2]"
            >
              {a.label}
            </button>
          ))}

          <button
            onClick={reset}
            className="ml-auto rounded-full border border-[#cbb9a2] bg-transparent px-4 py-2 text-sm text-[#6a5a4b] transition hover:bg-[#efe3d2]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Outcome / narrative */}
      {log.length > 0 && (
        <div className="mt-5 space-y-3">
          {log.slice(-1).map(({ result }, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#d2c2ad] bg-[#f7efe3] p-4"
            >
              <p className="text-sm font-semibold text-[#231814]">
                {result.headline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#5c4c3f]">
                {result.narrative}
              </p>
              {result.reveal && (
                <div className="mt-3 rounded-xl border border-[#d2c2ad] bg-[#f4edde] p-3 text-sm text-[#231814]">
                  <strong>Shape revealed:</strong> {result.reveal}
                </div>
              )}
            </div>
          ))}

          {revealed && (
            <p className="text-xs text-[#8a7a68]">
              Tip: try a different instinct and watch which metric goes
              nonlinear first.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MetricBar({
  label,
  value,
  invert,
}: {
  label: string;
  value: number;
  invert?: boolean;
}) {
  // for capacity, "lower is worse" so invert means fill represents risk
  const risk = invert ? 100 - value : value;

  return (
    <div className="rounded-2xl border border-[#d2c2ad] bg-[#f7efe3] p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium text-[#6a5a4b]">{label}</p>
        <p className="text-xs text-[#8a7a68]">{Math.round(value)}%</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[#e2d4c0]">
        <div
          className="h-2 rounded-full bg-[#8f5c3b]"
          style={{ width: `${clamp01(risk / 100) * 100}%` }}
        />
      </div>
    </div>
  );
}

function MetricText({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#d2c2ad] bg-[#f7efe3] p-4">
      <p className="text-xs font-medium text-[#6a5a4b]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#231814]">{value}</p>
    </div>
  );
}

function SymptomQuiz() {
  const questions = [
    {
      prompt: "QPS spikes during the outage; p99 explodes; errors sometimes recover on retry.",
      answer: "Retry storm / load amplification",
    },
    {
      prompt: "Timeouts without errors; partial hangs; recovery takes a long time after the fix.",
      answer: "Backpressure collapse",
    },
    {
      prompt: "Hard limit hit (connections/threads); flapping availability; restart helps briefly then relapses.",
      answer: "Resource exhaustion",
    },
  ];

  const choices = [
    "Retry storm / load amplification",
    "Backpressure collapse",
    "Resource exhaustion",
  ] as const;

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const q = questions[i];

  return (
    <div className="rounded-2xl border border-[#d2c2ad] bg-[#f4edde] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8a7a68]">
        diagnostic mini-quiz
      </p>

      <p className="mt-3 text-sm leading-relaxed text-[#231814]">
        <strong>Symptom pattern:</strong> {q.prompt}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {choices.map((c) => (
          <button
            key={c}
            onClick={() => setPicked(c)}
            className="rounded-full border border-[#cbb9a2] bg-[#f7efe3] px-4 py-2 text-sm text-[#231814] transition hover:bg-[#efe3d2]"
          >
            {c}
          </button>
        ))}
      </div>

      {picked && (
        <div className="mt-4 rounded-2xl border border-[#d2c2ad] bg-[#f7efe3] p-4">
          {picked === q.answer ? (
            <p className="text-sm text-[#231814]">
              ✅ Correct. This pattern most strongly matches{" "}
              <strong>{q.answer}</strong>.
            </p>
          ) : (
            <p className="text-sm text-[#231814]">
              ❌ Not quite. The best match is <strong>{q.answer}</strong>.
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => {
                setPicked(null);
                setI((x) => (x + 1) % questions.length);
              }}
              className="rounded-full border border-[#cbb9a2] bg-[#f4edde] px-4 py-2 text-sm text-[#231814] transition hover:bg-[#efe3d2]"
            >
              Next
            </button>

            <Link
              href="/failure-shapes"
              className="text-sm text-[#6a5a4b] underline-offset-4 hover:underline"
            >
              Restart quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/** Scenario specs + transitions */

function getScenarioSpec(key: Exclude<ScenarioKey, "quiz">) {
  const sharedInitial: Metrics = {
    incomingLoad: 55,
    errorRate: 2,
    queueDepth: 20,
    p50: 80,
    p99: 220,
    healthyCapacity: 75,
  };

  if (key === "retry_storm") {
    return {
      initial: {
        ...sharedInitial,
        incomingLoad: 55,
        errorRate: 2,
        queueDepth: 18,
        p50: 90,
        p99: 260,
        healthyCapacity: 78,
      },
      promptTitle: "The system starts returning 500s for ~2% of requests. What do you do?",
      promptBody:
        "A small downstream hiccup appears. Nothing is fully down (yet). Your next move determines whether this stays small or turns into self-inflicted load.",
      diagram: `Client → API → Worker Pool → DB`,
      actions: [
        action("retry_harder", "🔁 Retry failed requests", (m) => {
          const next = {
            ...m,
            incomingLoad: m.incomingLoad + 25,
            errorRate: m.errorRate + 10,
            queueDepth: m.queueDepth + 22,
            p50: m.p50 + 60,
            p99: m.p99 + 1400,
            healthyCapacity: m.healthyCapacity - 18,
          };
          return {
            next,
            headline: "Retries became new traffic.",
            narrative:
              "You turned a 2% failure into extra QPS. Retries stack on top of baseline load, saturate workers, and push p99 into seconds. The system is now failing because it’s trying to heal itself.",
            reveal: "Retry Storm (Load Amplification)",
          };
        }),
        action("increase_timeouts", "⏱ Increase timeouts", (m) => {
          const next = {
            ...m,
            errorRate: m.errorRate + 4,
            queueDepth: m.queueDepth + 18,
            p50: m.p50 + 80,
            p99: m.p99 + 1800,
            healthyCapacity: m.healthyCapacity - 10,
          };
          return {
            next,
            headline: "You hid the failure by waiting longer.",
            narrative:
              "Longer timeouts keep work in-flight. Threads stay occupied, queues deepen, and latency balloons. You didn’t reduce load—so the system has less room to recover.",
            reveal: "Retry/Timeout Amplification (Load Amplification family)",
          };
        }),
        action("scale_everything", "📈 Scale all services", (m) => {
          const next = {
            ...m,
            healthyCapacity: m.healthyCapacity + 8,
            errorRate: m.errorRate + 3,
            queueDepth: m.queueDepth + 10,
            p99: m.p99 + 700,
          };
          return {
            next,
            headline: "You added capacity… but also fed the hotspot.",
            narrative:
              "Scaling can help, but if the bottleneck is downstream (DB, dependency, shared pool), you often accelerate collapse by allowing more concurrent work to pile into the constrained layer.",
            reveal: "Load Amplification risk (capacity without load control)",
          };
        }),
        action("retry_budget", "🚦 Introduce retry limits + backoff", (m) => {
          const next = {
            ...m,
            incomingLoad: Math.max(0, m.incomingLoad - 8),
            errorRate: Math.max(0, m.errorRate - 1),
            queueDepth: Math.max(0, m.queueDepth - 8),
            p50: Math.max(40, m.p50 - 10),
            p99: Math.max(120, m.p99 - 60),
            healthyCapacity: Math.min(100, m.healthyCapacity + 6),
          };
          return {
            next,
            headline: "You bounded the blast radius.",
            narrative:
              "Backoff + budgets stop retries from becoming a second traffic source. Failures are now contained, and the system has space to recover without self-inflicted QPS spikes.",
            reveal: "Prevented: Retry Storm (by controlling retry load)",
          };
        }),
      ],
    };
  }

  if (key === "backpressure") {
    return {
      initial: {
        ...sharedInitial,
        incomingLoad: 60,
        errorRate: 1,
        queueDepth: 35,
        p50: 110,
        p99: 420,
        healthyCapacity: 70,
      },
      promptTitle: "A downstream service slows down ~3×. Requests start piling up. What do you do?",
      promptBody:
        "Nothing is “down.” But throughput dropped. If upstream keeps pushing at the same rate, pressure has to go somewhere.",
      diagram: `Client → API → Queue → Workers → Provider
                         ↓
                    slower x3`,
      actions: [
        action("queue_everything", "📥 Queue requests if workers can't process fast enough", (m) => {
          const next = {
            ...m,
            queueDepth: m.queueDepth + 35,
            p99: m.p99 + 1800,
            p50: m.p50 + 200,
            errorRate: m.errorRate + 2,
            healthyCapacity: m.healthyCapacity - 12,
          };
          return {
            next,
            headline: "You stored pressure as space.",
            narrative:
              "Queue depth climbs and becomes a memory/time bomb. Even if the downstream recovers, draining the backlog takes a long time—so users experience a long tail of slowness after the ‘fix.’",
            reveal: "Backpressure Collapse",
          };
        }),
        action("add_workers", "👷 Add workers to API", (m) => {
          const next = {
            ...m,
            queueDepth: m.queueDepth + 18,
            incomingLoad: m.incomingLoad + 8,
            p99: m.p99 + 1200,
            healthyCapacity: m.healthyCapacity - 20,
          };
          return {
            next,
            headline: "You amplified concurrency into the bottleneck.",
            narrative:
              "More workers increase in-flight requests against a slower downstream. Throughput doesn’t improve much, but contention grows. The system feels ‘busier’ while making less progress.",
            reveal: "Backpressure Collapse risk (hidden pressure + concurrency)",
          };
        }),
        action("apply_backpressure", "⛔ Apply backpressure (shed / reject)", (m) => {
          const next = {
            ...m,
            incomingLoad: Math.max(0, m.incomingLoad - 15),
            errorRate: m.errorRate + 2,
            queueDepth: Math.max(0, m.queueDepth - 12),
            p50: Math.max(60, m.p50 - 20),
            p99: Math.max(150, m.p99 - 120),
            healthyCapacity: Math.min(100, m.healthyCapacity + 10),
          };
          return {
            next,
            headline: "You preserved the system’s ability to breathe.",
            narrative:
              "Shedding load is painful but stabilizing. You trade some errors for bounded latency and avoid creating a backlog that will haunt you after recovery.",
            reveal: "Prevented: Backpressure Collapse (by rejecting work)",
          };
        }),
        action("pause_upstream", "⏸ Pause upstream temporarily", (m) => {
          const next = {
            ...m,
            incomingLoad: Math.max(0, m.incomingLoad - 22),
            queueDepth: Math.max(0, m.queueDepth - 20),
            p99: Math.max(160, m.p99 - 250),
            healthyCapacity: Math.min(100, m.healthyCapacity + 8),
          };
          return {
            next,
            headline: "You stopped the pile-up.",
            narrative:
              "Temporarily pausing upstream gives the slow component time to catch up. The main win is preventing queues and threads from filling until everything becomes a partial hang.",
            reveal: "Prevented: Backpressure Collapse (by stopping intake)",
          };
        }),
      ],
    };
  }

  // resource_exhaustion
  return {
    initial: {
      ...sharedInitial,
      incomingLoad: 65,
      errorRate: 3,
      queueDepth: 40,
      p50: 140,
      p99: 900,
      healthyCapacity: 55,
    },
    promptTitle: "DB connection pool is exhausted. Some requests hang. What do you do?",
    promptBody:
      "The system isn’t fully dead—it’s stuck. Work is in-flight, but progress is limited because a hard resource cap has been hit.",
    diagram: `API → Worker Pool → DB
      (threads)    (conn pool maxed)`,
    actions: [
      action("increase_max_conn", "🔧 Increase max connections to DB", (m) => {
        const next = {
          ...m,
          healthyCapacity: m.healthyCapacity + 6,
          p99: m.p99 + 600,
          errorRate: m.errorRate + 4,
          queueDepth: m.queueDepth + 10,
        };
        return {
          next,
          headline: "You raised the ceiling… and worsened contention.",
          narrative:
            "More DB connections can turn a limit into a thrash. If the DB is the bottleneck, higher concurrency can reduce per-query throughput and increase tail latency.",
          reveal: "Resource Exhaustion (hard limits + contention)",
        };
      }),
      action("add_instances", "🚀 Add instances to worker pool", (m) => {
        const next = {
          ...m,
          incomingLoad: m.incomingLoad + 10,
          p99: m.p99 + 800,
          queueDepth: m.queueDepth + 12,
          healthyCapacity: m.healthyCapacity - 8,
        };
        return {
          next,
          headline: "You increased concurrency into the same cap.",
          narrative:
            "Adding instances can increase the number of threads trying to acquire the same scarce resource. If the shared bottleneck is the DB pool, you can accelerate saturation.",
          reveal: "Resource Exhaustion risk (capacity added without ingress control)",
        };
      }),
      action("restart", "♻️ Restart service", (m, step) => {
        const relapses = step >= 1;
        const next = relapses
          ? {
              ...m,
              errorRate: m.errorRate + 6,
              queueDepth: m.queueDepth + 18,
              p99: m.p99 + 1200,
              healthyCapacity: m.healthyCapacity - 10,
            }
          : {
              ...m,
              errorRate: Math.max(0, m.errorRate - 2),
              queueDepth: Math.max(0, m.queueDepth - 25),
              p99: Math.max(250, m.p99 - 500),
              healthyCapacity: Math.min(100, m.healthyCapacity + 10),
            };
        return {
          next,
          headline: relapses ? "It worked… briefly. Then it relapsed." : "You cleared the stuck work—temporarily.",
          narrative: relapses
            ? "Without reducing intake or concurrency, the same load pattern reappears and the pool exhausts again. This is the classic fast-relapse signature."
            : "Restarts can drain in-flight requests and free resources. But unless you control load, the same pressure rebuilds.",
          reveal: "Resource Exhaustion (fast relapse unless ingress is controlled)",
        };
      }),
      action("reduce_concurrency", "📉 Reduce concurrency of worker pool / shed load", (m) => {
        const next = {
          ...m,
          incomingLoad: Math.max(0, m.incomingLoad - 18),
          queueDepth: Math.max(0, m.queueDepth - 18),
          errorRate: Math.max(0, m.errorRate - 1),
          p50: Math.max(70, m.p50 - 40),
          p99: Math.max(180, m.p99 - 350),
          healthyCapacity: Math.min(100, m.healthyCapacity + 14),
        };
        return {
          next,
          headline: "You created headroom so the system can drain.",
          narrative:
            "Reducing concurrency lowers resource contention. Combined with load shedding, it prevents the system from immediately re-exhausting the resource while it recovers.",
          reveal: "Prevented: Resource Exhaustion (by controlling ingress and concurrency)",
        };
      }),
    ],
  };
}

function action(
  id: string,
  label: string,
  transition: (m: Metrics, step: number) => ActionResult
) {
  return { id, label, transition };
}

function clampMetrics(m: Metrics): Metrics {
  return {
    incomingLoad: clamp100(m.incomingLoad),
    errorRate: clamp100(m.errorRate),
    queueDepth: clamp100(m.queueDepth),
    p50: clamp(m.p50, 20, 5000),
    p99: clamp(m.p99, 50, 20000),
    healthyCapacity: clamp100(m.healthyCapacity),
  };
}

function clamp100(n: number) {
  return clamp(n, 0, 100);
}

function clamp01(n: number) {
  return clamp(n, 0, 1);
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
