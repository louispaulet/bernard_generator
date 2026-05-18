import type { SimulationSettings, SimulationSpeed } from '../simulation/types'
import { RangeControl } from './RangeControl'

type ControlsPanelProps = {
  settings: SimulationSettings
  setCarrotsToSurvive: (value: number) => void
  setCarrotsToReproduce: (value: number) => void
  setTotalCarrots: (value: number) => void
  setSpeed: (speed: SimulationSpeed) => void
  onRestart: () => void
}

export function ControlsPanel({
  settings,
  setCarrotsToSurvive,
  setCarrotsToReproduce,
  setTotalCarrots,
  setSpeed,
  onRestart,
}: ControlsPanelProps) {
  return (
    <section className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-950/10">
      <h2 className="mb-4 text-base font-bold">Controls</h2>
      <div className="space-y-5">
        <RangeControl
          label="Survive"
          min={1}
          max={10}
          value={settings.carrotsToSurvive}
          suffix="carrots"
          onChange={setCarrotsToSurvive}
        />
        <RangeControl
          label="Reproduce"
          min={1}
          max={15}
          value={settings.carrotsToReproduce}
          suffix="carrots"
          onChange={setCarrotsToReproduce}
        />
        <RangeControl
          label="Total Carrots"
          min={10}
          max={120}
          value={settings.totalCarrots}
          suffix="total"
          onChange={setTotalCarrots}
        />
        <SpeedControl speed={settings.speed} setSpeed={setSpeed} />
        <button
          type="button"
          onClick={onRestart}
          className="w-full rounded-md border border-red-800 bg-red-700 px-4 py-3 text-sm font-black text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Restart Simulation
        </button>
      </div>
    </section>
  )
}

function SpeedControl({
  speed,
  setSpeed,
}: {
  speed: SimulationSpeed
  setSpeed: (speed: SimulationSpeed) => void
}) {
  return (
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
  )
}
