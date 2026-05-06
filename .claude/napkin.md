# Napkin Runbook — Trakinagem Cine

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)

1. **[2026-05-05] `force-dynamic` obrigatório em páginas com DB**
   Do instead: todas as pages que chamam `getPayloadClient()` devem ter `export const dynamic = 'force-dynamic'` no topo — ISR quebra o build Docker porque `db` hostname não está disponível em build time.

2. **[2026-05-05] Root layout usa try/catch em torno do DB**
   Do instead: `src/app/(frontend)/layout.tsx` já tem try/catch correto — nunca remover; é o único ponto que suporta build sem DB.

3. **[2026-05-05] `push: true` ignorado em produção — sempre usar migrations**
   Do instead: ao adicionar campos/globals novos, gerar migration (`docker compose exec app npx payload migrate:create nome`) e aplicar (`migrate`). Em prod, schema NÃO sincroniza sozinho mesmo com `push: true`.

4. **[2026-05-05] Container roda como uid=1001:65533 (nextjs:nogroup)**
   Do instead: pra criar migrations dentro do container, dar `chmod -R 777 /app/src/migrations` antes (ou `--user root` no exec). Migration salva precisa ser copiada do container pro host com `docker cp`.

5. **[2026-05-05] Hoje só rodando em Proxmox (192.168.100.101) — VPS ainda não entrou**
   Do instead: o domínio público `trakinagemcine.victorsamuel.com.br` aponta pro Proxmox via Cloudflare Tunnel. Quando o usuário disser "VPS", confirmar antes — provavelmente ainda é Proxmox. Containers: `trakinagemcine` (porta 3006) e `trakinagemcine_db`.

## Payload 3 Gotchas

1. **[2026-05-05] `collapsible` com label string mostra "Alternar bloco" em pt-BR**
   Do instead: usar `tabs` ou `group` plano. O i18n pt do Payload trata strings de label do collapsible como chave e cai no fallback aria-label genérico.

## Stack & Architecture

1. **[2026-05-05] Stack: Next.js 15 + Payload CMS 3 + PostgreSQL 16 + Tailwind v4**
   Do instead: não misturar paradigmas — server components para fetch, client components para interação. CSS vive em `src/app/(frontend)/styles.css` (1829 linhas, 26 media queries).

2. **[2026-05-05] Globals: SiteConfig, SmtpConfig, AnalyticsConfig**
   Do instead: configurações do site (hero, tema, social links, analytics) sempre via Payload globals — nunca hardcoded.

3. **[2026-05-05] Tema dinâmico via `data-site-theme` no `<html>`**
   Do instead: tema `default` (claro, vermelho, verde) ou `editorial` (escuro) — alternável pelo admin sem rebuild, lido no layout.tsx.

## Domain Behavior Guardrails

1. **[2026-05-05] Padding-top 164px desktop em sub-pages (header overlap)**
   Do instead: `.page-header-section { padding-top: 164px }` em todas as sub-pages — o header é fixed e alto.

2. **[2026-05-05] Breakpoints responsivos: mobile <768px, tablet 768-1024px, desktop >1024px**
   Do instead: nav desktop compacta entre 768-1024px (iPad). Hero e sections têm padding responsivo via media queries.

## User Directives

1. **[2026-05-05] Projeto cultural não-lucrativo — cliente é dono**
   Do instead: linguagem PT-BR em todo código/UI; manter identidade visual cinematográfica (vermelho #D32F2F, tipografia Cormorant/Playfair).
