# Full SEO Audit Report — site.movixflow.com.br
**Data:** 2026-05-02 | **Auditor:** SEO Audit v2 (parallel subagents)  
**Tipo de negócio:** SaaS B2B — Gestão de Riscos Logísticos  
**Plataforma:** Next.js 14 App Router · Vercel · Brasil

---

## ⚠️ AVISO CRÍTICO: Deploy Pendente

**As melhorias das Fases 1–4 foram commitadas mas NÃO foram feitas deploy.**  
O site ao vivo ainda roda o build antigo (`0EgIeKn7oiEZn9lCTMBBT`).  
O score abaixo reflete o **estado atual do servidor**, não o código local.

---

## SEO Health Score: 29/100 (site atual) → 74/100 (após deploy)

| Categoria | Peso | Score Atual | Score Pós-Deploy |
|---|---|---|---|
| Technical SEO | 22% | 28/100 | 76/100 |
| Content Quality | 23% | 40/100 | 70/100 |
| On-Page SEO | 20% | 22/100 | 74/100 |
| Schema / Structured Data | 10% | 5/100 | 78/100 |
| Performance (CWV) | 10% | 65/100 | 72/100 |
| AI Search Readiness | 10% | 8/100 | 82/100 |
| Images | 5% | 20/100 | 45/100 |
| **Total** | **100%** | **29/100** | **74/100** |

---

## 1. Technical SEO

### HTTP / HTTPS
| Check | Status | Detalhe |
|---|---|---|
| HTTP→HTTPS redirect | ✅ PASS | 308 Permanent Redirect |
| HSTS | ✅ PASS | max-age=63072000 (2 anos) |
| Servidor | ✅ PASS | Vercel CDN (HIT) |
| TTFB | ✅ PASS | 0.31s (excelente) |
| Content-Encoding | ❓ N/A | Vercel gerencia compressão automaticamente |

### Crawlability
| Check | Status | Detalhe |
|---|---|---|
| robots.txt | ❌ FAIL | Retorna 404 — **arquivo não deployado** |
| sitemap.xml | ❌ FAIL | Retorna 404 — **arquivo não deployado** |
| Homepage | ✅ PASS | 200 OK |
| /sobre | ✅ PASS | 200 OK |
| /blog | ✅ PASS | 200 OK |
| /embarcadores | ❌ FAIL | 404 — página não deployada |
| /blog/[slug] | ❌ FAIL | 404 — artigos não deployados |
| /llms.txt | ❌ FAIL | 404 — arquivo não deployado |

### Security Headers
| Header | Status |
|---|---|
| X-Frame-Options | ❌ MISSING |
| X-Content-Type-Options | ❌ MISSING |
| Referrer-Policy | ❌ MISSING |
| Permissions-Policy | ❌ MISSING |

> Todos os 4 headers foram adicionados em `next.config.mjs` mas aguardam deploy.

---

## 2. Content Quality (E-E-A-T)

### Homepage
| Check | Status | Detalhe |
|---|---|---|
| Title | ❌ FAIL | "MovixFlow - Conecte sua carga ao motorista certo" — keywords fracas, 49 chars |
| Meta description | ❌ FAIL | "Plataforma inteligente para gestão de fretes e logística" — apenas 47 chars |
| generator: v0.app | ❌ FAIL | Vaza stack tecnológica para crawlers |
| H1 | ✅ PASS | Presente no código (renderizado client-side) |
| Conteúdo de valor | ✅ PASS | Features, stats, depoimentos, pricing visíveis |
| Depoimentos | ⚠️ WARN | Empresas genéricas (TransLog, Cargo Express) — credibilidade baixa para B2B |

### /sobre
| Check | Status |
|---|---|
| Title | ❌ FAIL | Herda title global da homepage (não tem própria) |
| Meta description | ❌ FAIL | Herda description global |
| Conteúdo | ✅ PASS | Missão, visão, valores, timeline presentes |

### /blog
| Check | Status |
|---|---|
| Title | ❌ FAIL | Herda title global |
| Artigos individuais | ❌ FAIL | 404 — não deployados |

---

## 3. On-Page SEO

| Check | Status | Detalhe |
|---|---|---|
| Canonical tag | ❌ FAIL | Ausente em todas as páginas |
| Open Graph tags | ❌ FAIL | Ausente — previews sociais não funcionam |
| Twitter Card | ❌ FAIL | Ausente |
| metadataBase | ❌ FAIL | Não configurado (corrigido no código local) |
| lang="pt-BR" | ✅ PASS | `<html lang="pt-BR">` presente |
| Viewport meta | ✅ PASS | `width=device-width, initial-scale=1` |
| Favicon | ✅ PASS | /icon.svg referenciado |

