import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ReceitaPorCategoria } from '@/types/database'

interface ProdutosData {
  receita_por_categoria: ReceitaPorCategoria[]
}

interface UseProdutosResult {
  data: ProdutosData | null
  loading: boolean
  error: string | null
}

export function useProdutos(): UseProdutosResult {
  const [data, setData] = useState<ProdutosData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      const { data: rows, error: err } = await supabase
        .from('receita_por_categoria')
        .select('*')
        .order('receita', { ascending: false })

      if (err) { setError(err.message); setLoading(false); return }

      setData({ receita_por_categoria: rows as ReceitaPorCategoria[] })
      setLoading(false)
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
