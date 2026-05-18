import { DEFAULT_SETTINGS } from '../simulation/rules'
import type { SimulationSettings, SimulationStats } from '../simulation/types'
import { Metric } from './Metric'

type DayClockProps = {
  settings: SimulationSettings
  stats: SimulationStats
}

export function DayClock({ settings, stats }: DayClockProps) {
  const dayProgress = Math.max(
    0,
    Math.min(
      100,
      100 - (stats.timeRemainingMs / (DEFAULT_SETTINGS.dayDurationMs / settings.speed)) * 100,
    ),
  )

  return (
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
  )
}
