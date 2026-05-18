type RangeControlProps = {
  label: string
  min: number
  max: number
  value: number
  suffix: string
  onChange: (value: number) => void
}

export function RangeControl({ label, min, max, value, suffix, onChange }: RangeControlProps) {
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
