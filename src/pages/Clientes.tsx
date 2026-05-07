import { useClientes } from '@/hooks/useClientes'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'

export default function Clientes() {
  const { data, loading, error } = useClientes()

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-gray-200 bg-white">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">Clientes</p>
        <p className="text-xs text-gray-400 mt-1">
          {data?.clientes_por_canal.length} canais · {data?.clientes_por_uf.length} UFs · {data?.renda_faixa.length} faixas
        </p>
        <p className="text-xs text-green-500 mt-1">Supabase conectado</p>
      </div>
    </div>
  )
}
