import { useDiagnostico } from '@/hooks/useDiagnostico'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'

export default function Diagnostico() {
  const { data, loading, error } = useDiagnostico()

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-gray-200 bg-white">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">Diagnostico</p>
        <p className="text-xs text-gray-400 mt-1">
          {data?.funil_dispositivo.length} dispositivos · {data?.conversao_por_canal.length} canais · {data?.motivos_atendimento.length} motivos
        </p>
        <p className="text-xs text-green-500 mt-1">Supabase conectado</p>
      </div>
    </div>
  )
}
