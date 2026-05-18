import { useMemo, useState } from 'react'
import { ControlsPanel } from '../components/ControlsPanel'
import { DayClock } from '../components/DayClock'
import { PageHeader } from '../components/PageHeader'
import { PrimaryNav } from '../components/PrimaryNav'
import { Stat } from '../components/Stat'
import { StatsOverlay } from '../components/StatsOverlay'
import { BernardGame } from '../game/BernardGame'
import { DEFAULT_SETTINGS } from '../simulation/rules'
import type { SimulationSettings, SimulationSpeed, SimulationStats } from '../simulation/types'

const initialStats: SimulationStats = {
  day: 1,
  livingBernards: 5,
  deadBernards: 0,
  carrotsRemaining: 0,
  birthsToday: 0,
  timeRemainingMs: DEFAULT_SETTINGS.dayDurationMs,
  bernardsPerDay: [{ day: 1, bernards: 5 }],
}

export function SimulatorPage() {
  const [carrotsToSurvive, setCarrotsToSurvive] = useState(DEFAULT_SETTINGS.carrotsToSurvive)
  const [carrotsToReproduce, setCarrotsToReproduce] = useState(DEFAULT_SETTINGS.carrotsToReproduce)
  const [totalCarrots, setTotalCarrots] = useState(DEFAULT_SETTINGS.totalCarrots)
  const [speed, setSpeed] = useState<SimulationSpeed>(DEFAULT_SETTINGS.speed)
  const [stats, setStats] = useState<SimulationStats>(initialStats)
  const [restartKey, setRestartKey] = useState(0)

  const settings = useMemo<SimulationSettings>(
    () => ({
      carrotsToSurvive,
      carrotsToReproduce,
      totalCarrots,
      speed,
      dayDurationMs: DEFAULT_SETTINGS.dayDurationMs,
    }),
    [carrotsToReproduce, carrotsToSurvive, speed, totalCarrots],
  )

  const restartSimulation = () => {
    if (!window.confirm('Restart the simulation? Current population history will be cleared.')) {
      return
    }

    setStats(initialStats)
    setRestartKey((key) => key + 1)
  }

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
          <BernardGame key={restartKey} settings={settings} onStats={setStats} />
        </div>

        <aside className="flex flex-col gap-4">
          <DayClock settings={settings} stats={stats} />
          <ControlsPanel
            settings={settings}
            setCarrotsToSurvive={setCarrotsToSurvive}
            setCarrotsToReproduce={setCarrotsToReproduce}
            setTotalCarrots={setTotalCarrots}
            setSpeed={setSpeed}
            onRestart={restartSimulation}
          />
          <StatsOverlay history={stats.bernardsPerDay} />
        </aside>
      </section>
    </>
  )
}
