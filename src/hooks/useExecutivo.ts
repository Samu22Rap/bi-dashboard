import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { KpiResumo, ReceitaMensal } from '@/types/database'

interface ExecutivoData {
  kpis: KpiResumo[]
  receita_mensal: ReceitaMensal[]
}

interface UseExecutivoResult {
  data: ExecutivoData | null
  loading: boolean
  error: string | null
}

export function useExecutivo(): UseExecutivoResult {
  const [data, setData] = useState<ExecutivoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      const [kpisRes, receitaRes] = await Promise.all([
        supabase.from('kpis_resumo').select('*').order('indicador'),
        supabase.from('receita_mensal').select('*').order('mes_num'),
      ])

      if (kpisRes.error) { setError(kpisRes.error.message); setLoading(false); return }
      if (receitaRes.error) { setError(receitaRes.error.message); setLoading(false); return }

      setData({
        kpis: kpisRes.data as KpiResumo[],
        receita_mensal: receitaRes.data as ReceitaMensal[],
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
