# BI Dashboard — Backlog de UX

> Originado da análise de UX de filtros, rótulos e polimento (08/05/2026).
> **Legenda:** `[x]` concluído · `[ ]` pendente · `[~]` em andamento

---

## Épico A — Bugs Críticos `[x]`
> Itens que causam quebra visual ou dado incorreto

| # | Problema | Arquivo | Status |
|---|---|---|---|
| A1 | FunnelChart mostra "NaN" nos rótulos | `Diagnostico.tsx` | `[x]` |
| A2 | PieChart de renda quebra ao filtrar uma faixa única | `Clientes.tsx` | `[x]` |

---

## Épico B — Comportamento dos Filtros `[x]`
> Filtros que não propagam corretamente para KPI cards e gráficos

| # | Problema | Arquivo | Status |
|---|---|---|---|
| B1 | Filtro de Mês (Executivo) não afeta KPI cards | `Executivo.tsx` | `[x]` |
| B2 | Filtro de Plataforma (Marketing) não afeta KPIs nem gráfico de CAC | `Marketing.tsx` | `[x]` |
| B3 | Filtro de Categoria (Produtos) não afeta KPI cards | `Produtos.tsx` | `[x]` |
| B4 | Filtros de Canal/Renda (Clientes) não afetam KPI cards | `Clientes.tsx` | `[x]` |
| B5 | Filtros de Dispositivo/Canal (Diagnóstico) não afetam KPI cards | `Diagnostico.tsx` | `[x]` |

---

## Épico C — Filtro de Mês Faltante `[x]`
> Apenas o que é viável com os dados atuais do Supabase

| # | Problema | Arquivo | Status |
|---|---|---|---|
| C1 | Falta filtro de Mês em Marketing (dados disponíveis em `receita_mensal`) | `Marketing.tsx` | `[x]` |
| ~~C2~~ | ~~Mês em Produtos/Clientes/Diagnóstico~~ | — | `[descartado — dados não existem no DB]` |

---

## Épico D — Visualização `[x]`
> Rótulos visíveis e gauge legível

| # | Problema | Arquivo | Status |
|---|---|---|---|
| D1 | Rótulos ausentes em todos os gráficos de barras | todas as páginas | `[x]` |
| D2 | Gauge (RadialBarChart) sem rótulos; legenda solta e confusa | `Executivo.tsx` | `[x]` |

---

## Épico E — UX Minor `[x]`
> Botão, ortografia, polish final

| # | Problema | Arquivo | Status |
|---|---|---|---|
| E1 | Botão "Limpar filtros" aparece mesmo sem filtros ativos | `FilterBar.tsx` + todas as páginas | `[x]` |
| E2 | Ortografia: acentos ausentes em labels e títulos | todas as páginas + layout | `[x]` |

---

*Última atualização: 08/05/2026 — **Todos os épicos concluídos.** 🎉*
