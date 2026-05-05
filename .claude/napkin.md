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

3. **[2026-05-05] Testar via `http://trakinagemcine.local` (NPM proxy)**
   Do instead: usar URL local para verificar visual; produção em `https://trakinagem.victorsamuel.com.br`. Containers: `trakinagemcine` (porta 3006) e `trakinagemcine_db`.

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
