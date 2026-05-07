import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

function App() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [receita, setReceita] = useState<string>('')

  useEffect(() => {
    supabase
      .from('kpis_resumo')
      .select('indicador, valor')
      .eq('indicador', 'receita_total')
      .single()
      .then(({ data, error }) => {
        if (error) { setStatus('error'); return }
        setReceita(
          Number(data.valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
        )
        setStatus('ok')
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 max-w-sm w-full text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">BI Omnichannel</h1>
        <p className="text-sm text-gray-500">Épico 0 — Fundação</p>

        <div className="pt-2">
          {status === 'loading' && (
            <p className="text-sm text-gray-400 animate-pulse">Conectando ao Supabase...</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-500 font-medium">Erro ao conectar ao Supabase</p>
          )}
          {status === 'ok' && (
            <div className="space-y-1">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
                ✓ Supabase conectado
              </p>
              <p className="text-3xl font-bold text-gray-900">{receita}</p>
              <p className="text-xs text-gray-400">Receita Total — Jan–Jun 2025</p>
            </div>
          )}
        </div>

        <div className="pt-4 text-xs text-gray-300 space-y-0.5">
          <p>React 18 · Vite 5 · Tailwind 3 · shadcn/ui</p>
          <p>Recharts · Supabase JS · TypeScript</p>
        </div>
      </div>
    </div>
  )
}

export default App
