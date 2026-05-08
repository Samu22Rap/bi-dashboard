import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart, Line, Cell,
} from 'recharts'
import { useMarketing } from '@/hooks/useMarketing'
import { useFilters } from '@/hooks/useFilters'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { KpiCard } from '@/components/shared/KpiCard'
import { KpiGrid } from '@/components/shared/KpiGrid'
import { ChartCard } from '@/components/shared/ChartCard'
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar'
import { DataTable } from '@/components/shared/DataTable'
import { brl, roi as roiFmt, integer } from '@/lib/formatters'
import { CHART_COLORS, SEMANTIC_COLORS } from '@/lib/colors'
import type { RoiPorCampanha } from '@/types/database'

const META_CAC = 113.46

const PLATAFORMA_OPTIONS = [
  { value: 'Meta Ads',   label: 'Meta Ads' },
  { value: 'Google Ads', label: 'Google Ads' },
  { value: 'E-mail',     label: 'E-mail' },
  { value: 'TikTok Ads', label: 'TikTok Ads' },
  { value: 'Influencer', label: 'Influencer' },
]

const CANAL_OPTIONS = [
  { value: 'Meta Ads',        label: 'Meta Ads' },
  { value: 'Google Ads',      label: 'Google Ads' },
  { value: 'E-mail',          label: 'E-mail' },
  { value: 'Busca Orgânica',  label: 'Busca Orgânica' },
  { value: 'Direto',          label: 'Direto' },
  { value: 'TikTok Ads',      label: 'TikTok Ads' },
]

const CAMPANHA_COLS = [
  { key: 'campanha',          header: 'Campanha' },
  { key: 'plataforma',        header: 'Plataforma' },
  { key: 'investimento',      header: 'Investimento',  align: 'right' as const, cell: (r: RoiPorCampanha) => brl(r.investimento) },
  { key: 'receita_atribuida', header: 'Receita',       align: 'right' as const, cell: (r: RoiPorCampanha) => brl(r.receita_atribuida) },
  { key: 'roi',               header: 'ROI',           align: 'right' as const, cell: (r: RoiPorCampanha) => roiFmt(r.roi) },
  { key: 'cac',               header: 'CAC',           align: 'right' as const, cell: (r: RoiPorCampanha) => brl(r.cac) },
  { key: 'novos_clientes',    header: 'Novos Cli.',    align: 'right' as const, cell: (r: RoiPorCampanha) => integer(r.novos_clientes) },
]

export default function Marketing() {
  const { data, loading, error } = useMarketing()
  const [filters, setFilter, resetFilters] = useFilters({ plataforma: 'all', canal: 'all' })

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  // Campanhas filtradas por plataforma (afeta gráfico ROI + tabela)
  const campanhasFiltradas = data!.roi_por_campanha.filter((c) =>
    filters.plataforma === 'all' || c.plataforma === filters.plataforma
  )

  // CAC por canal: filtrado por canal E por plataforma (canal == plataforma para canais pagos)
  const canaisFiltrados = data!.cac_por_canal.filter((c) => {
    const okCanal = filters.canal      === 'all' || c.canal === filters.canal
    const okPlat  = filters.plataforma === 'all' || c.canal === filters.plataforma
    return okCanal && okPlat
  })

  // KPIs unificados: investimento + clientes vêm de canaisFiltrados;
  // ROI médio vem de campanhasFiltradas (tem filtro de plataforma)
  const totalInvest   = canaisFiltrados.reduce((s, c) => s + c.investimento, 0)
  const totalClientes = canaisFiltrados.reduce((s, c) => s + c.novos_clientes, 0)
  const cacMedio      = totalClientes > 0 ? totalInvest / totalClientes : 0
  const roiMedio      = campanhasFiltradas.length > 0
    ? campanhasFiltradas.reduce((s, c) => s + c.roi, 0) / campanhasFiltradas.length
    : 0

  const hasActive = filters.plataforma !== 'all' || filters.canal !== 'all'

  return (
    <div className="space-y-6">
      <FilterBar onReset={resetFilters} hasActiveFilters={hasActive}>
        <FilterSelect label="Plataforma" value={filters.plataforma} options={PLATAFORMA_OPTIONS} onChange={(v) => setFilter('plataforma', v)} />
        <FilterSelect label="Canal"      value={filters.canal}      options={CANAL_OPTIONS}      onChange={(v) => setFilter('canal', v)} />
      </FilterBar>

      {/* KPIs */}
      <KpiGrid cols={4}>
        <KpiCard label="Investimento Total" value={brl(totalInvest)}       variant="neutral" />
        <KpiCard label="ROI Consolidado"    value={roiFmt(roiMedio)}       variant="ok"      sublabel="Média das campanhas" />
        <KpiCard label="CAC Médio"          value={brl(cacMedio)}
          sublabel={`Meta: ${brl(META_CAC)}`}
          delta={cacMedio > 0 ? `${cacMedio <= META_CAC ? '-' : '+'}${brl(Math.abs(cacMedio - META_CAC))} vs meta` : undefined}
          variant={cacMedio <= META_CAC ? 'ok' : 'alert'} />
        <KpiCard label="Novos Clientes"     value={integer(totalClientes)} variant="neutral" />
      </KpiGrid>

      {/* Gráficos linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="CAC por Canal" description={`Meta: ${brl(META_CAC)} — verde = abaixo, vermelho = acima`} height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={canaisFiltrados} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `R$${v}`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="canal" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => brl(Number(v))} />
              <ReferenceLine x={META_CAC} stroke={SEMANTIC_COLORS.meta} strokeDasharray="4 4"
                label={{ value: 'Meta', position: 'top', fontSize: 10, fill: SEMANTIC_COLORS.meta }} />
              <Bar dataKey="cac" name="CAC" radius={[0, 3, 3, 0]}>
                {canaisFiltrados.map((entry) => (
                  <Cell key={entry.canal} fill={entry.cac <= META_CAC ? SEMANTIC_COLORS.ok : SEMANTIC_COLORS.error} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="ROI por Campanha" description="Top campanhas por retorno" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campanhasFiltradas.slice(0, 8)} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}x`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="campanha" tick={{ fontSize: 10 }} width={130} />
              <Tooltip formatter={(v) => roiFmt(Number(v))} />
              <Bar dataKey="roi" name="ROI" fill={CHART_COLORS.blue} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Gráfico linha 2 */}
      <ChartCard title="Investimento vs Novos Clientes por Mês" description="Barras = investimento (R$) · Linha = novos clientes" height={240}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data!.receita_mensal} margin={{ top: 4, right: 32, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left"  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} width={52} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={36} />
            <Tooltip formatter={(value, name) => name === 'Invest.' ? brl(Number(value)) : integer(Number(value))} />
            <Bar  yAxisId="left"  dataKey="investimento_marketing" name="Invest."    fill={CHART_COLORS.amber} radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="novos_clientes" name="Novos Cli." stroke={CHART_COLORS.blue} strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tabela */}
      <ChartCard title="Detalhe de Campanhas" description={`${campanhasFiltradas.length} campanha(s)`}>
        <DataTable columns={CAMPANHA_COLS} data={campanhasFiltradas} />
      </ChartCard>
    </div>
  )
}
