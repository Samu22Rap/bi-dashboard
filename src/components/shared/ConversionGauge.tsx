/**
 * Gauge semicircular SVG — exibe valor atual vs meta.
 * Não depende do Recharts.
 *
 * Sistema de coordenadas:
 *   cx=100, cy=90, viewBox="0 0 200 100"
 *   xy(deg) usa ângulos matemáticos padrão (0°=direita, 90°=cima).
 *   No SVG (y invertido) isso se traduz em:
 *     sweep=1 (horário no SVG)  = percorre o arco SUPERIOR ✓
 *     sweep=0 (anti-horário)    = percorre o arco INFERIOR ✗ (fora do viewBox)
 */

interface ConversionGaugeProps {
  value: number
  meta: number
  max?: number
  label?: string
  formatValue?: (v: number) => string
}

export function ConversionGauge({
  value,
  meta,
  max,
  label = 'Conversão',
  formatValue = (v) =>
    `${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
}: ConversionGaugeProps) {
  const scale = max ?? meta * 1.6
  const clamp = (v: number) => Math.min(Math.max(v, 0), scale)
  // 180° = posição 0 (esquerda); 0° = posição máxima (direita)
  const toDeg = (v: number) => 180 - (clamp(v) / scale) * 180

  const cx = 100, cy = 90

  /** Converte ângulo matemático → ponto SVG */
  const pt = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
  }

  /**
   * Gera path SVG de um arco de startDeg até endDeg no raio r.
   * Sempre usa sweep=1 (horário no SVG) para percorrer o arco superior.
   * Arcos ≥ 178° são divididos em dois de ~90° cada para evitar o
   * caso degenerado em que start e end ficam na mesma linha horizontal
   * e alguns engines SVG colapsam o path para uma linha reta.
   */
  const arc = (startDeg: number, endDeg: number, r: number): string => {
    const s = pt(startDeg, r)
    const e = pt(endDeg, r)
    const span = Math.abs(endDeg - startDeg)

    if (span >= 178) {
      const mid = (startDeg + endDeg) / 2
      const m = pt(mid, r)
      return (
        `M ${s.x} ${s.y} ` +
        `A ${r} ${r} 0 0 1 ${m.x} ${m.y} ` +
        `A ${r} ${r} 0 0 1 ${e.x} ${e.y}`
      )
    }

    const large = span > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
  }

  const aVal  = toDeg(value)
  const aMeta = toDeg(meta)

  const outerR  = 70
  const innerR  = 52
  const midR    = (outerR + innerR) / 2  // 61 — centro da faixa
  const strokeW = outerR - innerR        // 18

  const aboveMeta   = value >= meta
  const fillColor   = aboveMeta ? '#22c55e' : '#f97316'
  const metaColor   = '#6366f1'
  const needleColor = '#1e40af'

  // Agulha — triângulo pivotando em (cx, cy)
  const toRad  = (d: number) => (d * Math.PI) / 180
  const nBase1 = { x: cx + 5 * Math.cos(toRad(aVal + 90)), y: cy - 5 * Math.sin(toRad(aVal + 90)) }
  const nBase2 = { x: cx + 5 * Math.cos(toRad(aVal - 90)), y: cy - 5 * Math.sin(toRad(aVal - 90)) }
  const nTip   = pt(aVal, midR + 2)

  // Tick de meta
  const mOuter = pt(aMeta, outerR + 5)
  const mInner = pt(aMeta, innerR - 5)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1">
      <svg viewBox="0 0 200 105" className="w-full max-w-[260px]" overflow="visible">
        {/* Trilha de fundo */}
        <path d={arc(180, 0, midR)} fill="none" stroke="#e5e7eb" strokeWidth={strokeW} strokeLinecap="round" />

        {/* Preenchimento até o valor atual */}
        <path d={arc(180, aVal, midR)} fill="none" stroke={fillColor} strokeWidth={strokeW} opacity={0.9} strokeLinecap="round" />

        {/* Tick de meta */}
        <line x1={mInner.x} y1={mInner.y} x2={mOuter.x} y2={mOuter.y}
          stroke={metaColor} strokeWidth={2.5} strokeLinecap="round" />

        {/* Agulha */}
        <polygon
          points={`${nBase1.x},${nBase1.y} ${nBase2.x},${nBase2.y} ${nTip.x},${nTip.y}`}
          fill={needleColor}
          opacity={0.85}
        />
        <circle cx={cx} cy={cy} r={5} fill={needleColor} />

        {/* Labels de escala */}
        <text x={cx - outerR - 2} y={cy + 14} textAnchor="end"   fontSize={9} fill="#9ca3af">0%</text>
        <text x={cx}              y={cy - outerR - 5} textAnchor="middle" fontSize={9} fill="#9ca3af">{`${(scale / 2).toFixed(1)}%`}</text>
        <text x={cx + outerR + 2} y={cy + 14} textAnchor="start"  fontSize={9} fill="#9ca3af">{`${scale.toFixed(1)}%`}</text>
      </svg>

      {/* Valor em destaque */}
      <p className={`-mt-1 text-3xl font-bold tabular-nums ${aboveMeta ? 'text-green-600' : 'text-orange-500'}`}>
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
