# Trakinagem Cine — TODO (Sprint Tracker)

> **PRD:** `docs/PRD_Trakinagem_Fase1.docx`
> **Stack:** Next.js 15.3.9 + Payload CMS 3.82 + PostgreSQL 16 + Tailwind v4
> **Domínio dev:** trakinagem.victorsamuel.com.br (Cloudflare Tunnel)
> **Local:** http://trakinagemcine.local (NPM → trakinagemcine:3000)
> **Container:** `trakinagemcine` (porta 3006)
> **DB:** `trakinagemcine_db` (PostgreSQL isolado)

---

## Sprint 1 — Setup do Projeto (Dias 1-5)

### Infraestrutura
- [x] Scaffold Next.js 15 + Payload CMS 3.82 + TypeScript
- [x] `package.json` com todas as dependências (Framer Motion, GSAP, react-countup, sharp)
- [x] `tsconfig.json` com paths @/ e @payload-config
- [x] `next.config.ts` com standalone output, security headers, Payload wrapper
- [x] `postcss.config.mjs` para Tailwind CSS v4
- [x] `.env` + `.env.example`
- [x] `.gitignore` + `.dockerignore`
- [x] `Dockerfile` multi-stage (node:22-alpine, deps → build → runner)
- [x] `docker-compose.yml` (app + PostgreSQL 16-alpine, rede_publica)
- [x] `npm install` — 660 pacotes instalados
- [x] `npm run build` — ✅ compilou com sucesso (46s)
- [x] `docker compose up -d --build` — containers rodando
- [x] NPM proxy host: `trakinagemcine.local → trakinagemcine:3000`
- [x] Cloudflare Tunnel: rota `trakinagemcine.victorsamuel.com.br` (configurado manualmente)
- [x] Testar acesso via Cloudflare Tunnel (HTTPS) ✅
- [x] `entrypoint.sh` para rodar Payload migrations na startup do container
- [x] `.dockerignore` para optimizar build context
- [x] DB push mode + migrations automáticas (23 tabelas criadas)

### Payload CMS — Collections (todas criadas)
- [x] `Users.ts` — autenticação JWT admin
- [x] `Media.ts` — uploads (imagem, vídeo, PDF)
- [x] `Posts.ts` — Quentinhas (blog/press) com auto-slug, richText, tags, status draft/published
- [x] `Edicoes.ts` — Edições/Temporadas com status ativa/arquivada, galeria, vídeos, apoiadores
- [x] `Filmes.ts` — Catálogo com sinopse, poster, YouTube embed, relação com edição e prêmios
- [x] `Premios.ts` — Prêmios e festivais (premiado/selecionado), relação com filmes
- [x] `Apoiadores.ts` — Logos com categoria (lei_incentivo/patrocinador/apoiador/parceiro)
- [x] `SiteConfig.ts` (global) — hero, redes sociais, contato
- [x] Criar primeiro usuário admin no Payload (`/admin`) — victor@victorsamuel.com.br
- [ ] Testar criação de conteúdo em todas as collections
- [x] Hook `afterChange` em Edicoes: quando status → "ativa", arquiva automaticamente as demais ✅

### Payload CMS — App Router
- [x] `(payload)/layout.tsx` — layout admin
- [x] `(payload)/admin/[[...segments]]/page.tsx` — catch-all admin
- [x] `(payload)/admin/[[...segments]]/not-found.tsx` — 404 admin
- [x] `(payload)/api/[...slug]/route.ts` — REST API
- [x] `(payload)/api/graphql/route.ts` — GraphQL
- [x] `(payload)/api/graphql-playground/route.ts` — GraphQL Playground
- [x] `(payload)/admin/importMap.js` — placeholder
- [x] `(payload)/custom.scss` — customização admin

### Design System Foundation
- [x] Tailwind v4 CSS-first tokens (cores, tipografia, espaçamento)
- [x] Cores: `#0A0A0F` (bg), `#111118` (bg alt), `#F5A623` (accent amber), `#F0EDE8` (text)
- [x] Tipografia: Cormorant Garamond (headings) + Inter (body) via next/font
- [x] Grain overlay (CSS noise SVG, opacity 0.04)
- [x] Custom cursor crosshair (desktop only)
- [x] Scrollbar customizada
- [x] Selection highlight com accent
- [x] Container e section utilities

