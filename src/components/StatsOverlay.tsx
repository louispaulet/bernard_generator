import { useState } from 'react'
import type { PopulationDay } from '../simulation/types'

export function StatsOverlay({ history }: { history: PopulationDay[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const visibleHistory = history.slice(-14)
  const maxBernards = Math.max(1, ...visibleHistory.map((entry) => entry.bernards))

  return (
    <section className="fixed bottom-4 right-4 z-20 w-[min(26rem,calc(100vw-2rem))]">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ml-auto flex rounded-md border border-emerald-800 bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:bg-emerald-800"
        >
          Stats
        </button>
      ) : (
        <div className="rounded-md border border-slate-950/10 bg-white p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black">Bernards Per Day</h2>
              <p className="mt-1 text-sm text-slate-600">Population history from the current run.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-800 transition hover:border-emerald-700"
            >
              Collapse
            </button>
          </div>
          <div className="flex h-56 items-end gap-2 overflow-x-auto border-b border-l border-slate-300 px-3 pb-3">
            {visibleHistory.map((entry) => (
              <PopulationBar key={entry.day} entry={entry} maxBernards={maxBernards} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function PopulationBar({ entry, maxBernards }: { entry: PopulationDay; maxBernards: number }) {
  const barHeight = Math.max(8, (entry.bernards / maxBernards) * 168)

  return (
    <div className="flex h-full min-w-10 flex-col items-center justify-end gap-2">
      <span className="font-mono text-xs font-black text-slate-900">{entry.bernards}</span>
      <div
        className="w-8 rounded-t bg-emerald-700"
        style={{ height: `${barHeight}px` }}
        aria-label={`Day ${entry.day}: ${entry.bernards} Bernards`}
      />
      <span className="font-mono text-xs text-slate-500">D{entry.day}</span>
    </div>
  )
}
