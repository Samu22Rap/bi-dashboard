import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, RadialBarChart, RadialBar,
  Legend, BarChart,
} from 'recharts'
import { useExecutivo } from '@/hooks/useExecutivo'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { KpiCard, type KpiVariant } from '@/components/shared/KpiCard'
import { KpiGrid } from '@/components/shared/KpiGrid'
import { ChartCard } from '@/components/shared/ChartCard'
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar'
import { useFilters } from '@/hooks/useFilters'
import { brl, pct, integer } from '@/lib/formatters'
import { CHART_COLORS, SEMANTIC_COLORS } from '@/lib/colors'

const MES_OPTIONS = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Marco' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
]

const META_CONVERSAO = 3.06

export default function Executivo() {
  const { data, loading, error } = useExecutivo()
  const [filters, setFilter, resetFilters] = useFilters({ mes: 'all' })
  const mes = filters.mes

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const kpiMap = Object.fromEntries(data!.kpis.map((k) => [k.indicador, k]))
  const receita      = kpiMap['receita_total']
  const conversao    = kpiMap['taxa_conversao']
  const cac          = kpiMap['cac']
  const ticketMedio  = kpiMap['ticket_medio']
  const pedidos      = kpiMap['pedidos']
  const sessoes      = kpiMap['sessoes']
  const roi          = kpiMap['roi_marketing']
  const investimento = kpiMap['investimento_marketing']

  const receitaFiltrada = mes === 'all'
    ? data!.receita_mensal
    : data!.receita_mensal.filter((r) => String(r.mes_num) === mes)

  // Gauge de conversão
  const gaugeData = [{ name: 'Conversao', value: conversao?.valor ?? 0, fill: SEMANTIC_COLORS.error }]
  const gaugeMeta = [{ name: 'Meta', value: META_CONVERSAO, fill: SEMANTIC_COLORS.meta }]

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <FilterBar onReset={resetFilters}>
        <FilterSelect label="Mes" value={mes} options={MES_OPTIONS} onChange={(v) => setFilter('mes', v)} />
      </FilterBar>

      {/* KPIs */}
      <KpiGrid cols={4}>
        <KpiCard label="Receita Total"        value={receita      ? brl(receita.valor)               : '—'} sublabel="Jan–Jun 2025" variant="neutral" />
        <KpiCard label="Pedidos Validos"      value={pedidos      ? integer(pedidos.valor)            : '—'} variant="neutral" />
        <KpiCard label="Sessoes no Site"      value={sessoes      ? integer(sessoes.valor)            : '—'} variant="neutral" />
        <KpiCard label="Invest. Marketing"    value={investimento ? brl(investimento.valor)           : '—'} variant="neutral" />
        <KpiCard label="Taxa de Conversao"    value={conversao    ? pct(conversao.valor)              : '—'}
          sublabel={`Meta: ${pct(META_CONVERSAO)}`}
          delta={conversao ? `${(conversao.valor - META_CONVERSAO).toFixed(2).replace('.', ',')} p.p. vs meta` : undefined}
          variant={(conversao?.status ?? 'neutral') as KpiVariant} />
        <KpiCard label="CAC"                  value={cac          ? brl(cac.valor)                   : '—'}
          sublabel={`Meta: ${cac?.meta ? brl(cac.meta) : 'R$ 113,46'}`}
          delta={cac?.meta ? `+${brl(cac.valor - cac.meta)} acima da meta` : undefined}
          variant={(cac?.status ?? 'neutral') as KpiVariant} />
        <KpiCard label="Ticket Medio"         value={ticketMedio  ? brl(ticketMedio.valor)            : '—'} variant="ok" />
        <KpiCard label="ROI de Marketing"     value={roi          ? `${roi.valor.toFixed(2).replace('.', ',')}x` : '—'} variant="ok" />
      </KpiGrid>

      {/* Gráficos — linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Receita + Conversão — ocupa 2/3 */}
        <ChartCard
          title="Receita Mensal e Taxa de Conversao"
          description="Barras = receita (R$) · Linha = conversao (%) · Tracejado = meta 3,06%"
          height={280}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={receitaFiltrada} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} width={56} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} width={36} domain={[0, 5]} />
              <Tooltip
                formatter={(value, name) =>
                  name === 'Receita' ? brl(Number(value)) : pct(Number(value))
                }
              />
              <ReferenceLine yAxisId="right" y={META_CONVERSAO} stroke={SEMANTIC_COLORS.meta} strokeDasharray="4 4" label={{ value: 'Meta', position: 'right', fontSize: 10, fill: SEMANTIC_COLORS.meta }} />
              <Bar yAxisId="left" dataKey="receita" name="Receita" fill={CHART_COLORS.blue} radius={[3, 3, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="taxa_conversao" name="Conversao" stroke={SEMANTIC_COLORS.ok} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gauge de conversão — ocupa 1/3 */}
        <ChartCard title="Conversao Atual vs Meta" description={`Atual: ${pct(conversao?.valor ?? 0)} · Meta: ${pct(META_CONVERSAO)}`} height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="55%"
              innerRadius="50%" outerRadius="85%"
              data={[...gaugeMeta, ...gaugeData]}
              startAngle={180} endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={4} />
              <Legend
                iconSize={10}
                formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>}
              />
              <Tooltip formatter={(v) => pct(Number(v))} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Gráficos — linha 2 */}
      <ChartCard title="Pedidos por Mes" description="Volume de pedidos validos" height={220}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={receitaFiltrada} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip formatter={(v) => integer(Number(v))} />
            <Bar dataKey="pedidos" name="Pedidos" fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
