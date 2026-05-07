// ============================================================
// Paleta de cores — Recharts + Design System BI Omnichannel
// Alinhada com os CSS variables do Tailwind (index.css)
// ============================================================

/** Cores primárias para séries de gráficos */
export const CHART_COLORS = {
  blue:   'hsl(231, 77%, 64%)',  // --chart-1 / --primary
  amber:  'hsl(38, 92%, 50%)',   // --chart-2
  green:  'hsl(160, 84%, 39%)',  // --chart-3
  red:    'hsl(0, 72%, 51%)',
  purple: 'hsl(270, 60%, 58%)',
  teal:   'hsl(185, 74%, 40%)',
} as const

/** Array ordenado para uso em múltiplas séries (Recharts Cell, linha por linha) */
export const CHART_PALETTE = [
  CHART_COLORS.blue,
  CHART_COLORS.amber,
  CHART_COLORS.green,
  CHART_COLORS.red,
  CHART_COLORS.purple,
  CHART_COLORS.teal,
] as const

/** Cores semânticas — usadas em indicadores vs. meta */
export const SEMANTIC_COLORS = {
  ok:      'hsl(160, 84%, 39%)',  // verde — atingiu meta
  error:   'hsl(0, 72%, 51%)',    // vermelho — abaixo da meta
  neutral: 'hsl(215, 16%, 47%)',  // cinza — sem meta definida
  meta:    'hsl(38, 92%, 50%)',   // âmbar — linha de meta nos gráficos
} as const

/** Cor da sidebar — usada em gráficos de fundo escuro se necessário */
export const SIDEBAR_BG = 'hsl(222, 47%, 11%)'
