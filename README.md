# BI Omnichannel Dashboard

Dashboard analítico omnichannel construído com React 18, Vite 5, TypeScript, Tailwind CSS e Recharts. Dados reais servidos pelo Supabase.

**URL de produção:** https://bi-dashboard-red.vercel.app

---

## Visão geral

| Página | Conteúdo |
|---|---|
| **Executivo** | KPIs consolidados, receita mensal, taxa de conversão vs meta, gauge |
| **Marketing** | CAC por canal, ROI por campanha, investimento vs novos clientes, tabela de campanhas |
| **Produtos** | Receita, desconto, margem por categoria; scatter ticket médio × volume |
| **Clientes** | Clientes por canal e por estado, distribuição de renda, score de fidelidade |
| **Diagnóstico** | Funil de conversão, conversão por dispositivo e canal, motivos de atendimento |

Todos os gráficos possuem **filtros interativos** cujo estado é persistido na URL via `useSearchParams`.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + Vite 5 |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS v3 + shadcn/ui (manual) |
| Gráficos | Recharts 3 |
| Dados | Supabase (PostgreSQL) |
| Deploy | Vercel (projeto `bi-dashboard`, conta `samu22rap`) |
| Roteamento | React Router v6 |

---

## Estrutura do projeto

```
src/
├── components/
│   ├── layout/       # AppLayout, AppSidebar, AppHeader
│   ├── shared/       # KpiCard, KpiGrid, ChartCard, FilterBar, DataTable, LoadingState, ErrorState, ErrorBoundary
│   └── ui/           # card, select, table, button, badge, separator (shadcn manual)
├── hooks/
│   ├── useExecutivo.ts
│   ├── useMarketing.ts
│   ├── useProdutos.ts
│   ├── useClientes.ts
│   ├── useDiagnostico.ts
│   └── useFilters.ts   # hook genérico com useSearchParams
├── lib/
│   ├── supabase.ts     # singleton createClient
│   ├── formatters.ts   # brl, pct, roi, integer, days
│   ├── colors.ts       # CHART_COLORS, CHART_PALETTE, SEMANTIC_COLORS
│   └── utils.ts        # cn()
├── pages/
│   ├── Executivo.tsx
│   ├── Marketing.tsx
│   ├── Produtos.tsx
│   ├── Clientes.tsx
│   └── Diagnostico.tsx
├── types/
│   └── database.ts     # interfaces das 11 tabelas Supabase
└── main.tsx            # ErrorBoundary wrapper
```

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
git clone https://github.com/Samu22Rap/bi-dashboard.git
cd bi-dashboard
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-anon-key>
```

### Desenvolvimento

```bash
npm run dev
# Acesse http://localhost:5173
```

### Build de produção

```bash
npm run build
npm run preview   # opcional — preview local do build
```

---

## Deploy

O projeto é implantado automaticamente no Vercel via CLI:

```bash
vercel deploy --prod
```

Variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) devem estar configuradas no painel do Vercel em **Settings → Environment Variables**.

---

## Documentação interna

| Arquivo | Conteúdo |
|---|---|
| `EPICS.md` | Épicos e tasks com status (`[x]`/`[ ]`/`[~]`) |
| `DOD.md` | Definition of Done — critérios de aceite por categoria |