### Frontend — Componentes Base
- [x] `Header.tsx` — fixed, glassmorphism, hamburger animado, nav links
- [x] `Footer.tsx` — brand, links, crédito developer
- [x] `(frontend)/layout.tsx` — root layout com fonts, metadata SEO, Open Graph
- [x] `(frontend)/styles.css` — design system completo

### Frontend — Home Page
- [x] Hero com radial gradient, label, título, subtitle, 2 CTAs
- [x] Seção números (7+ temporadas, 100+ jovens, 20+ filmes, 10+ prêmios)
- [x] Preview "O que é o Trakinagem?"
- [x] Integrar hero com dados do `SiteConfig` do Payload (imagem, título, subtítulo) ✅
- [x] Animações Framer Motion no hero (scroll reveal) ✅
- [x] GSAP ScrollTrigger parallax na imagem do hero ✅
- [x] Contadores animados com react-countup ✅
- [x] Seção CTA "Vamos Juntos?" na home
- [x] Scroll indicator animado no hero

---

## Sprint 2 — Design System + Home Completa (Dias 6-10)

### Componentes UI
- [x] `Button.tsx` — primary, secondary, ghost variants ✅
- [x] `Card.tsx` — para filmes, edições, posts ✅
- [x] `SectionHeader.tsx` — título + subtítulo padronizado ✅
- [x] `YouTubeEmbed.tsx` — lazy load com thumbnail estática (youtube-nocookie.com) ✅
- [x] `Lightbox.tsx` — galeria de fotos com modal ✅
- [x] `ScrollReveal.tsx` — wrapper Framer Motion para scroll animations ✅
- [x] `AnimatedCounter.tsx` — contadores com intersection observer ✅
- [x] `CookieBanner.tsx` — consentimento LGPD granular ✅

### Home Completa
- [x] Seção "Últimas Quentinhas" (3 posts recentes do CMS) ✅
- [x] Seção "Nossos Filmes" (carousel/grid dos 4 mais recentes) ✅
- [x] Seção apoiadores (logos grid) ✅
- [x] Seção CTA "Vamos Juntos?" (faixa com botão) ✅
- [x] Page transitions com AnimatePresence ✅ (`PageTransition.tsx`)
- [x] Home integrada com dados CMS (SiteConfig, posts, filmes, apoiadores) ✅
- [x] `lib/payload.ts` — helper para queries do CMS

---

## Sprint 3 — Páginas de Conteúdo (Dias 11-15)

### /quentinhas (Blog/Press)
- [x] Listagem paginada de posts ✅
- [x] Single post: `[slug]/page.tsx` ✅
- [x] Imagens para download (pressImages) ✅
- [x] Tags filtragem ✅
- [x] `generateMetadata()` dinâmico ✅

### /nesta-edicao (Edição Ativa)
- [x] Query: `edicoes` onde `status === 'ativa'` ✅
- [x] Galeria de fotos com lightbox ✅
- [x] Parceiros institucionais ✅
- [x] Embed de vídeos YouTube ✅
- [x] Botão "Arquivar Edição" (visível se admin logado — hook Payload) ✅

### /bora-filmar (Institucional)
- [x] Layout editorial ✅
- [ ] Conteúdo do global Pages (aguardando texto do cliente)

### /como-filmar (Metodologia)
- [x] Cards dos 7 Atos com numeração capítulo ✅
- [ ] Embed YouTube por ato (aguardando links)

---

## Sprint 4 — Catálogo + Histórico (Dias 16-20)

### /timeline (Histórico)
- [x] Edições ordenadas por ano (desc) ✅
- [x] Filtro lateral por ano ✅ (pills animados com Framer Motion)
- [x] Cards: ano, nome, capa, resumo, CTA ✅
- [x] `/timeline/[slug]` — página individual da edição ✅

### /nossos-filmes (Catálogo)
- [x] Grid de cards: poster, título, ano, edição ✅
- [x] Hover: overlay com sinopse (Framer Motion) ✅
- [x] Click: modal com detalhes + "Assistir no YouTube" ✅
- [x] Filtro por edição (pills) ✅

---

## Sprint 5 — Páginas Complementares (Dias 21-25)

### /premios (Prêmios e Festivais)
- [x] Agrupado por ano ✅
- [x] Card: logo festival, nome, categoria, resultado ✅

