import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink, Route, Routes } from 'react-router'
import { BernardGame } from './game/BernardGame'
import { DEFAULT_SETTINGS } from './simulation/rules'
import type { SimulationSettings, SimulationSpeed, SimulationStats } from './simulation/types'

const initialStats: SimulationStats = {
  day: 1,
  livingBernards: 5,
  deadBernards: 0,
  carrotsRemaining: 0,
  birthsToday: 0,
  timeRemainingMs: DEFAULT_SETTINGS.dayDurationMs,
}

function App() {
  return (
    <main className="min-h-screen bg-[#f7f3e8] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<SimulatorPage />} />
          <Route path="about" element={<AboutPage />} />
        </Routes>
      </div>
    </main>
  )
}

function SimulatorPage() {
  const [carrotsToSurvive, setCarrotsToSurvive] = useState(DEFAULT_SETTINGS.carrotsToSurvive)
  const [carrotsToReproduce, setCarrotsToReproduce] = useState(DEFAULT_SETTINGS.carrotsToReproduce)
  const [speed, setSpeed] = useState<SimulationSpeed>(DEFAULT_SETTINGS.speed)
  const [stats, setStats] = useState<SimulationStats>(initialStats)

  const settings = useMemo<SimulationSettings>(
    () => ({
      carrotsToSurvive,
      carrotsToReproduce: Math.max(carrotsToReproduce, carrotsToSurvive + 1),
      speed,
      dayDurationMs: DEFAULT_SETTINGS.dayDurationMs,
    }),
    [carrotsToReproduce, carrotsToSurvive, speed],
  )

  const dayProgress = Math.max(
    0,
    Math.min(
      100,
      100 - (stats.timeRemainingMs / (DEFAULT_SETTINGS.dayDurationMs / settings.speed)) * 100,
    ),
  )

  return (
    <>
      <PageHeader
        eyebrow="Bernard Simulator"
        title="Carrots, naps, consequences."
        action={<PrimaryNav />}
      >
        <div className="grid grid-cols-3 gap-2 text-right">
          <Stat label="Day" value={stats.day.toString()} tone="slate" />
          <Stat label="Alive" value={stats.livingBernards.toString()} tone="green" />
          <Stat label="Gone" value={stats.deadBernards.toString()} tone="rose" />
        </div>
      </PageHeader>

      <section className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-[420px] overflow-hidden rounded-md bg-white p-2 shadow-sm ring-1 ring-slate-950/10">
          <BernardGame settings={settings} onStats={setStats} />
        </div>

        <aside className="flex flex-col gap-4">
          <section className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-950/10">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-bold">Day Clock</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900">
                {Math.ceil(stats.timeRemainingMs / 1000)}s
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-600 transition-[width]"
                style={{ width: `${dayProgress}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Metric label="Carrots" value={stats.carrotsRemaining} />
              <Metric label="Births" value={stats.birthsToday} />
            </div>
          </section>

          <section className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-950/10">
            <h2 className="mb-4 text-base font-bold">Controls</h2>
            <div className="space-y-5">
              <RangeControl
                label="Survive"
                min={1}
                max={10}
                value={settings.carrotsToSurvive}
                suffix="carrots"
                onChange={(value) => {
                  setCarrotsToSurvive(value)
                  setCarrotsToReproduce((current) => Math.max(current, value + 1))
                }}
              />
              <RangeControl
                label="Reproduce"
                min={2}
                max={15}
                value={settings.carrotsToReproduce}
                suffix="carrots"
                onChange={(value) => setCarrotsToReproduce(Math.max(value, carrotsToSurvive + 1))}
              />
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-800">Speed</label>
                  <span className="font-mono text-sm font-bold text-slate-950">{speed}x</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3] as const).map((speedOption) => (
                    <button
                      key={speedOption}
                      type="button"
                      onClick={() => setSpeed(speedOption)}
                      className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                        speed === speedOption
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-slate-300 bg-slate-50 text-slate-800 hover:border-emerald-600'
                      }`}
                    >
                      {speedOption}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="A tiny pressure cooker for tiny people." action={<PrimaryNav />} />

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
            <AboutFact label="Rules" value="Pure TypeScript functions decide survival and reproduction." />
            <AboutFact label="Hosting" value="GitHub Pages with hash-based navigation." />
          </dl>
        </article>
      </section>
    </>
  )
}

function PageHeader({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string
  title: string
  action: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="flex flex-col justify-between gap-3 border-b border-slate-950/10 pb-4 md:flex-row md:items-end">
      <div>
        <div className="mb-3">{action}</div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-800">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
          {title}
        </h1>
      </div>
      {children}
    </header>
  )
}

function PrimaryNav() {
  return (
    <nav className="flex gap-2" aria-label="Primary">
      <NavItem to="/" label="Simulator" />
      <NavItem to="/about" label="About" />
    </nav>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md border px-3 py-2 text-sm font-bold transition ${
          isActive
            ? 'border-emerald-700 bg-emerald-700 text-white'
            : 'border-slate-300 bg-white text-slate-800 hover:border-emerald-600'
        }`
      }
    >
      {label}
    </NavLink>
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

type StatProps = {
  label: string
  value: string
  tone: 'green' | 'rose' | 'slate'
}

function Stat({ label, value, tone }: StatProps) {
  const toneClass = {
    green: 'bg-emerald-700 text-white',
    rose: 'bg-rose-700 text-white',
    slate: 'bg-slate-900 text-white',
  }[tone]

  return (
    <div className={`min-w-20 rounded-md px-3 py-2 ${toneClass}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.12em] opacity-80">{label}</div>
      <div className="font-mono text-2xl font-black">{value}</div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-2xl font-black text-slate-950">{value}</div>
    </div>
  )
}

type RangeControlProps = {
  label: string
  min: number
  max: number
  value: number
  suffix: string
  onChange: (value: number) => void
}

function RangeControl({ label, min, max, value, suffix, onChange }: RangeControlProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-slate-800" htmlFor={label}>
          {label}
        </label>
        <span className="font-mono text-sm font-bold text-slate-950">
          {value} {suffix}
        </span>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-700"
      />
      <div className="mt-1 flex justify-between font-mono text-xs text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default App
