import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Visão Executiva', path: '/' },
  { label: 'Marketing', path: '/marketing' },
  { label: 'Produtos', path: '/produtos' },
  { label: 'Clientes', path: '/clientes' },
  { label: 'Diagnóstico', path: '/diagnostico' },
] as const

export function AppSidebar() {
  const location = useLocation()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-[hsl(var(--sidebar))]">
      {/* Branding */}
      <div className="flex h-14 items-center border-b border-white/10 px-5">
        <span className="text-sm font-semibold tracking-wide text-white">
          BI Omnichannel
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, path }) => {
          const isActive =
            path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(path)

          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-[hsl(var(--sidebar-foreground))] hover:bg-white/5 hover:text-white'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  isActive ? 'bg-[hsl(var(--primary))]' : 'bg-transparent'
                )}
              />
              {label}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-5 py-3">
        <p className="text-[11px] text-white/30 leading-4">
          React 18 · Vite 5 · Tailwind 3
        </p>
        <p className="text-[11px] text-white/30">
          shadcn/ui · Recharts · Supabase
        </p>
      </div>
    </aside>
  )
}
