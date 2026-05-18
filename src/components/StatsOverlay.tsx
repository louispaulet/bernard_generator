import { useState } from 'react'
import type { PopulationDay } from '../simulation/types'

export function StatsOverlay({ history }: { history: PopulationDay[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const maxBernards = Math.max(1, ...history.map((entry) => entry.bernards))
  const compact = history.length > 24
  const dense = history.length > 48

  return (
    <section className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-950/10">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full rounded-md border border-emerald-800 bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
        >
          Stats
        </button>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black">Bernards Per Day</h2>
              <p className="mt-1 text-sm text-slate-600">{history.length} days in the current run.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-800 transition hover:border-emerald-700"
            >
              Collapse
            </button>
          </div>
          <div className="flex h-52 items-end gap-1 overflow-x-auto border-b border-l border-slate-300 px-2 pb-3">
            {history.map((entry) => (
              <PopulationBar
                key={entry.day}
                entry={entry}
                maxBernards={maxBernards}
                compact={compact}
                dense={dense}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function PopulationBar({
  entry,
  maxBernards,
  compact,
  dense,
}: {
  entry: PopulationDay
  maxBernards: number
  compact: boolean
  dense: boolean
}) {
  const barHeight = Math.max(6, (entry.bernards / maxBernards) * 144)
  const widthClass = dense ? 'min-w-5' : compact ? 'min-w-7' : 'min-w-10'
  const barWidthClass = dense ? 'w-3' : compact ? 'w-5' : 'w-8'
  const labelClass = dense ? 'text-[0.6rem]' : 'text-xs'

  return (
    <div className={`flex h-full ${widthClass} flex-col items-center justify-end gap-1`}>
      <span className={`font-mono ${labelClass} font-black text-slate-900`}>{entry.bernards}</span>
      <div
        className={`${barWidthClass} rounded-t bg-emerald-700`}
        style={{ height: `${barHeight}px` }}
        aria-label={`Day ${entry.day}: ${entry.bernards} Bernards`}
      />
      <span className={`font-mono ${labelClass} text-slate-500`}>D{entry.day}</span>
    </div>
  )
}
