import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, ScatterChart,
  Scatter, ZAxis,
} from 'recharts'
import { useProdutos } from '@/hooks/useProdutos'
import { LoadingState } from '@/components/shared/LoadingState'
import { ErrorState } from '@/components/shared/ErrorState'
import { KpiCard } from '@/components/shared/KpiCard'
import { KpiGrid } from '@/components/shared/KpiGrid'
import { ChartCard } from '@/components/shared/ChartCard'
import { FilterBar, FilterSelect } from '@/components/shared/FilterBar'
import { brl, pct, integer } from '@/lib/formatters'
import { CHART_COLORS, SEMANTIC_COLORS } from '@/lib/colors'

const META_DESCONTO = 12

export default function Produtos() {
  const { data, loading, error } = useProdutos()
  const [categoria, setCategoria] = useState('all')

  if (loading) return <LoadingState />
  if (error)   return <ErrorState message={error} />

  const cats = data!.receita_por_categoria
  const catOptions = cats.map((c) => ({ value: c.categoria, label: c.categoria }))

  const filtradas = categoria === 'all' ? cats : cats.filter((c) => c.categoria === categoria)

  // KPIs agregados
  const receitaTotal   = cats.reduce((s, c) => s + c.receita, 0)
  const pedidosTotal   = cats.reduce((s, c) => s + c.pedidos, 0)
  const ticketMedio    = receitaTotal / pedidosTotal
  const skusAtivos     = cats.length

  return (
    <div className="space-y-6">
      <FilterBar onReset={() => setCategoria('all')}>
        <FilterSelect label="Categoria" value={categoria} options={catOptions} onChange={setCategoria} />
      </FilterBar>

      {/* KPIs */}
      <KpiGrid cols={4}>
        <KpiCard label="Receita Total"    value={brl(receitaTotal)}     variant="neutral" sublabel="Todas as categorias" />
        <KpiCard label="Itens Vendidos"   value={integer(pedidosTotal)} variant="neutral" />
        <KpiCard label="Ticket Medio"     value={brl(ticketMedio)}      variant="ok" />
        <KpiCard label="Categorias Ativas" value={String(skusAtivos)}   variant="neutral" />
      </KpiGrid>

      {/* Linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Receita por categoria */}
        <ChartCard title="Receita por Categoria" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filtradas} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(v) => brl(Number(v))} />
              <Bar dataKey="receita" name="Receita" fill={CHART_COLORS.blue} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Desconto médio — vermelho se > 12% */}
        <ChartCard title="Desconto Medio por Categoria" description={`Alerta: desconto > ${META_DESCONTO}%`} height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filtradas} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 20]} />
              <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(v) => pct(Number(v))} />
              <ReferenceLine x={META_DESCONTO} stroke={SEMANTIC_COLORS.meta} strokeDasharray="4 4" label={{ value: `${META_DESCONTO}%`, position: 'top', fontSize: 10, fill: SEMANTIC_COLORS.meta }} />
              <Bar dataKey="desconto_medio_pct" name="Desconto" radius={[0, 3, 3, 0]}>
                {filtradas.map((entry) => (
                  <Cell key={entry.categoria} fill={entry.desconto_medio_pct > META_DESCONTO ? SEMANTIC_COLORS.error : SEMANTIC_COLORS.ok} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Linha 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Margem bruta */}
        <ChartCard title="Margem Bruta por Categoria" description="Percentual de margem sobre receita" height={240}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filtradas} layout="vertical" margin={{ top: 4, right: 32, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 60]} />
              <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(v) => pct(Number(v))} />
              <Bar dataKey="margem_pct" name="Margem" fill={CHART_COLORS.green} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Scatter: ticket médio × pedidos */}
        <ChartCard title="Ticket Medio vs Volume de Pedidos" description="Bolhas proporcionais a receita" height={240}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="ticket_medio" name="Ticket Medio" tickFormatter={(v) => `R$${v}`} tick={{ fontSize: 11 }} label={{ value: 'Ticket Medio', position: 'insideBottom', offset: -4, fontSize: 11 }} />
              <YAxis dataKey="pedidos" name="Pedidos" tick={{ fontSize: 11 }} />
              <ZAxis dataKey="receita" range={[60, 400]} name="Receita" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload
                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-2 text-xs shadow-sm">
                      <p className="font-semibold">{d.categoria}</p>
                      <p>Ticket: {brl(d.ticket_medio)}</p>
                      <p>Pedidos: {integer(d.pedidos)}</p>
                      <p>Receita: {brl(d.receita)}</p>
                    </div>
                  )
                }}
              />
              <Scatter data={filtradas} fill={CHART_COLORS.blue} fillOpacity={0.75} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
