import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { CacPorCanal, RoiPorCampanha, ReceitaMensal } from '@/types/database'

interface MarketingData {
  cac_por_canal: CacPorCanal[]
  roi_por_campanha: RoiPorCampanha[]
  receita_mensal: ReceitaMensal[]
}

interface UseMarketingResult {
  data: MarketingData | null
  loading: boolean
  error: string | null
}

export function useMarketing(): UseMarketingResult {
  const [data, setData] = useState<MarketingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      const [cacRes, roiRes, receitaRes] = await Promise.all([
        supabase.from('cac_por_canal').select('*').order('cac'),
        supabase.from('roi_por_campanha').select('*').order('roi', { ascending: false }),
        supabase.from('receita_mensal').select('*').order('mes_num'),
      ])

      if (cacRes.error) { setError(cacRes.error.message); setLoading(false); return }
      if (roiRes.error) { setError(roiRes.error.message); setLoading(false); return }
      if (receitaRes.error) { setError(receitaRes.error.message); setLoading(false); return }

      setData({
        cac_por_canal: cacRes.data as CacPorCanal[],
        roi_por_campanha: roiRes.data as RoiPorCampanha[],
        receita_mensal: receitaRes.data as ReceitaMensal[],
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
