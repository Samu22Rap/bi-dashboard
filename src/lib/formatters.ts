// ============================================================
// Formatadores de valores para o BI Omnichannel
// ============================================================

/** Formata número como moeda BRL — ex: R$ 2.245.955,61 */
export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Formata número como BRL compacto — ex: R$ 2,2M ou R$ 141,82 */
export function brlCompact(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`
  }
  return brl(value)
}

/** Formata percentual — ex: 2,66% */
export function pct(value: number, decimals = 2): string {
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`
}

/** Formata ROI — ex: 3,69x */
export function roi(value: number): string {
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`
}

/** Formata número inteiro com separador de milhar — ex: 6.778 */
export function integer(value: number): string {
  return value.toLocaleString('pt-BR')
}

/** Formata dias com 1 decimal — ex: 3,2 dias */
export function days(value: number): string {
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} dias`
}
