import Link from "next/link";
import FailureLab from "./FailureLab";

export default function FailureShapesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      {/* crumb */}
      <div className="mb-8 text-xs text-[#8a7a68]">
        <Link
          href="/"
          className="underline-offset-4 hover:underline text-[#6a5a4b]"
        >
          Home
        </Link>{" "}
        <span className="mx-2">/</span>
        <span className="text-[#8a7a68]">Failure shapes</span>
      </div>

      <header className="space-y-4">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-[#231814] md:text-5xl">
          Load &amp; Capacity Failure Shapes
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#5c4c3f] sm:text-base">
          When a system can’t keep up, the outage usually isn’t “unique.” It
          tends to follow a small number of repeating shapes. Let's explore some of these shapes to understand why they happen, despite engineers seeing them coming.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {/* 1.1 */}
        <section className="rounded-3xl border border-[#d2c2ad] bg-[#f7efe3] p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#231814]">
            1.1 Load Amplification / Retry Storms
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#5c4c3f] sm:text-base">
            This failure shape is what happens when a small failure creates{" "}
            <strong>more, new load</strong> in an attempt to recover from the failure. A tiny fraction
            of requests fail, clients retry, those retries become additional
            traffic, and suddenly the system is overwhelmed by the work it
            created for itself.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <ListCard
              title="Shape"
              items={[
                "A small failure causes retries",
                "Retries multiply load",
                "The system collapses under self-inflicted traffic",
              ]}
            />
            <ListCard
              title="Typical symptoms"
              items={[
                "Some errors recover on retry… until none do",
                "QPS spikes during outages",
                "Latency tails explode - the slowest requests get much slower",
              ]}
            />
            <ListCard
              title="Bad instincts this triggers"
              items={["“If these requests retry again, they might succeed", "“Increase timeouts”", "“Scale everything blindly”"]}
            />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[#5c4c3f] sm:text-base">
            The core idea: <strong>retries are load</strong>, not healing. If you
            don’t bound retries with budgets/backoff/circuit breaking, you turn
            a 2% failure into an incident where your system is now failing
            because it keeps attempting the same work again and again.
          </p>

          <p className="mt-4 text-sm italic text-[#6a5a4b]">
            Let’s see what this looks like in a real system.
          </p>

          <div className="mt-6">
            <FailureLab initialScenario="retry_storm" />
          </div>
        </section>

        {/* 1.2 */}
        <section className="rounded-3xl border border-[#d2c2ad] bg-[#f7efe3] p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#231814]">
            1.2 Backpressure Collapse
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#5c4c3f] sm:text-base">
            Backpressure collapse happens when a downstream component slows down
            but the upstream continues sending work as if nothing changed. The
            system loses its ability to say “stop” — queues grow, threads block,
            memory spikes, and the failure becomes a long, slow suffocation.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <ListCard
              title="Shape"
              items={[
                "A slow component stops signaling pressure",
                "Upstream continues sending work",
                "Queues fill, threads block, memory spikes",
              ]}
            />
            <ListCard
              title="Typical symptoms"
              items={[
                "Partial hangs (some requests never complete)",
                "Timeouts without obvious errors",
                "Long recovery tails even after the fix",
              ]}
            />
            <ListCard
              title="Bad instincts this triggers"
              items={["“Queue it for later”", "“Add workers”", "“Let it wait”"]}
            />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[#5c4c3f] sm:text-base">
            The core idea: queues convert <strong>time</strong> problems into{" "}
            <strong>space</strong> problems. If the system can’t reject, shed, or
            slow intake, it stores pressure in memory/queue depth — and then
            fails when it runs out of space.
          </p>

          <p className="mt-4 text-sm italic text-[#6a5a4b]">
            Let’s see what this looks like in a real system.
          </p>

          <div className="mt-6">
            <FailureLab initialScenario="backpressure" />
          </div>
        </section>

        {/* 1.3 */}
        <section className="rounded-3xl border border-[#d2c2ad] bg-[#f7efe3] p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#231814]">
            1.3 Resource Exhaustion
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#5c4c3f] sm:text-base">
            Resource exhaustion is when a finite resource hits a hard limit:
            connections, threads, file handles, memory, CPU credits, etc. The
            system often looks “kind of alive” while it’s actually stuck because
            all useful capacity is tied up.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <ListCard
              title="Shape"
              items={[
                "A finite resource is depleted (connections, threads, file handles)",
                "Recovery requires draining or restart",
                "Capacity returns slower than load",
              ]}
            />
            <ListCard
              title="Typical symptoms"
              items={[
                "Flapping availability",
                "Hard limits hit",
                "Partial recovery that regresses",
              ]}
            />
            <ListCard
              title="Bad instincts this triggers"
              items={[
                "“Increase limits”",
                "“Add capacity during saturation”",
                "“Evict idle limits”",
              ]}
            />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[#5c4c3f] sm:text-base">
            The core idea: if you restore capacity without controlling ingress,
            you often get a <strong>fast relapse</strong>. Restarts or scaling
            can “clear” the resource briefly — but the load arrives at the same
            time, and you hit the limit again.
          </p>

          <p className="mt-4 text-sm italic text-[#6a5a4b]">
            Let’s see what this looks like in a real system.
          </p>

          <div className="mt-6">
            <FailureLab initialScenario="resource_exhaustion" />
          </div>
        </section>

        {/* Diagnostic quiz */}
        <section className="rounded-3xl border border-[#d2c2ad] bg-[#f7efe3] p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#231814]">
            Match the Symptom to the Shape
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5c4c3f] sm:text-base">
            A quick diagnostic: given a symptom pattern, which failure shape does
            it most likely match?
          </p>

          <div className="mt-6">
            <FailureLab initialScenario="quiz" />
          </div>
        </section>
      </div>
    </main>
  );
}

function ListCard(props: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-[#d2c2ad] bg-[#f4edde] p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8a7a68]">
        {props.title}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#231814]">
        {props.items.map((item, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 flex-none rounded-full bg-[#8f5c3b]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
