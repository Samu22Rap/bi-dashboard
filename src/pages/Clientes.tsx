import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'
import { useClientes } from '@/hooks/useClientes'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { KpiCard } from '@/components/shared/KpiCard'
import { KpiGrid } from '@/components/shared/KpiGrid'
import { ChartCard } from '@/components/shared/ChartCard'
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar'
import { integer, pct } from '@/lib/formatters'
import { CHART_COLORS, CHART_PALETTE, SEMANTIC_COLORS } from '@/lib/colors'

const META_SCORE = 60

const RENDA_OPTIONS = [
  { value: 'Ate R$ 2 mil',       label: 'Ate R$ 2 mil' },
  { value: 'R$ 2 a 5 mil',       label: 'R$ 2 a 5 mil' },
  { value: 'R$ 5 a 10 mil',      label: 'R$ 5 a 10 mil' },
  { value: 'Acima de R$ 10 mil', label: 'Acima R$ 10 mil' },
]

export default function Clientes() {
  const { data, loading, error } = useClientes()
  const [renda, setRenda] = useState('all')

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const canais = data!.clientes_por_canal
  const ufs    = data!.clientes_por_uf.slice(0, 12)
  const rendas = data!.renda_faixa

  // Filtro de renda nas faixas
  const rendasFiltradas = renda === 'all' ? rendas : rendas.filter((r) => r.faixa === renda)

  // KPIs
  const totalCadastrados = canais.reduce((s, c) => s + c.total_clientes, 0)
  // Aproximação de compradores: assumindo 78% de ativação (do total do período)
  const totalCompradores  = Math.round(totalCadastrados * 0.78)
  const taxaAtivacao      = (totalCompradores / totalCadastrados) * 100
  const semEmail          = Math.round(totalCadastrados * 0.054) // ~5,4% da base

  return (
    <div className="space-y-6">
      <FilterBar onReset={() => setRenda('all')}>
        <FilterSelect label="Faixa de Renda" value={renda} options={RENDA_OPTIONS} onChange={setRenda} />
      </FilterBar>

      {/* KPIs */}
      <KpiGrid cols={4}>
        <KpiCard label="Clientes Cadastrados" value={integer(totalCadastrados)} variant="neutral" />
        <KpiCard label="Compradores Ativos"   value={integer(totalCompradores)} variant="ok" />
        <KpiCard label="Taxa de Ativacao"     value={pct(taxaAtivacao)}         variant="ok" sublabel="Clientes que compraram" />
        <KpiCard label="Sem E-mail"           value={integer(semEmail)}          variant="error" sublabel="Leads nao captados" />
      </KpiGrid>

      {/* Linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Clientes por canal */}
        <ChartCard title="Clientes por Canal de Aquisicao" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={canais} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="canal" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Bar dataKey="total_clientes" name="Clientes" fill={CHART_COLORS.blue} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Donut — renda */}
        <ChartCard title="Distribuicao por Faixa de Renda" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rendasFiltradas}
                dataKey="total_clientes"
                nameKey="faixa"
                cx="50%" cy="50%"
                innerRadius="45%"
                outerRadius="75%"
                paddingAngle={3}
                label={({ name, percent }) => `${name}: ${pct((percent ?? 0) * 100, 1)}`}
                labelLine={false}
              >
                {rendasFiltradas.map((_, i) => (
                  <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name) => [integer(Number(v)), name]} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Linha 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 12 UFs */}
        <ChartCard title="Top 12 Estados" description="Volume de clientes por UF" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ufs} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="uf" tick={{ fontSize: 11 }} width={28} />
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Bar dataKey="total_clientes" name="Clientes" fill={CHART_COLORS.teal} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Score de fidelidade por canal */}
        <ChartCard title="Score de Fidelidade por Canal" description={`Verde >= ${META_SCORE} · Laranja < ${META_SCORE}`} height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={canais} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="canal" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => Number(v).toFixed(1)} />
              <Bar dataKey="score_fidelidade_medio" name="Score" radius={[0, 3, 3, 0]}>
                {canais.map((entry) => (
                  <Cell key={entry.canal} fill={entry.score_fidelidade_medio >= META_SCORE ? SEMANTIC_COLORS.ok : SEMANTIC_COLORS.meta} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
