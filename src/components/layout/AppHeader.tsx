import { useLocation } from 'react-router-dom'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Visao Executiva',
  '/marketing': 'Marketing',
  '/produtos': 'Produtos',
  '/clientes': 'Clientes',
  '/diagnostico': 'Diagnostico',
}

export function AppHeader() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'BI Omnichannel'

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-sm font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
          Dados Sinteticos
        </span>
        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] font-medium text-green-700">
          Jan-Jun 2025
        </span>
      </div>
    </header>
  )
}
