# BI Dashboard — Épicos e Tasks
### Refatoração: HTML puro → React 18 + Vite + Tailwind + shadcn/ui + Vercel

> **Legenda:** `[x]` concluído · `[ ]` pendente · `[~]` em andamento

---

## Épico 0 — Fundação do Projeto `[x] CONCLUÍDO`
> Repositório React no ar no Vercel com smoke test conectado ao Supabase

| # | Task | Status |
|---|---|---|
| 0.1 | Criar app Vite + React + TypeScript | `[x]` |
| 0.2 | Configurar Tailwind CSS v3 + `index.css` com CSS variables | `[x]` |
| 0.3 | Configurar shadcn/ui manualmente (`components.json`) | `[x]` |
| 0.4 | Instalar dependências: `recharts`, `@supabase/supabase-js`, `clsx`, `tailwind-merge` | `[x]` |
| 0.5 | Criar `.env.local` com `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` | `[x]` |
| 0.6 | Criar `src/lib/supabase.ts` — singleton `createClient` | `[x]` |
| 0.7 | Criar `src/lib/utils.ts` — função `cn()` | `[x]` |
| 0.8 | `App.tsx` com smoke test: busca `receita_total` no Supabase e exibe na tela | `[x]` |
| 0.9 | Configurar `vercel.json` (build, outputDir, rewrite SPA) | `[x]` |
| 0.10 | Deploy no Vercel (conta `samu22rap`, projeto `bi-dashboard`) + env vars | `[x]` |

**URL de produção:** https://bi-dashboard-red.vercel.app

---

## Épico 1 — Layout Base `[x] CONCLUÍDO`
> Shell do dashboard com sidebar escura, header e navegação entre 5 páginas

| # | Task | Status |
|---|---|---|
| 1.1 | Instalar componentes shadcn: `button`, `badge`, `separator` | `[x]` |
| 1.2 | Instalar `react-router-dom` | `[x]` |
| 1.3 | Criar `src/components/layout/AppLayout.tsx` — wrapper sidebar + conteúdo | `[x]` |
| 1.4 | Criar `src/components/layout/AppSidebar.tsx` — nav com 5 links, branding, rodapé | `[x]` |
| 1.5 | Criar `src/components/layout/AppHeader.tsx` — título dinâmico + badges | `[x]` |
| 1.6 | Criar rotas em `App.tsx` — `/`, `/marketing`, `/produtos`, `/clientes`, `/diagnostico` | `[x]` |
| 1.7 | Criar 5 páginas placeholder em `src/pages/` | `[x]` |
| 1.8 | Commit + deploy para Vercel | `[x]` |

**URL de produção:** https://bi-dashboard-red.vercel.app

---

## Épico 2 — Camada de Dados `[x] CONCLUÍDO`
> Todos os dados do Supabase disponíveis via hooks React reutilizáveis

| # | Task | Status |
|---|---|---|
| 2.1 | Criar `src/types/database.ts` — interfaces das 11 tabelas (validadas via API REST) | `[x]` |
| 2.2 | Criar `src/hooks/useExecutivo.ts` — `kpis_resumo` + `receita_mensal` | `[x]` |
| 2.3 | Criar `src/hooks/useMarketing.ts` — `cac_por_canal` + `roi_por_campanha` + `receita_mensal` | `[x]` |
| 2.4 | Criar `src/hooks/useProdutos.ts` — `receita_por_categoria` | `[x]` |
| 2.5 | Criar `src/hooks/useClientes.ts` — `clientes_por_canal` + `clientes_por_uf` + `renda_faixa` | `[x]` |
| 2.6 | Criar `src/hooks/useDiagnostico.ts` — `funil_dispositivo` + `conversao_por_canal` + `motivos_atendimento` | `[x]` |
| 2.7 | Criar `src/components/shared/LoadingState.tsx` + `ErrorState.tsx` | `[x]` |
| 2.8 | Criar `src/lib/formatters.ts` — `brl()`, `brlCompact()`, `pct()`, `roi()`, `integer()`, `days()` | `[x]` |
| 2.9 | Validar hooks nas páginas placeholder — dados exibidos no placeholder | `[x]` |
| 2.10 | Commit + deploy para Vercel | `[x]` |

