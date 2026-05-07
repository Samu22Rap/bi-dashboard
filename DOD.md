# Definition of Done — BI Omnichannel

> Critérios que **toda entrega** deve satisfazer antes de ser considerada concluída.
> Aplicável a épicos e tasks relevantes.

---

## 1. Código

- [ ] Nenhum erro de TypeScript (`tsc -b` passa sem warnings)
- [ ] Build de produção passa (`npm run build` sem erros)
- [ ] Nenhum `console.log` de debug deixado no código
- [ ] Sem imports não utilizados
- [ ] Path aliases (`@/`) usados consistentemente — sem imports relativos longos (`../../`)

## 2. Componentes e UI

- [ ] Componentes seguem o design system: cores via CSS variables do Tailwind, sem valores hexadecimais hardcoded fora de `index.css`
- [ ] Sem emojis na UI (apenas texto puro)
- [ ] KPI grid com 4 colunas fixas em desktop
- [ ] Nenhum elemento overflow além dos limites da tela (`min-width: 0` em itens de grid)
- [ ] Estados de loading e erro tratados em toda busca ao Supabase

## 3. Dados e Supabase

- [ ] Nenhuma chave secreta exposta além da `anon key` (que é pública por design)
- [ ] Todas as queries usam o singleton `supabase` de `@/lib/supabase`
- [ ] Tipos TypeScript definidos para todos os dados consumidos
- [ ] Erros de query são capturados e exibidos ao usuário (não silenciados)

## 4. Roteamento e Navegação

- [ ] Todas as rotas definidas no `App.tsx` funcionam sem erro 404
- [ ] Link ativo na sidebar reflete a rota atual
- [ ] Fallback `*` redireciona para `/`

## 5. Deploy

- [ ] `npm run build` limpo localmente antes do commit
- [ ] Commit com mensagem descritiva em português ou inglês (sem "fix", "update" genéricos)
- [ ] Push para `origin/master`
- [ ] `vercel deploy --prod` executado e `readyState: READY` confirmado
- [ ] URL canônica `https://bi-dashboard-red.vercel.app` acessível e funcional

## 6. Documentação

- [ ] `EPICS.md` atualizado: tasks do épico marcadas com `[x]`, status do épico atualizado
- [ ] `BI_Omnichannel_STATUS.md` atualizado com o novo estado do projeto
- [ ] Checklist de Épicos enviado no chat ao finalizar
- [ ] Checklist do DOD enviado no chat ao finalizar

---

*Criado em 06/05/2026*
