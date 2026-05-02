# Action Plan — MovixFlow SEO
**Gerado em:** 2026-05-02 | Score atual: 29/100 → Meta: 80/100

---

## 🚨 CRÍTICO — Fazer imediatamente

### 1. Fazer o deploy
**Impacto:** +45 pontos no score  
Todos os fixes das Fases 1–4 estão commitados. Basta fazer o deploy no Vercel.  
Após o deploy, verificar:
- `curl https://site.movixflow.com.br/robots.txt` → deve retornar conteúdo real
- `curl https://site.movixflow.com.br/sitemap.xml` → deve retornar XML válido
- `curl -I https://site.movixflow.com.br/` → deve ter X-Frame-Options, X-Content-Type-Options

### 2. Submeter ao Google Search Console
**Impacto:** indexação correta das novas páginas  
- Verificar propriedade do domínio
- Submeter `https://site.movixflow.com.br/sitemap.xml`
- Inspecionar URL da homepage e solicitar indexação

### 3. Submeter ao Bing Webmaster Tools
**Impacto:** indexação no Bing/DuckDuckGo  
- Criar conta em bing.com/webmasters
- Submeter sitemap
- Chamar `POST /api/indexnow` com `Authorization: Bearer <INDEXNOW_SECRET>`

---

## 🔴 ALTO — Resolver em 1 semana (pós-deploy)

### 4. Corrigir CTA do plano Standard
**Arquivo:** `app/page.tsx`  
O botão "Falar com especialista" no plano Standard chama `handleCheckout("standard")` — dispara Stripe diretamente. Para um comprador B2B em avaliação isso é um abandono imediato.  
**Fix:** renomear para "Assinar Standard" se a intenção é checkout, ou redirecionar para `#contato`/WhatsApp se a intenção é conversa de vendas.

### 5. Adicionar "Preços" e "Embarcadores" ao header nav
**Arquivo:** `components/header.tsx`  
O pricing não é acessível diretamente pelo nav — visitante precisa rolar toda a página. Embarcadores têm página própria mas sem entrada no menu.
```tsx
{ name: "Preços", href: "/#pricing" },
{ name: "Embarcadores", href: "/embarcadores" },
```

### 6. Criar og-image.png (1200×630px)
**Arquivo:** `public/og-image.png`  
Open Graph e Twitter Card estão configurados no código mas sem imagem real os previews sociais mostram placeholder genérico. Criar no Figma/Canva com: logo MovixFlow, tagline, fundo azul/indigo.

### 7. Confirmar URLs reais das redes sociais no footer
**Arquivo:** `components/footer.tsx`  
Links atuais usam `/movixflow` como handle padrão. Verificar se os perfis reais são:
- `https://www.linkedin.com/company/movixflow`
- `https://www.instagram.com/movixflow`
- `https://www.facebook.com/movixflow`
- `https://www.youtube.com/@movixflow`

### 8. Mover social proof para o hero
**Arquivo:** `app/page.tsx`  
"1.200+ clientes ativos em 15 estados" existe em `/sobre` mas não no hero. Adicionar uma credibility bar logo abaixo do CTA:
```
1.200+ transportadoras | 15 estados | desde 2020
```

---

## 🟡 MÉDIO — Resolver em 1 mês

### 9. Criar Política de Privacidade e Termos de Uso (LGPD)
**Novas páginas:** `app/privacidade/page.tsx`, `app/termos/page.tsx`  
Links no footer apontam para `#`. Necessário para conformidade LGPD e para E-E-A-T (trustworthiness).

### 10. Substituir depoimentos genéricos por reais
**Arquivo:** `app/page.tsx`  
"TransLog Brasil", "Cargo Express SP", "LogiMaster" são genéricos e reduzem credibilidade com compradores B2B. Substituir por empresas reais (com permissão) ou remover nomes e usar "Transportadora de grande porte, SP".

### 11. Adicionar logo/foto real no /sobre (Team section)
**Arquivo:** `app/sobre/page.tsx`  
A seção "Nossa Jornada" tem milestone 2023 "Prêmio de melhor solução logística" — adicionar link para o prêmio ou imagem real para validar o claim.

### 12. Adicionar "Preload" na dashboard image do hero
**Arquivo:** `app/page.tsx`  
Adicionar `priority` prop na `<Image>` do dashboard:
```tsx
<Image src="/dashboard-showcase.png" priority ... />
```

### 13. Verificar segmento de audiência no hero
**Arquivo:** `app/page.tsx`  
O hero serve simultaneamente transportadoras e embarcadores. Considerar um pill selector ou mencionar explicitamente os dois segmentos no subtítulo para reduzir bounce de embarcadores.

---

## 🟢 BAIXO — Backlog

### 14. Remover `typescript: { ignoreBuildErrors: true }`
✅ **Já feito** — commitado na Fase 4, aguarda deploy.

### 15. Implementar IndexNow no pipeline de CI/CD
Chamar `POST /api/indexnow` automaticamente após cada deploy bem-sucedido via Vercel webhook ou GitHub Actions.

### 16. Configurar Google API Key para métricas reais de CWV
Adicionar `GOOGLE_API_KEY` no `.env` para habilitar CrUX field data nos próximos audits.

### 17. Configurar Moz API para análise de backlinks
Adicionar `MOZ_API_KEY` para DA/PA e detecção de toxic links.

### 18. Criar página /embarcadores v2 com case studies reais
A página atual tem conteúdo de qualidade mas sem estudos de caso específicos para embarcadores. Adicionar 1-2 histórias de sucesso com números reais.

### 19. Remover `prefers-reduced-motion` override no hero
✅ **Já feito** — `useReducedMotion()` adicionado ao `FadeIn` na Fase 4.

### 20. Avaliar badges de certificação/segurança
Adicionar ANTT, LGPD compliance, ou certificação ISO (se houver) acima do fold para aumentar E-E-A-T.

---

## Roadmap Resumido

| Prazo | Ações | Score Esperado |
|---|---|---|
| Hoje | Deploy + GSC + Bing + IndexNow | ~74/100 |
| Semana 1 | CTA fix + nav + og-image + social proof | ~78/100 |
| Mês 1 | Privacidade + depoimentos reais + image preload | ~82/100 |
| Mês 3 | Backlinks + case studies + CrUX real data | ~86/100 |