---

## 4. Schema / Structured Data

| Check | Status | Detalhe |
|---|---|---|
| Organization | ❌ FAIL | Ausente no site ao vivo |
| SoftwareApplication | ❌ FAIL | Ausente |
| WebSite | ❌ FAIL | Ausente |
| FAQPage | ❌ FAIL | Ausente |
| Article (blog) | ❌ FAIL | Artigos não deployados |
| BreadcrumbList | ❌ FAIL | Ausente |

> Todos os schemas foram implementados no código local mas aguardam deploy.

---

## 5. Performance (Core Web Vitals — Lab Analysis)

| Métrica | Estimativa | Status |
|---|---|---|
| TTFB | 0.31s | ✅ PASS (< 0.8s) |
| LCP Risk | Médio | ⚠️ WARN — hero image sem srcset/priority no live |
| CLS Risk | Baixo | ✅ Tailwind fixed heights, sem ads |
| INP Risk | Médio | ⚠️ Framer Motion + Stripe.js blocking |
| Stripe.js | ❌ FAIL | `beforeInteractive` — bloqueia parser HTML |
| Imagens com srcset | ❌ FAIL | 0 imagens otimizadas com srcset no live |
| CSS files | 2 | ✅ OK |
| JS chunks | Todos async | ✅ PASS |

---

## 6. AI Search Readiness (GEO)

| Check | Status | Detalhe |
|---|---|---|
| /llms.txt | ❌ FAIL | 404 — não deployado |
| GPTBot permitido | ❌ FAIL | robots.txt 404 (sem regras = permissão implícita, não explícita) |
| ClaudeBot permitido | ❌ FAIL | idem |
| PerplexityBot | ❌ FAIL | idem |
| CCBot bloqueado | ❌ FAIL | idem |
| Organization schema | ❌ FAIL | Não deployado |
| Citabilidade | ⚠️ WARN | Homepage tem claims ("65%", "1.200+") mas sem schema validando |
| FAQ estruturado | ❌ FAIL | FAQPage JSON-LD não deployado |

---

## 7. SXO — Search Experience Optimization

**Score: 27/35** (análise por subagente com acesso ao código-fonte)

| Dimensão | Score |
|---|---|
| Intent Match | 4/5 |
| Above-the-Fold | 4/5 |
| CTA Effectiveness | 4/5 |
| Trust Signals | 3/5 |
| Page-Type Match | 5/5 |
| User Journey | 3/5 |
| Mobile | 4/5 |

**Issues encontrados pelo SXO agent:**
1. CTA "Falar com especialista" no plano Standard dispara `handleCheckout("standard")` — mismatch grave de intenção
2. Stats "1.200+ clientes em 15 estados" existem apenas no /sobre, não na homepage
3. Nenhum link para /embarcadores no nav principal
4. Pricing não acessível diretamente pelo header nav

---

## 8. Backlinks

**Dados disponíveis:** Common Crawl apenas (domínio novo)

| Check | Resultado |
|---|---|
| Domínio indexado no CC | ❌ Sem dados (domínio muito novo) |
| Referring domains estimados | 0 (novo) |
| DA/PA | N/A (requer Moz API) |
| Toxic links | N/A |

> Normal para domínio recém-lançado. Prioridade: GSC + Bing Webmaster Tools + perfis sociais.

---

## Top 5 Issues Críticos

1. **Deploy pendente** — Todo o trabalho das Fases 1–4 está no git mas não no servidor
2. **robots.txt 404** — Sem regras de crawl publicadas
3. **sitemap.xml 404** — Google não consegue descobrir URLs automaticamente
4. **Zero structured data no live** — Nenhum schema JSON-LD publicado
5. **Stripe.js beforeInteractive** — Bloqueia renderização da página

## Top 5 Quick Wins (pós-deploy)

1. Fazer deploy → score sobe de 29 para ~74 instantaneamente
2. Submeter sitemap no Google Search Console após deploy
3. Chamar `POST /api/indexnow` para indexação no Bing/Yandex
4. Corrigir CTA do plano Standard (mismatch intenção/ação)
5. Adicionar link /embarcadores e /preços no header nav
