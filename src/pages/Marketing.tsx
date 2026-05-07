import { useMarketing } from '@/hooks/useMarketing'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'

export default function Marketing() {
  const { data, loading, error } = useMarketing()

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-gray-200 bg-white">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">Marketing</p>
        <p className="text-xs text-gray-400 mt-1">
          {data?.cac_por_canal.length} canais · {data?.roi_por_campanha.length} campanhas carregadas
        </p>
        <p className="text-xs text-green-500 mt-1">Supabase conectado</p>
      </div>
    </div>
  )
}
