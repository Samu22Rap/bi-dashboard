import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ClientesPorCanal, ClientesPorUf, RendaFaixa } from '@/types/database'

interface ClientesData {
  clientes_por_canal: ClientesPorCanal[]
  clientes_por_uf: ClientesPorUf[]
  renda_faixa: RendaFaixa[]
}

interface UseClientesResult {
  data: ClientesData | null
  loading: boolean
  error: string | null
}

export function useClientes(): UseClientesResult {
  const [data, setData] = useState<ClientesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      const [canalRes, ufRes, rendaRes] = await Promise.all([
        supabase.from('clientes_por_canal').select('*').order('total_clientes', { ascending: false }),
        supabase.from('clientes_por_uf').select('*').order('total_clientes', { ascending: false }),
        supabase.from('renda_faixa').select('*').order('total_clientes', { ascending: false }),
      ])

      if (canalRes.error) { setError(canalRes.error.message); setLoading(false); return }
      if (ufRes.error) { setError(ufRes.error.message); setLoading(false); return }
      if (rendaRes.error) { setError(rendaRes.error.message); setLoading(false); return }

      setData({
        clientes_por_canal: canalRes.data as ClientesPorCanal[],
        clientes_por_uf: ufRes.data as ClientesPorUf[],
        renda_faixa: rendaRes.data as RendaFaixa[],
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
