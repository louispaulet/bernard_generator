import { PageHeader } from '../components/PageHeader'
import { PrimaryNav } from '../components/PrimaryNav'

export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A tiny pressure cooker for tiny people."
        action={<PrimaryNav />}
      />

      <section className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <article className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-950/10">
          <h2 className="text-xl font-black">What Is This?</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Bernard Simulator is a small browser experiment about simple needs and emergent
            population growth. Every Bernard starts the day at home, looks for carrots, and earns
            another sunrise only if he eats enough.
          </p>
          <p className="mt-3 leading-7 text-slate-700">
            It is intentionally frontend-only for now: no accounts, no backend, no persistence.
            The whole world lives in the browser and resets when the page reloads.
          </p>
        </article>

        <article className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-950/10">
          <h2 className="text-xl font-black">How It Works</h2>
          <dl className="mt-4 grid gap-3">
            <AboutFact label="Engine" value="Phaser renders the simulated world." />
            <AboutFact label="Interface" value="React owns the controls, routing, and stats." />
            <AboutFact label="Rules" value="Pure TypeScript classes decide the world state." />
            <AboutFact label="Hosting" value="GitHub Pages with hash-based navigation." />
          </dl>
        </article>
      </section>
    </>
  )
}

function AboutFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
    </div>
  )
}
