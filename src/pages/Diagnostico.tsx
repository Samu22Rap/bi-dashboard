import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, FunnelChart, Funnel, LabelList,
} from 'recharts'
import { useDiagnostico } from '@/hooks/useDiagnostico'
import { useFilters } from '@/hooks/useFilters'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { KpiCard } from '@/components/shared/KpiCard'
import { KpiGrid } from '@/components/shared/KpiGrid'
import { ChartCard } from '@/components/shared/ChartCard'
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar'
import { DataTable } from '@/components/shared/DataTable'
import { pct, integer, days } from '@/lib/formatters'
import { CHART_COLORS, SEMANTIC_COLORS, CHART_PALETTE } from '@/lib/colors'
import type { MotivoAtendimento } from '@/types/database'

const MEDIA_CONVERSAO = 2.66

const DISPOSITIVO_OPTIONS = [
  { value: 'Mobile',  label: 'Mobile' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Tablet',  label: 'Tablet' },
]

const CANAL_OPTIONS = [
  { value: 'E-mail',         label: 'E-mail' },
  { value: 'Meta Ads',       label: 'Meta Ads' },
  { value: 'Google Ads',     label: 'Google Ads' },
  { value: 'Busca Orgânica', label: 'Busca Orgânica' },
  { value: 'Direto',         label: 'Direto' },
  { value: 'TikTok Ads',     label: 'TikTok Ads' },
]

const MOTIVO_COLS = [
  { key: 'motivo',               header: 'Motivo' },
  { key: 'quantidade',           header: 'Qtd',           align: 'right' as const, cell: (r: MotivoAtendimento) => integer(r.quantidade) },
  { key: 'percentual',           header: '%',              align: 'right' as const, cell: (r: MotivoAtendimento) => pct(r.percentual) },
  { key: 'resolucao_media_dias', header: 'Resolução Avg',  align: 'right' as const, cell: (r: MotivoAtendimento) => days(r.resolucao_media_dias) },
]

export default function Diagnostico() {
  const { data, loading, error } = useDiagnostico()
  const [filters, setFilter, resetFilters] = useFilters({ dispositivo: 'all', canal: 'all' })

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const funil   = data!.funil_dispositivo
  const motivos = data!.motivos_atendimento

  // Filtros aplicados
  const funilFiltrado  = filters.dispositivo === 'all' ? funil : funil.filter((d) => d.dispositivo === filters.dispositivo)
  const canaisFiltrados = data!.conversao_por_canal.filter((c) =>
    filters.canal === 'all' || c.canal === filters.canal
  )

  // Funil agregado (todos dispositivos visíveis)
  const funilAgregado = funilFiltrado.reduce(
    (acc, d) => ({
      'Sessões':     acc['Sessões']     + (d.sessoes      || 0),
      'Add to Cart': acc['Add to Cart'] + (d.add_to_cart  || 0),
      'Checkout':    acc['Checkout']    + (d.checkout     || 0),
      'Pedidos':     acc['Pedidos']     + (d.pedidos      || 0),
    }),
    { 'Sessões': 0, 'Add to Cart': 0, 'Checkout': 0, 'Pedidos': 0 }
  )
  const funilData = Object.entries(funilAgregado).map(([name, value], i) => ({
    name, value: value || 0, fill: CHART_PALETTE[i % CHART_PALETTE.length],
  }))

  // KPIs — respeitam o filtro de dispositivo
  const disp = filters.dispositivo
  const mobileData  = disp === 'all' || disp === 'Mobile'
    ? (disp === 'Mobile' ? funilFiltrado[0] : funil.find((d) => d.dispositivo === 'Mobile'))
    : null
  const desktopData = disp === 'all' || disp === 'Desktop'
    ? (disp === 'Desktop' ? funilFiltrado[0] : funil.find((d) => d.dispositivo === 'Desktop'))
    : null

  const convMobile  = mobileData  ? (mobileData.pedidos  / mobileData.sessoes)  * 100 : null
  const convDesktop = desktopData ? (desktopData.pedidos / desktopData.sessoes) * 100 : null

  const totalTickets    = motivos.reduce((s, m) => s + m.quantidade, 0)
  const principalMotivo = motivos[0]?.motivo ?? '—'

  const hasActive = disp !== 'all' || filters.canal !== 'all'

  return (
    <div className="space-y-6">
      <FilterBar onReset={resetFilters} hasActiveFilters={hasActive}>
        <FilterSelect label="Dispositivo" value={disp}          options={DISPOSITIVO_OPTIONS} onChange={(v) => setFilter('dispositivo', v)} />
        <FilterSelect label="Canal"       value={filters.canal} options={CANAL_OPTIONS}       onChange={(v) => setFilter('canal', v)} />
      </FilterBar>

      {/* KPIs */}
      <KpiGrid cols={4}>
        <KpiCard
          label="Conversão Mobile"
          value={convMobile !== null ? pct(convMobile) : '—'}
          variant={convMobile !== null ? (convMobile >= MEDIA_CONVERSAO ? 'ok' : 'alert') : 'neutral'}
          sublabel={`Média: ${pct(MEDIA_CONVERSAO)}`}
        />
        <KpiCard
          label="Conversão Desktop"
          value={convDesktop !== null ? pct(convDesktop) : '—'}
          variant={convDesktop !== null ? (convDesktop >= MEDIA_CONVERSAO ? 'ok' : 'alert') : 'neutral'}
          sublabel={`Média: ${pct(MEDIA_CONVERSAO)}`}
        />
        <KpiCard label="Tickets de Suporte" value={integer(totalTickets)} variant="neutral" />
        <KpiCard
          label="Principal Motivo"
          value={principalMotivo}
          variant="alert"
          sublabel={hasActive
            ? 'Dado global — suporte não tem breakdown por dispositivo/canal'
            : `${pct(motivos[0]?.percentual ?? 0)} dos tickets`}
        />
      </KpiGrid>

      {/* Linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Funil de Conversão" description={filters.dispositivo === 'all' ? 'Todos os dispositivos' : filters.dispositivo} height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Funnel dataKey="value" data={funilData} isAnimationActive>
                <LabelList
                  dataKey="value"
                  position="center"
                  fill="#1f2937"
                  fontSize={12}
                  fontWeight={700}
                  formatter={(v: unknown) => {
                    const n = Number(v)
                    return isNaN(n) || n === 0 ? '' : integer(n)
                  }}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Conversão por Dispositivo" description={`Média geral: ${pct(MEDIA_CONVERSAO)}`} height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funil.map((d) => ({ ...d, taxa: (d.pedidos / d.sessoes) * 100 }))}
              margin={{ top: 4, right: 32, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dispositivo" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 5]} />
              <Tooltip formatter={(v) => pct(Number(v))} />
              <ReferenceLine y={MEDIA_CONVERSAO} stroke={SEMANTIC_COLORS.meta} strokeDasharray="4 4"
                label={{ value: 'Media', position: 'right', fontSize: 10, fill: SEMANTIC_COLORS.meta }} />
              <Bar dataKey="taxa" name="Conversão" radius={[3, 3, 0, 0]}>
                {funil.map((entry) => {
                  const isSelected = filters.dispositivo === 'all' || entry.dispositivo === filters.dispositivo
                  const taxa = (entry.pedidos / entry.sessoes) * 100
                  return (
                    <Cell
                      key={entry.dispositivo}
                      fill={isSelected
                        ? (taxa >= MEDIA_CONVERSAO ? SEMANTIC_COLORS.ok : SEMANTIC_COLORS.error)
                        : '#e5e7eb'}
                    />
                  )
                })}
                <LabelList dataKey="taxa" position="top" style={{ fontSize: 10, fill: '#374151' }}
                  formatter={(v: unknown) => pct(Number(v), 2)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Linha 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Conversão por Canal de Origem" description={`Verde >= ${pct(MEDIA_CONVERSAO)} · Vermelho abaixo`} height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={canaisFiltrados} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 6]} />
              <YAxis type="category" dataKey="canal" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => pct(Number(v))} />
              <ReferenceLine x={MEDIA_CONVERSAO} stroke={SEMANTIC_COLORS.meta} strokeDasharray="4 4" />
              <Bar dataKey="taxa_conversao" name="Conversão" radius={[0, 3, 3, 0]}>
                {canaisFiltrados.map((entry) => (
                  <Cell key={entry.canal} fill={entry.taxa_conversao >= MEDIA_CONVERSAO ? SEMANTIC_COLORS.ok : SEMANTIC_COLORS.error} />
                ))}
                <LabelList dataKey="taxa_conversao" position="right" style={{ fontSize: 10, fill: '#374151' }}
                  formatter={(v: unknown) => pct(Number(v), 2)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Motivos de Atendimento" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={motivos} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="motivo" tick={{ fontSize: 10 }} width={130} />
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Bar dataKey="quantidade" name="Tickets" fill={CHART_COLORS.amber} radius={[0, 3, 3, 0]}>
                <LabelList dataKey="quantidade" position="right" style={{ fontSize: 10, fill: '#374151' }}
                  formatter={(v: unknown) => integer(Number(v))} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabela de atendimento */}
      <ChartCard title="Detalhe de Atendimento" description={`${motivos.length} motivos · ${integer(totalTickets)} tickets total`}>
        <DataTable columns={MOTIVO_COLS} data={motivos} />
      </ChartCard>
    </div>
  )
}
