# BI Dashboard — Backlog de UX

> Originado da análise de UX de filtros, rótulos e polimento (08/05/2026).
> **Legenda:** `[x]` concluído · `[ ]` pendente · `[~]` em andamento

---

## Épico A — Bugs Críticos `[ ]`
> Itens que causam quebra visual ou dado incorreto

| # | Problema | Arquivo | Status |
|---|---|---|---|
| A1 | FunnelChart mostra "NaN" nos rótulos | `Diagnostico.tsx` | `[ ]` |
| A2 | PieChart de renda quebra ao filtrar uma faixa única | `Clientes.tsx` | `[ ]` |

---

## Épico B — Comportamento dos Filtros `[ ]`
> Filtros que não propagam corretamente para KPI cards e gráficos

| # | Problema | Arquivo | Status |
|---|---|---|---|
| B1 | Filtro de Mês (Executivo) não afeta KPI cards | `Executivo.tsx` | `[ ]` |
| B2 | Filtro de Plataforma (Marketing) não afeta KPIs nem gráfico de CAC | `Marketing.tsx` | `[ ]` |
| B3 | Filtro de Categoria (Produtos) não afeta KPI cards | `Produtos.tsx` | `[ ]` |
| B4 | Filtros de Canal/Renda (Clientes) não afetam KPI cards | `Clientes.tsx` | `[ ]` |
| B5 | Filtros de Dispositivo/Canal (Diagnóstico) não afetam KPI cards | `Diagnostico.tsx` | `[ ]` |

---

## Épico C — Filtro de Mês Faltante `[ ]`
> Apenas o que é viável com os dados atuais do Supabase

| # | Problema | Arquivo | Status |
|---|---|---|---|
| C1 | Falta filtro de Mês em Marketing (dados disponíveis em `receita_mensal`) | `Marketing.tsx` | `[ ]` |
| ~~C2~~ | ~~Mês em Produtos/Clientes/Diagnóstico~~ | — | `[descartado — dados não existem no DB]` |

---

## Épico D — Visualização `[ ]`
> Rótulos visíveis e gauge legível

| # | Problema | Arquivo | Status |
|---|---|---|---|
| D1 | Rótulos ausentes em todos os gráficos de barras | todas as páginas | `[ ]` |
| D2 | Gauge (RadialBarChart) sem rótulos; legenda solta e confusa | `Executivo.tsx` | `[ ]` |

---

## Épico E — UX Minor `[ ]`
> Botão, ortografia, polish final

| # | Problema | Arquivo | Status |
|---|---|---|---|
| E1 | Botão "Limpar filtros" aparece mesmo sem filtros ativos | `FilterBar.tsx` + todas as páginas | `[ ]` |
| E2 | Ortografia: acentos ausentes em labels e títulos | todas as páginas + layout | `[ ]` |

---

*Última atualização: 08/05/2026 — Backlog criado.*
