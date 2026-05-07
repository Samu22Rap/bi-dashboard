import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, FunnelChart, Funnel, LabelList,
} from 'recharts'
import { useDiagnostico } from '@/hooks/useDiagnostico'
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

const MOTIVO_COLS = [
  { key: 'motivo',              header: 'Motivo' },
  { key: 'quantidade',          header: 'Qtd',          align: 'right' as const, cell: (r: MotivoAtendimento) => integer(r.quantidade) },
  { key: 'percentual',          header: '%',             align: 'right' as const, cell: (r: MotivoAtendimento) => pct(r.percentual) },
  { key: 'resolucao_media_dias',header: 'Resolucao Avg', align: 'right' as const, cell: (r: MotivoAtendimento) => days(r.resolucao_media_dias) },
]

export default function Diagnostico() {
  const { data, loading, error } = useDiagnostico()
  const [dispositivo, setDispositivo] = useState('all')

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const funil    = data!.funil_dispositivo
  const canais   = data!.conversao_por_canal
  const motivos  = data!.motivos_atendimento

  // Funil agregado (todos os dispositivos)
  const funilAgregado = funil.reduce(
    (acc, d) => ({
      Sessoes:      acc.Sessoes + d.sessoes,
      'Add to Cart': acc['Add to Cart'] + d.add_to_cart,
      Checkout:     acc.Checkout + d.checkout,
      Pedidos:      acc.Pedidos + d.pedidos,
    }),
    { Sessoes: 0, 'Add to Cart': 0, Checkout: 0, Pedidos: 0 }
  )
  const funilData = Object.entries(funilAgregado).map(([name, value], i) => ({
    name, value, fill: CHART_PALETTE[i % CHART_PALETTE.length],
  }))

  // KPIs
  const mobile  = funil.find((d) => d.dispositivo === 'Mobile')
  const desktop = funil.find((d) => d.dispositivo === 'Desktop')
  const convMobile  = mobile  ? (mobile.pedidos  / mobile.sessoes)  * 100 : 0
  const convDesktop = desktop ? (desktop.pedidos / desktop.sessoes) * 100 : 0
  const totalTickets = motivos.reduce((s, m) => s + m.quantidade, 0)
  const principalMotivo = motivos[0]?.motivo ?? '—'

  // Funil filtrado por dispositivo
  const funilFiltrado = dispositivo === 'all' ? funil : funil.filter((d) => d.dispositivo === dispositivo)
  const funilPorDisp = funilFiltrado.flatMap((d) => [
    { etapa: 'Sessoes',      dispositivo: d.dispositivo, valor: d.sessoes },
    { etapa: 'Add to Cart',  dispositivo: d.dispositivo, valor: d.add_to_cart },
    { etapa: 'Checkout',     dispositivo: d.dispositivo, valor: d.checkout },
    { etapa: 'Pedidos',      dispositivo: d.dispositivo, valor: d.pedidos },
  ])

  return (
    <div className="space-y-6">
      <FilterBar onReset={() => setDispositivo('all')}>
        <FilterSelect label="Dispositivo" value={dispositivo} options={DISPOSITIVO_OPTIONS} onChange={setDispositivo} />
      </FilterBar>

      {/* KPIs */}
      <KpiGrid cols={4}>
        <KpiCard label="Conversao Mobile"   value={pct(convMobile)}    variant={convMobile  >= MEDIA_CONVERSAO ? 'ok' : 'error'} sublabel={`Media: ${pct(MEDIA_CONVERSAO)}`} />
        <KpiCard label="Conversao Desktop"  value={pct(convDesktop)}   variant={convDesktop >= MEDIA_CONVERSAO ? 'ok' : 'error'} sublabel={`Media: ${pct(MEDIA_CONVERSAO)}`} />
        <KpiCard label="Tickets de Suporte" value={integer(totalTickets)} variant="neutral" />
        <KpiCard label="Principal Motivo"   value={principalMotivo}    variant="error" sublabel={`${pct(motivos[0]?.percentual ?? 0)} dos tickets`} />
      </KpiGrid>

      {/* Linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funil completo */}
        <ChartCard title="Funil de Conversao" description="Sessoes → Add to Cart → Checkout → Pedidos" height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Funnel dataKey="value" data={funilData} isAnimationActive>
                <LabelList position="center" fill="#fff" fontSize={12} fontWeight={600}
                  formatter={(v: unknown) => integer(Number(v))} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Conversão por dispositivo */}
        <ChartCard title="Conversao por Dispositivo" description={`Media geral: ${pct(MEDIA_CONVERSAO)}`} height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={funil.map((d) => ({ ...d, taxa: (d.pedidos / d.sessoes) * 100 }))}
              margin={{ top: 4, right: 32, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dispositivo" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 5]} />
              <Tooltip formatter={(v) => pct(Number(v))} />
              <ReferenceLine y={MEDIA_CONVERSAO} stroke={SEMANTIC_COLORS.meta} strokeDasharray="4 4" label={{ value: 'Media', position: 'right', fontSize: 10, fill: SEMANTIC_COLORS.meta }} />
              <Bar dataKey="taxa" name="Conversao" radius={[3, 3, 0, 0]}>
                {funil.map((entry) => {
                  const taxa = (entry.pedidos / entry.sessoes) * 100
                  return <Cell key={entry.dispositivo} fill={taxa >= MEDIA_CONVERSAO ? SEMANTIC_COLORS.ok : SEMANTIC_COLORS.error} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Linha 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Conversão por canal */}
        <ChartCard title="Conversao por Canal de Origem" description={`Verde >= ${pct(MEDIA_CONVERSAO)} · Vermelho abaixo`} height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={canais} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 6]} />
              <YAxis type="category" dataKey="canal" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => pct(Number(v))} />
              <ReferenceLine x={MEDIA_CONVERSAO} stroke={SEMANTIC_COLORS.meta} strokeDasharray="4 4" />
              <Bar dataKey="taxa_conversao" name="Conversao" radius={[0, 3, 3, 0]}>
                {canais.map((entry) => (
                  <Cell key={entry.canal} fill={entry.taxa_conversao >= MEDIA_CONVERSAO ? SEMANTIC_COLORS.ok : SEMANTIC_COLORS.error} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Motivos de atendimento */}
        <ChartCard title="Motivos de Atendimento" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={motivos} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="motivo" tick={{ fontSize: 10 }} width={130} />
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Bar dataKey="quantidade" name="Tickets" fill={CHART_COLORS.amber} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Funil agrupado por dispositivo */}
      {dispositivo !== 'all' && (
        <ChartCard title={`Funil por Dispositivo — ${dispositivo}`} height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funilPorDisp} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="etapa" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => integer(v)} />
              <Tooltip formatter={(v) => integer(Number(v))} />
              <Bar dataKey="valor" name="Volume" fill={CHART_COLORS.blue} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Tabela de atendimento */}
      <ChartCard title="Detalhe de Atendimento" description={`${motivos.length} motivos · ${integer(totalTickets)} tickets total`}>
        <DataTable columns={MOTIVO_COLS} data={motivos} />
      </ChartCard>
    </div>
  )
}
