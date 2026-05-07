import { useState } from 'react'
import { useExecutivo } from '@/hooks/useExecutivo'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { KpiCard } from '@/components/shared/KpiCard'
import { KpiGrid } from '@/components/shared/KpiGrid'
import { ChartCard } from '@/components/shared/ChartCard'
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar'
import { DataTable } from '@/components/shared/DataTable'
import { brl, pct, integer } from '@/lib/formatters'
import type { ReceitaMensal } from '@/types/database'

const MES_OPTIONS = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Marco' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
]

const TABLE_COLS = [
  { key: 'mes', header: 'Mes' },
  { key: 'receita',    header: 'Receita',     cell: (r: ReceitaMensal) => brl(r.receita),           align: 'right' as const },
  { key: 'pedidos',   header: 'Pedidos',      cell: (r: ReceitaMensal) => integer(r.pedidos),       align: 'right' as const },
  { key: 'taxa_conversao', header: 'Conversao', cell: (r: ReceitaMensal) => pct(r.taxa_conversao), align: 'right' as const },
]

export default function Executivo() {
  const { data, loading, error } = useExecutivo()
  const [mes, setMes] = useState('all')

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  // KPIs úteis do objeto kpis_resumo
  const kpiMap = Object.fromEntries(data!.kpis.map((k) => [k.indicador, k]))

  const receita     = kpiMap['receita_total']
  const conversao   = kpiMap['taxa_conversao']
  const cac         = kpiMap['cac']
  const ticketMedio = kpiMap['ticket_medio']
  const pedidos     = kpiMap['pedidos_validos']
  const sessoes     = kpiMap['sessoes']
  const roi         = kpiMap['roi_marketing']
  const investimento = kpiMap['investimento_marketing']

  // Filtro de mês
  const receitaFiltrada = mes === 'all'
    ? data!.receita_mensal
    : data!.receita_mensal.filter((r) => String(r.mes_num) === mes)

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <FilterBar onReset={() => setMes('all')}>
        <FilterSelect
          label="Mes"
          value={mes}
          options={MES_OPTIONS}
          onChange={setMes}
        />
      </FilterBar>

      {/* KPIs — 4 colunas */}
      <KpiGrid cols={4}>
        <KpiCard
          label="Receita Total"
          value={receita ? brl(receita.valor) : '—'}
          sublabel="Jan–Jun 2025"
          variant="neutral"
        />
        <KpiCard
          label="Pedidos Validos"
          value={pedidos ? integer(pedidos.valor) : '—'}
          variant="neutral"
        />
        <KpiCard
          label="Sessoes no Site"
          value={sessoes ? integer(sessoes.valor) : '—'}
          variant="neutral"
        />
        <KpiCard
          label="Invest. Marketing"
          value={investimento ? brl(investimento.valor) : '—'}
          variant="neutral"
        />
        <KpiCard
          label="Taxa de Conversao"
          value={conversao ? pct(conversao.valor) : '—'}
          sublabel={`Meta: ${conversao?.meta ? pct(conversao.meta) : '3,06%'}`}
          delta={conversao?.meta
            ? `${(conversao.valor - conversao.meta).toFixed(2).replace('.', ',')} p.p. vs meta`
            : undefined}
          variant={conversao?.status as 'ok' | 'error' | 'neutral' ?? 'neutral'}
        />
        <KpiCard
          label="CAC"
          value={cac ? brl(cac.valor) : '—'}
          sublabel={`Meta: ${cac?.meta ? brl(cac.meta) : 'R$ 113,46'}`}
          delta={cac?.meta
            ? `+${brl(cac.valor - cac.meta)} acima da meta`
            : undefined}
          variant={cac?.status as 'ok' | 'error' | 'neutral' ?? 'neutral'}
        />
        <KpiCard
          label="Ticket Medio"
          value={ticketMedio ? brl(ticketMedio.valor) : '—'}
          variant="ok"
        />
        <KpiCard
          label="ROI de Marketing"
          value={roi ? `${roi.valor.toFixed(2).replace('.', ',')}x` : '—'}
          variant="ok"
        />
      </KpiGrid>

      {/* Chart placeholder + tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Receita Mensal" description="Epico 4 — graficos Recharts em breve" height={220}>
          <div className="flex items-center justify-center h-full rounded-lg border-2 border-dashed border-gray-100">
            <p className="text-xs text-gray-300">Recharts — Epico 4.1</p>
          </div>
        </ChartCard>

        <ChartCard title="Resumo por Mes" description={`${receitaFiltrada.length} registro(s) exibido(s)`}>
          <DataTable
            columns={TABLE_COLS}
            data={receitaFiltrada}
          />
        </ChartCard>
      </div>
    </div>
  )
}
