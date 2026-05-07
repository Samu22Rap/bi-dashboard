import { useProdutos } from '@/hooks/useProdutos'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'

export default function Produtos() {
  const { data, loading, error } = useProdutos()

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-gray-200 bg-white">
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500">Produtos</p>
        <p className="text-xs text-gray-400 mt-1">
          {data?.receita_por_categoria.length} categorias carregadas
        </p>
        <p className="text-xs text-green-500 mt-1">Supabase conectado</p>
      </div>
    </div>
  )
}