### /apoiadores (Acreditam no Cinema)
- [x] Grid de logos com grayscale→color hover ✅
- [x] Agrupamento por categoria ✅

### /nossas-inspiracoes
- [x] Conteúdo editorial sobre Rede Kino e referências ✅

### /vamos-juntos (Contato/CTA)
- [x] Formulário: Nome, Empresa, E-mail, Telefone, Mensagem ✅
- [x] Envio via Payload form submissions ✅ (route `/api/contato` com rate limit + validação)
- [x] E-mail de notificação ✅ (via Resend API — configuração em `.env`)
- [x] Checkbox LGPD ✅

### /privacidade
- [x] Política de Privacidade LGPD ✅

---

## Sprint 6 — Polish + Entrega (Dias 26-30)

### SEO
- [x] `generateMetadata()` em todas as rotas ✅
- [x] Open Graph completo (título, descrição, imagem) ✅ (`og:image` padrão `/images/og-default.jpg`)
- [x] `sitemap.xml` gerado automaticamente ✅
- [x] `robots.txt` ✅
- [x] Schema.org: Organization ✅ (JSON-LD no `<head>`)
- [x] Schema.org Event por temporada ✅ (JSON-LD em `/timeline/[slug]`)
- [x] URLs canônicas ✅ (`alternates.canonical` nas páginas dinâmicas)

### LGPD
- [x] Banner de cookies (consentimento granular) ✅
- [x] Página /privacidade ✅
- [x] Checkbox de consentimento em todos os formulários ✅
- [x] Nenhum tracker sem consentimento ✅ (AnalyticsScripts + evento trakinagem:consent)

### Performance
- [ ] PageSpeed ≥ 90 mobile / 95 desktop
- [ ] LCP < 2.5s
- [ ] YouTube lazy load (thumbnail estática, player on-click)
- [ ] next/font subset

### Segurança
- [x] Headers: X-Frame-Options, X-Content-Type-Options, HSTS (next.config.ts)
- [x] CSP header configurado ✅ (YouTube, Google Fonts, self-hosted)
- [x] Rate limiting no endpoint de formulário ✅ (5 req/h por IP, in-memory)
- [x] Payload Admin acessível apenas via JWT ✅ (Users: access controls + cookie Strict/Secure + 8h expiry)
- [x] Backups diários PostgreSQL via cron ✅ (`scripts/backup-db.sh` — adicionar ao crontab)

### Testes & QA
- [ ] Cross-browser (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Android Chrome)
- [x] Onboarding CMS para o cliente ✅ (`docs/GUIA_CMS_CRIS.md`)

---

## Pendências de Conteúdo (aguardando cliente)

| Item | Seção | Prioridade | Status |
|------|-------|------------|--------|
| Texto: o que é o Trakinagem | Bora Filmar! | Alta | ⏳ |
| Texto: metodologia das oficinas | Como Filmar? | Alta | ⏳ |
| Links das 7 videoaulas YouTube | Como Filmar? | Alta | ⏳ |
| Texto e fotos da edição atual | Nesta Edição | Alta | ⏳ |
| Resumo de cada temporada passada | Timeline | Alta | ⏳ |
| Fotos de cada temporada | Timeline | Média | ⏳ |
| Sinopses dos filmes | Nossos Filmes | Alta | ⏳ |
| Capas/posters dos filmes | Nossos Filmes | Alta | ⏳ |
| Lista de prêmios e festivais | Prêmios | Média | ⏳ |
| Logos dos apoiadores por edição | Apoiadores | Média | ⏳ |
| Texto: referências e Rede Kino | Nossas Inspirações | Baixa | ⏳ |
| Foto/vídeo hero para o site | Home | Alta | ⏳ |

---

## Preparação Fase 2 (Multi-Tenant)

> Decisões arquiteturais já implementadas nesta fase:

- [x] Collections isoladas em `src/collections/` sem acoplamento com frontend
- [x] Campo `tenantId` comentado nas collections (preparado para ativar)
- [x] Design system em CSS variables (fácil troca por tenant)
- [x] Docker Compose modular (fácil adicionar containers)
- [ ] Script de apontamento DNS via Cloudflare API
- [ ] Documentar processo de criação de novo tenant

---

*Última atualização: 03/05/2026*
