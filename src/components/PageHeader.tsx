import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow: string
  title: string
  action: ReactNode
  children?: ReactNode
}

export function PageHeader({ eyebrow, title, action, children }: PageHeaderProps) {
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
