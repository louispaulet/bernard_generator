type StatProps = {
  label: string
  value: string
  tone: 'green' | 'rose' | 'slate'
}

export function Stat({ label, value, tone }: StatProps) {
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
