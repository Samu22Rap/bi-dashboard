import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { FunilDispositivo, ConversaoPorCanal, MotivoAtendimento } from '@/types/database'

interface DiagnosticoData {
  funil_dispositivo: FunilDispositivo[]
  conversao_por_canal: ConversaoPorCanal[]
  motivos_atendimento: MotivoAtendimento[]
}

interface UseDiagnosticoResult {
  data: DiagnosticoData | null
  loading: boolean
  error: string | null
}

export function useDiagnostico(): UseDiagnosticoResult {
  const [data, setData] = useState<DiagnosticoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      const [funilRes, conversaoRes, motivosRes] = await Promise.all([
        supabase.from('funil_dispositivo').select('*').order('sessoes', { ascending: false }),
        supabase.from('conversao_por_canal').select('*').order('taxa_conversao', { ascending: false }),
        supabase.from('motivos_atendimento').select('*').order('quantidade', { ascending: false }),
      ])

      if (funilRes.error) { setError(funilRes.error.message); setLoading(false); return }
      if (conversaoRes.error) { setError(conversaoRes.error.message); setLoading(false); return }
      if (motivosRes.error) { setError(motivosRes.error.message); setLoading(false); return }

      setData({
        funil_dispositivo: funilRes.data as FunilDispositivo[],
        conversao_por_canal: conversaoRes.data as ConversaoPorCanal[],
        motivos_atendimento: motivosRes.data as MotivoAtendimento[],
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
