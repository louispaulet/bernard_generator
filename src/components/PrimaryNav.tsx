import { NavLink } from 'react-router'

export function PrimaryNav() {
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
