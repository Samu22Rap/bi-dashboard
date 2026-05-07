import { useExecutivo } from '@/hooks/useExecutivo'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'

export default function Executivo() {
  const { data, loading, error } = useExecutivo()

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-gray-200 bg-white">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">Visao Executiva</p>
        <p className="text-xs text-gray-400 mt-1">
          {data?.kpis.length} KPIs · {data?.receita_mensal.length} meses carregados
        </p>
        <p className="text-xs text-green-500 mt-1">Supabase conectado</p>
      </div>
    </div>
  )
}
