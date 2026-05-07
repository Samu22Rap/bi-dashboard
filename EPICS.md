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

## Épico 1 — Layout Base `[~] EM ANDAMENTO`
> Shell do dashboard com sidebar escura, header e navegação entre 5 páginas

| # | Task | Status |
|---|---|---|
| 1.1 | Instalar componentes shadcn: `button`, `badge`, `separator`, `tooltip` | `[ ]` |
| 1.2 | Instalar `react-router-dom` | `[ ]` |
| 1.3 | Criar `src/components/layout/AppLayout.tsx` — wrapper sidebar + conteúdo | `[ ]` |
| 1.4 | Criar `src/components/layout/AppSidebar.tsx` — nav com 5 links, branding, rodapé | `[ ]` |
| 1.5 | Criar `src/components/layout/AppHeader.tsx` — título dinâmico + badge "Dados Sintéticos" | `[ ]` |
| 1.6 | Criar rotas em `App.tsx` com `react-router-dom` — `/`, `/marketing`, `/produtos`, `/clientes`, `/diagnostico` | `[ ]` |
| 1.7 | Criar 5 páginas placeholder em `src/pages/` | `[ ]` |
| 1.8 | Responsividade — sidebar colapsável em telas < 768px | `[ ]` |
| 1.9 | Commit + deploy automático | `[ ]` |

**Entrega esperada:** Dashboard navegável com 5 rotas e sidebar funcional.

---

## Épico 2 — Camada de Dados `[ ]`
> Todos os dados do Supabase disponíveis via hooks React reutilizáveis

| # | Task | Status |
|---|---|---|
| 2.1 | Criar `src/types/database.ts` — interfaces das 11 tabelas | `[ ]` |
| 2.2 | Criar `src/hooks/useExecutivo.ts` — `kpis_resumo` + `receita_mensal` | `[ ]` |
| 2.3 | Criar `src/hooks/useMarketing.ts` — `cac_por_canal` + `roi_por_campanha` | `[ ]` |
| 2.4 | Criar `src/hooks/useProdutos.ts` — `receita_por_categoria` | `[ ]` |
| 2.5 | Criar `src/hooks/useClientes.ts` — `clientes_por_canal` + `clientes_por_uf` + `renda_faixa` | `[ ]` |
| 2.6 | Criar `src/hooks/useDiagnostico.ts` — `funil_dispositivo` + `conversao_por_canal` + `motivos_atendimento` | `[ ]` |
| 2.7 | Criar `src/components/shared/LoadingState.tsx` + `ErrorState.tsx` | `[ ]` |
| 2.8 | Criar `src/lib/formatters.ts` — `brl()`, `pct()`, `roi()` | `[ ]` |

**Entrega esperada:** Console sem erros, todos os dados chegando corretamente.

---

## Épico 3 — Componentes de UI Reutilizáveis `[ ]`
> Biblioteca interna antes de montar as páginas completas

| # | Task | Status |
|---|---|---|
| 3.1 | `src/components/shared/KpiCard.tsx` — label, valor, delta, variante ok/err/neutral | `[ ]` |
| 3.2 | `src/components/shared/KpiGrid.tsx` — grid 4 colunas responsivo | `[ ]` |
| 3.3 | `src/components/shared/ChartCard.tsx` — Card com título + slot Recharts | `[ ]` |
| 3.4 | `src/components/shared/FilterBar.tsx` — Select encapsulado + botão reset | `[ ]` |
| 3.5 | `src/components/shared/DataTable.tsx` — Table genérico shadcn | `[ ]` |
| 3.6 | `src/lib/colors.ts` — constante `CHART_COLORS[]` alinhada ao tema | `[ ]` |

**Entrega esperada:** Todos os componentes renderizando isoladamente em suas páginas placeholder.

---

## Épico 4 — Páginas Completas `[ ]`
> As 5 páginas com gráficos Recharts e dados reais do Supabase

| # | Task | Gráficos | Status |
|---|---|---|---|
| 4.1 | `Executivo.tsx` | ComposedChart (barras+linha+meta), RadialBarChart (gauge), BarChart pedidos | `[ ]` |
| 4.2 | `Marketing.tsx` | BarChart horizontal CAC, BarChart ROI campanhas, ComposedChart dual-axis, DataTable | `[ ]` |
| 4.3 | `Produtos.tsx` | BarChart receita, BarChart desconto, BarChart margem, ScatterChart ticket×volume | `[ ]` |
| 4.4 | `Clientes.tsx` | BarChart por canal, PieChart donut renda, BarChart top UFs, BarChart score fidelidade | `[ ]` |
| 4.5 | `Diagnostico.tsx` | FunnelChart, BarChart dispositivo, BarChart canal, BarChart agrupado, BarChart motivos, DataTable | `[ ]` |

**Entrega esperada:** Dashboard visualmente equivalente ao HTML original.

---

## Épico 5 — Filtros e Interatividade `[ ]`
> Filtros por página re-renderizando gráficos via estado React + URL params

| # | Task | Status |
|---|---|---|
| 5.1 | Hook `useFilters()` com estado por página | `[ ]` |
| 5.2 | Filtro Executivo — Mês (Jan–Jun) | `[ ]` |
| 5.3 | Filtro Marketing — Plataforma + Canal | `[ ]` |
| 5.4 | Filtro Produtos — Categoria | `[ ]` |
| 5.5 | Filtro Clientes — Canal de aquisição + Faixa de renda | `[ ]` |
| 5.6 | Filtro Diagnóstico — Dispositivo + Canal de origem | `[ ]` |
| 5.7 | Persistência via `useSearchParams` — filtros na URL | `[ ]` |

**Entrega esperada:** Dashboard completo com filtros funcionais.

---

## Épico 6 — Polimento e Deploy Final `[ ]`
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

*Última atualização: 06/05/2026 — Épico 0 concluído, iniciando Épico 1*
