// ============================================================
// Tipos TypeScript — BI Omnichannel
// Gerados a partir do schema real do Supabase (mcletxkfnldkaqxbjcac)
// ============================================================

export interface KpiResumo {
  indicador: string
  valor: number
  unidade: string
  meta: number | null
  status: 'ok' | 'error' | 'neutral'
}

export interface ReceitaMensal {
  mes: string
  mes_num: number
  receita: number
  pedidos: number
  sessoes: number
  taxa_conversao: number
  investimento_marketing: number
  novos_clientes: number
  ticket_medio: number
}

export interface CacPorCanal {
  canal: string
  investimento: number
  novos_clientes: number
  cac: number
  roi: number
}

export interface RoiPorCampanha {
  campanha: string
  plataforma: string
  investimento: number
  receita_atribuida: number
  novos_clientes: number
  roi: number
  cac: number
}

export interface ReceitaPorCategoria {
  categoria: string
  receita: number
  pedidos: number
  ticket_medio: number
  desconto_medio_pct: number
  margem_pct: number
}

export interface FunilDispositivo {
  dispositivo: string
  sessoes: number
  add_to_cart: number
  checkout: number
  pedidos: number
}

export interface ClientesPorCanal {
  canal: string
  total_clientes: number
  score_fidelidade_medio: number
  ticket_medio: number
}

export interface ClientesPorUf {
  uf: string
  total_clientes: number
}

export interface RendaFaixa {
  faixa: string
  total_clientes: number
  ticket_medio: number
}

export interface MotivoAtendimento {
  motivo: string
  quantidade: number
  percentual: number
  resolucao_media_dias: number
}

export interface ConversaoPorCanal {
  canal: string
  sessoes: number
  pedidos: number
  taxa_conversao: number
  bounce_rate: number
}
