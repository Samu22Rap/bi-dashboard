import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart, Line, Cell,
} from 'recharts'
import { useMarketing } from '@/hooks/useMarketing'
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
  { value: 'Meta Ads',    label: 'Meta Ads' },
  { value: 'Google Ads',  label: 'Google Ads' },
  { value: 'E-mail',      label: 'E-mail' },
  { value: 'TikTok Ads',  label: 'TikTok Ads' },
  { value: 'Influencer',  label: 'Influencer' },
]

const CAMPANHA_COLS = [
  { key: 'campanha',        header: 'Campanha' },
  { key: 'plataforma',      header: 'Plataforma' },
  { key: 'investimento',    header: 'Investimento', align: 'right' as const, cell: (r: RoiPorCampanha) => brl(r.investimento) },
  { key: 'receita_atribuida', header: 'Receita',    align: 'right' as const, cell: (r: RoiPorCampanha) => brl(r.receita_atribuida) },
  { key: 'roi',             header: 'ROI',           align: 'right' as const, cell: (r: RoiPorCampanha) => roiFmt(r.roi) },
  { key: 'cac',             header: 'CAC',           align: 'right' as const, cell: (r: RoiPorCampanha) => brl(r.cac) },
  { key: 'novos_clientes',  header: 'Novos Cli.',    align: 'right' as const, cell: (r: RoiPorCampanha) => integer(r.novos_clientes) },
]

export default function Marketing() {
  const { data, loading, error } = useMarketing()
  const [plataforma, setPlataforma] = useState('all')

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  // Filtro de plataforma nas campanhas
  const campanhasFiltradas = plataforma === 'all'
    ? data!.roi_por_campanha
    : data!.roi_por_campanha.filter((c) => c.plataforma === plataforma)

  // KPIs agregados
  const totalInvest = data!.cac_por_canal.reduce((s, c) => s + c.investimento, 0)
  const totalClientes = data!.cac_por_canal.reduce((s, c) => s + c.novos_clientes, 0)
  const cacMedio = totalInvest / totalClientes
  const roiMedio = data!.cac_por_canal.reduce((s, c) => s + c.roi, 0) / data!.cac_por_canal.length

  return (
    <div className="space-y-6">
      <FilterBar onReset={() => setPlataforma('all')}>
        <FilterSelect label="Plataforma" value={plataforma} options={PLATAFORMA_OPTIONS} onChange={setPlataforma} />
      </FilterBar>

      {/* KPIs */}
      <KpiGrid cols={4}>
        <KpiCard label="Investimento Total"  value={brl(totalInvest)}         variant="neutral" />
        <KpiCard label="ROI Consolidado"     value={roiFmt(roiMedio)}         variant="ok" sublabel="Media dos canais" />
        <KpiCard label="CAC Medio"           value={brl(cacMedio)}
          sublabel={`Meta: ${brl(META_CAC)}`}
          delta={`+${brl(cacMedio - META_CAC)} acima da meta`}
          variant="error" />
        <KpiCard label="Novos Clientes"      value={integer(totalClientes)}   variant="neutral" />
      </KpiGrid>

      {/* Gráficos linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CAC por canal — horizontal */}
        <ChartCard title="CAC por Canal" description={`Meta: ${brl(META_CAC)} — verde = abaixo, vermelho = acima`} height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data!.cac_por_canal} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `R$${v}`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="canal" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => brl(Number(v))} />
              <ReferenceLine x={META_CAC} stroke={SEMANTIC_COLORS.meta} strokeDasharray="4 4" label={{ value: 'Meta', position: 'top', fontSize: 10, fill: SEMANTIC_COLORS.meta }} />
              <Bar dataKey="cac" name="CAC" radius={[0, 3, 3, 0]}>
                {data!.cac_por_canal.map((entry) => (
                  <Cell key={entry.canal} fill={entry.cac <= META_CAC ? SEMANTIC_COLORS.ok : SEMANTIC_COLORS.error} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ROI por campanha — horizontal */}
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

      {/* Gráfico linha 2 — investimento vs novos clientes */}
      <ChartCard title="Investimento vs Novos Clientes por Mes" description="Barras = investimento (R$) · Linha = novos clientes" height={240}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data!.receita_mensal} margin={{ top: 4, right: 32, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} width={52} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={36} />
            <Tooltip formatter={(value, name) => name === 'Invest.' ? brl(Number(value)) : integer(Number(value))} />
            <Bar yAxisId="left" dataKey="investimento_marketing" name="Invest." fill={CHART_COLORS.amber} radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="novos_clientes" name="Novos Cli." stroke={CHART_COLORS.blue} strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Tabela de campanhas */}
      <ChartCard title="Detalhe de Campanhas" description={`${campanhasFiltradas.length} campanha(s)`}>
        <DataTable columns={CAMPANHA_COLS} data={campanhasFiltradas} />
      </ChartCard>
    </div>
  )
}
