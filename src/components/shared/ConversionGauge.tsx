/**
 * Gauge semicircular SVG — exibe valor atual vs meta.
 * Não depende do Recharts.
 */

interface ConversionGaugeProps {
  value: number
  meta: number
  max?: number        // máximo da escala (default: meta * 1.6)
  label?: string
  formatValue?: (v: number) => string
}

export function ConversionGauge({
  value,
  meta,
  max,
  label = 'Conversão',
  formatValue = (v) => `${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
}: ConversionGaugeProps) {
  const scale  = max ?? meta * 1.6
  const clamp  = (v: number) => Math.min(Math.max(v, 0), scale)
  const toDeg  = (v: number) => 180 - (clamp(v) / scale) * 180

  // Converte ângulo polar + raio → coordenadas SVG (cx=100, cy=90)
  const cx = 100, cy = 90
  const xy = (deg: number, radius: number) => {
    const r = (deg * Math.PI) / 180
    return { x: cx + radius * Math.cos(r), y: cy - radius * Math.sin(r) }
  }

  /**
   * Arco SVG de startDeg até endDeg no raio dado.
   * Para arcos de exatamente 180° (semicírculo com start/end na mesma linha
   * horizontal), alguns engines SVG colapsam o path para uma linha reta.
   * Solução: dividir em dois arcos de 90° passando pelo ponto médio.
   */
  const arc = (startDeg: number, endDeg: number, radius: number): string => {
    const s = xy(startDeg, radius)
    const e = xy(endDeg, radius)
    const span = Math.abs(endDeg - startDeg)

    if (span >= 178) {
      // Dividir em dois segmentos para evitar o caso degenerado
      const mid = (startDeg + endDeg) / 2
      const m = xy(mid, radius)
      return (
        `M ${s.x} ${s.y} ` +
        `A ${radius} ${radius} 0 0 0 ${m.x} ${m.y} ` +
        `A ${radius} ${radius} 0 0 0 ${e.x} ${e.y}`
      )
    }

    const large = span > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 0 ${e.x} ${e.y}`
  }

  const aVal  = toDeg(value)
  const aMeta = toDeg(meta)

  const outerR  = 70
  const innerR  = 52
  const midR    = (outerR + innerR) / 2   // 61 — centro da faixa
  const strokeW = outerR - innerR         // 18 — largura da faixa
  const needleR = midR + 2                // ligeiramente além do centro

  const aboveMeta   = value >= meta
  const fillColor   = aboveMeta ? '#22c55e' : '#f97316'
  const metaColor   = '#6366f1'
  const needleColor = '#1e40af'

  // Agulha — triângulo pivotando em (cx, cy)
  const toRad  = (d: number) => (d * Math.PI) / 180
  const nBase1 = { x: cx + 5 * Math.cos(toRad(aVal + 90)), y: cy - 5 * Math.sin(toRad(aVal + 90)) }
  const nBase2 = { x: cx + 5 * Math.cos(toRad(aVal - 90)), y: cy - 5 * Math.sin(toRad(aVal - 90)) }
  const nTip   = xy(aVal, needleR)

  // Tick de meta (linha perpendicular ao arco)
  const mOuter = xy(aMeta, outerR + 4)
  const mInner = xy(aMeta, innerR - 4)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <svg viewBox="0 0 200 100" className="w-full max-w-[260px]">
        {/* Trilha de fundo */}
        <path d={arc(180, 0, midR)} fill="none" stroke="#e5e7eb" strokeWidth={strokeW} />

        {/* Preenchimento até o valor atual */}
        <path d={arc(180, aVal, midR)} fill="none" stroke={fillColor} strokeWidth={strokeW} opacity={0.9} />

        {/* Tick de meta */}
        <line x1={mInner.x} y1={mInner.y} x2={mOuter.x} y2={mOuter.y} stroke={metaColor} strokeWidth={2.5} />

        {/* Agulha */}
        <polygon
          points={`${nBase1.x},${nBase1.y} ${nBase2.x},${nBase2.y} ${nTip.x},${nTip.y}`}
          fill={needleColor}
          opacity={0.85}
        />
        <circle cx={cx} cy={cy} r={5} fill={needleColor} />

        {/* Labels de escala */}
        <text x={cx - outerR - 4} y={cy + 12} textAnchor="end"   fontSize={9} fill="#9ca3af">0%</text>
        <text x={cx}              y={cy - outerR - 4} textAnchor="middle" fontSize={9} fill="#9ca3af">{`${(scale / 2).toFixed(1)}%`}</text>
        <text x={cx + outerR + 4} y={cy + 12} textAnchor="start"  fontSize={9} fill="#9ca3af">{`${scale.toFixed(1)}%`}</text>
      </svg>

      {/* Valor em destaque */}
      <p className={`-mt-2 text-3xl font-bold tabular-nums ${aboveMeta ? 'text-green-600' : 'text-orange-500'}`}>
        {formatValue(value)}
      </p>
      <p className="text-xs text-gray-400">{label}</p>

      {/* Legenda meta */}
      <div className="mt-1 flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 rounded" style={{ backgroundColor: metaColor }} />
        <span className="text-[11px] text-gray-500">Meta: {formatValue(meta)}</span>
      </div>
    </div>
  )
}