---

## Épico 3 — Componentes de UI Reutilizáveis `[x] CONCLUÍDO`
> Biblioteca interna antes de montar as páginas completas

| # | Task | Status |
|---|---|---|
| 3.1 | `src/components/shared/KpiCard.tsx` — label, valor, delta, variante ok/err/neutral | `[x]` |
| 3.2 | `src/components/shared/KpiGrid.tsx` — grid responsivo 1→2→4 colunas | `[x]` |
| 3.3 | `src/components/shared/ChartCard.tsx` — Card com título + slot altura configurável | `[x]` |
| 3.4 | `src/components/shared/FilterBar.tsx` — FilterSelect + FilterBar com botão reset | `[x]` |
| 3.5 | `src/components/shared/DataTable.tsx` — Table genérico com `ColumnDef<T>` tipado | `[x]` |
| 3.6 | `src/lib/colors.ts` — `CHART_COLORS`, `CHART_PALETTE`, `SEMANTIC_COLORS` | `[x]` |
| 3.7 | `src/components/ui/card.tsx` + `select.tsx` + `table.tsx` escritos manualmente | `[x]` |
| 3.8 | Executivo.tsx atualizado: 8 KPIs reais + FilterBar + ChartCard + DataTable | `[x]` |
| 3.9 | Build + commit + deploy | `[x]` |

---

## Épico 4 — Páginas Completas `[x] CONCLUÍDO`
> As 5 páginas com gráficos Recharts e dados reais do Supabase

| # | Task | Gráficos | Status |
|---|---|---|---|
| 4.1 | `Executivo.tsx` | ComposedChart (receita+conversão+meta), RadialBarChart (gauge), BarChart pedidos | `[x]` |
| 4.2 | `Marketing.tsx` | BarChart CAC (ok/erro vs meta), BarChart ROI, ComposedChart dual-axis, DataTable | `[x]` |
| 4.3 | `Produtos.tsx` | BarChart receita, BarChart desconto (alerta >12%), BarChart margem, ScatterChart | `[x]` |
| 4.4 | `Clientes.tsx` | BarChart canais, PieChart donut renda, BarChart top 12 UFs, BarChart score | `[x]` |
| 4.5 | `Diagnostico.tsx` | FunnelChart, BarChart dispositivo, BarChart canal vs média, BarChart motivos, DataTable | `[x]` |

---

## Épico 5 — Filtros e Interatividade `[x] CONCLUÍDO`
> Filtros por página re-renderizando gráficos via estado React + URL params

| # | Task | Status |
|---|---|---|
| 5.1 | Hook `useFilters()` com estado por página | `[x]` |
| 5.2 | Filtro Executivo — Mês (Jan–Jun) | `[x]` |
| 5.3 | Filtro Marketing — Plataforma + Canal | `[x]` |
| 5.4 | Filtro Produtos — Categoria | `[x]` |
| 5.5 | Filtro Clientes — Canal de aquisição + Faixa de renda | `[x]` |
| 5.6 | Filtro Diagnóstico — Dispositivo + Canal de origem | `[x]` |
| 5.7 | Persistência via `useSearchParams` — filtros na URL | `[x]` |

**Commit:** `f2338af` · **Deploy:** https://bi-dashboard-red.vercel.app

---

## Épico 6 — Polimento e Deploy Final `[~] PRÓXIMO`
> Vercel como deploy principal, GitHub Pages descontinuado

| # | Task | Status |
|---|---|---|
| 6.1 | Favicon + meta tags SEO (`<title>`, `og:title`, `og:description`) | `[ ]` |
| 6.2 | Otimização de bundle — code splitting por rota com `React.lazy` | `[ ]` |
| 6.3 | Domínio customizado no Vercel (opcional) | `[ ]` |
| 6.4 | Desativar GitHub Pages (Settings → Pages → None) | `[ ]` |
| 6.5 | Atualizar README com nova URL e instruções de dev local | `[ ]` |

**Entrega esperada:** URL canônica em produção, GitHub Pages desativado.

---

*Última atualização: 06/05/2026 — Épicos 0–5 concluídos, próximo: Épico 6*
