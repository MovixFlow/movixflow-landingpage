# MovixFlow — Design System

## Direction

**Personality:** Sophistication & Trust  
**Foundation:** Cool (slate base)  
**Depth:** Borders + subtle shadows  
**Context:** Logistics/fintech SaaS — telas de consulta de risco, autenticação e acompanhamento

---

## Tokens

### Spacing
Base: 4px  
Scale: 4, 8, 12, 16, 20, 24, 32, 48, 64

### Colors

**Primária — Indigo (única cor de ação)**
```
accent:         indigo-600   (#4f46e5)
accent-hover:   indigo-700   (#4338ca)
accent-light:   indigo-50    (#eef2ff)
accent-border:  indigo-200   (#c7d2fe)
accent-text:    indigo-600
accent-muted:   indigo-400
```

**Superfícies (slate, não gray)**
```
surface-page:   slate-50     (#f8fafc)
surface-card:   white
surface-subtle: slate-100    (#f1f5f9)
border:         slate-200    (#e2e8f0)
border-subtle:  slate-100    (#f1f5f9)
```

**Texto (slate, não gray)**
```
text-primary:   slate-900    (#0f172a)
text-secondary: slate-600    (#475569)
text-muted:     slate-400    (#94a3b8)
text-faint:     slate-300    (#cbd5e1)
```

**Status**
```
success:        emerald-600 / emerald-50
warning:        amber-600   / amber-50
error:          red-600     / red-50
info:           indigo-600  / indigo-50
```

**Acento secundário — apenas CTA especiais**
```
secondary-cta:  violet-600   (botão "Acesso Empresa" no header apenas)
```

### Radius
```
sm:   rounded-lg    (8px)   — inputs, badges
md:   rounded-xl    (12px)  — botões, cards menores
lg:   rounded-2xl   (16px)  — cards principais
xl:   rounded-3xl   (24px)  — modais, containers hero
```

### Typography
Font: Geist Sans (já configurado)  
Scale: 11, 12, 13, 14 (base), 16, 18, 20, 24, 32  
Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Shadows
```
shadow-card:   shadow-sm                        — cards em repouso
shadow-raised: shadow-md                        — cards hover
shadow-float:  shadow-lg shadow-slate-200/60    — modais, dropdowns
shadow-cta:    shadow-lg shadow-indigo-500/20   — botões primários
```

---

## Patterns

### Button Primary
- Height: 44px (h-11)
- Padding: px-6
- Radius: rounded-xl
- Font: 14px, font-bold
- Background: indigo-600 → hover:indigo-700
- Shadow: shadow-lg shadow-indigo-500/20
- Usage: Ação principal de cada tela

### Button Secondary
- Height: 44px (h-11)
- Border: border border-slate-200
- Background: white → hover:slate-50
- Font: 14px, font-semibold, text-slate-700
- Usage: Ação secundária / voltar

### Button Ghost
- Height: 36px (h-9)
- Background: transparent → hover:slate-100
- Font: 13px, font-medium, text-slate-600
- Usage: Ações terciárias, nav

### Input
- Height: 44px (h-11)
- Background: slate-50 → focus:white
- Border: border-slate-200 → focus:border-indigo-400
- Radius: rounded-xl
- Font: 14px, text-slate-900
- Placeholder: text-slate-400

### Card Default
- Border: border border-slate-100
- Background: white
- Radius: rounded-2xl
- Padding: p-6
- Shadow: shadow-sm

### Card Interactive (hover)
- Base: Card Default
- Hover: hover:border-indigo-200 hover:shadow-md transition-all

### Badge / Status Chip
- Padding: px-3 py-1
- Radius: rounded-full
- Font: 11px, font-semibold, uppercase, tracking-wide
- Usage: status de solicitações

---

## Decisões

| Decisão | Motivo | Data |
|---------|--------|------|
| Unificar `gray-*` → `slate-*` | Slate tem cooler undertone, mais coerente com marca logística/fintech | 2026-04-12 |
| Remover `sky-*` das telas internas | Sky é muito informal para contexto de risco/consultas | 2026-04-12 |
| Violet só para CTA "Acesso Empresa" no header | Diferencia o fluxo empresa do fluxo cliente sem fragmentar a paleta | 2026-04-12 |
| Radius principal = rounded-xl (12px) | Moderno sem ser excessivamente arredondado | 2026-04-12 |
| Altura de botão/input = h-11 (44px) | Touch-friendly, consistente em todas as telas | 2026-04-12 |
