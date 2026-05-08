import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, LabelList,
} from 'recharts'
import { useClientes } from '@/hooks/useClientes'
import { useFilters } from '@/hooks/useFilters'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { KpiCard } from '@/components/shared/KpiCard'
import { KpiGrid } from '@/components/shared/KpiGrid'
import { ChartCard } from '@/components/shared/ChartCard'
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar'
import { brl, integer, pct } from '@/lib/formatters'
import { CHART_COLORS, CHART_PALETTE, SEMANTIC_COLORS } from '@/lib/colors'

const META_SCORE = 60

const CANAL_OPTIONS = [
  { value: 'Meta Ads',       label: 'Meta Ads' },
  { value: 'Google Ads',     label: 'Google Ads' },
  { value: 'E-mail',         label: 'E-mail' },
  { value: 'Busca Organica', label: 'Busca Organica' },
  { value: 'Direto',         label: 'Direto' },
  { value: 'TikTok Ads',     label: 'TikTok Ads' },
]

const RENDA_OPTIONS = [
  { value: 'Ate R$ 2 mil',       label: 'Ate R$ 2 mil' },
  { value: 'R$ 2 a 5 mil',       label: 'R$ 2 a 5 mil' },
  { value: 'R$ 5 a 10 mil',      label: 'R$ 5 a 10 mil' },
  { value: 'Acima de R$ 10 mil', label: 'Acima R$ 10 mil' },
]

export default function Clientes() {
  const { data, loading, error } = useClientes()
  const [filters, setFilter, resetFilters] = useFilters({ canal: 'all', renda: 'all' })

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  // Filtros aplicados
  const canaisFiltrados = data!.clientes_por_canal.filter((c) =>
    filters.canal === 'all' || c.canal === filters.canal
  )
  const rendasFiltradas = data!.renda_faixa.filter((r) =>
    filters.renda === 'all' || r.faixa === filters.renda
  )
  const ufs = data!.clientes_por_uf.slice(0, 12)

  // KPIs: canal tem precedência; se só renda estiver ativa, usa rendasFiltradas
  const totalCadastrados = filters.canal !== 'all'
    ? canaisFiltrados.reduce((s, c) => s + c.total_clientes, 0)
    : filters.renda !== 'all'
    ? rendasFiltradas.reduce((s, r) => s + r.total_clientes, 0)
    : data!.clientes_por_canal.reduce((s, c) => s + c.total_clientes, 0)

  const totalCompradores = Math.round(totalCadastrados * 0.78)
  const taxaAtivacao     = totalCadastrados > 0 ? (totalCompradores / totalCadastrados) * 100 : 0
  const semEmail         = Math.round(totalCadastrados * 0.054)

  const hasActive = filters.canal !== 'all' || filters.renda !== 'all'

  return (
    <div className="space-y-6">
      <FilterBar onReset={resetFilters} hasActiveFilters={hasActive}>
        <FilterSelect label="Canal de Aquisição" value={filters.canal} options={CANAL_OPTIONS} onChange={(v) => setFilter('canal', v)} />
        <FilterSelect label="Faixa de Renda"     value={filters.renda} options={RENDA_OPTIONS} onChange={(v) => setFilter('renda', v)} />
      </FilterBar>

      {/* KPIs */}
      <KpiGrid cols={4}>
        <KpiCard label="Clientes Cadastrados" value={integer(totalCadastrados)} variant="neutral" />
        <KpiCard label="Compradores Ativos"   value={integer(totalCompradores)} variant="ok" />
        <KpiCard label="Taxa de Ativacao"     value={pct(taxaAtivacao)}         variant="ok"   sublabel="Clientes que compraram" />
        <KpiCard label="Sem E-mail"           value={integer(semEmail)}          variant="alert" sublabel="Leads nao captados" />
      </KpiGrid>

      {/* Linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Clientes por Canal de Aquisicao" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={canaisFiltrados} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="canal" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Bar dataKey="total_clientes" name="Clientes" fill={CHART_COLORS.blue} radius={[0, 3, 3, 0]}>
                <LabelList dataKey="total_clientes" position="right" style={{ fontSize: 10, fill: '#374151' }}
                  formatter={(v: unknown) => integer(Number(v))} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuicao por Faixa de Renda" height={260}>
          {rendasFiltradas.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rendasFiltradas}
                  dataKey="total_clientes"
                  nameKey="faixa"
                  cx="50%" cy="50%"
                  innerRadius="45%" outerRadius="75%"
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
          ) : rendasFiltradas.length === 1 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="text-2xl font-bold text-gray-800">{integer(rendasFiltradas[0].total_clientes)}</p>
              <p className="text-sm text-gray-500">{rendasFiltradas[0].faixa}</p>
              <p className="text-xs text-gray-400">Ticket médio: {brl(rendasFiltradas[0].ticket_medio)}</p>
              <p className="mt-1 text-[11px] text-gray-300">Selecione "Todos" para ver a distribuição</p>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Nenhum dado para a faixa selecionada
            </div>
          )}
        </ChartCard>
      </div>

      {/* Linha 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top 12 Estados" description="Volume de clientes por UF" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ufs} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="uf" tick={{ fontSize: 11 }} width={28} />
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Bar dataKey="total_clientes" name="Clientes" fill={CHART_COLORS.teal} radius={[0, 3, 3, 0]}>
                <LabelList dataKey="total_clientes" position="right" style={{ fontSize: 10, fill: '#374151' }}
                  formatter={(v: unknown) => integer(Number(v))} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Score de Fidelidade por Canal" description={`Verde >= ${META_SCORE} · Laranja < ${META_SCORE}`} height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={canaisFiltrados} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="canal" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => Number(v).toFixed(1)} />
              <Bar dataKey="score_fidelidade_medio" name="Score" radius={[0, 3, 3, 0]}>
                {canaisFiltrados.map((entry) => (
                  <Cell key={entry.canal} fill={entry.score_fidelidade_medio >= META_SCORE ? SEMANTIC_COLORS.ok : SEMANTIC_COLORS.meta} />
                ))}
                <LabelList dataKey="score_fidelidade_medio" position="right" style={{ fontSize: 10, fill: '#374151' }}
                  formatter={(v: unknown) => Number(v).toFixed(1)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
