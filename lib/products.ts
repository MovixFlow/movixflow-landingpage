export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  badge?: string
  popular?: boolean
}

// This is the source of truth for all products/plans
// All UI to display products should pull from this array
// IDs passed to the checkout session should be the same as IDs from this array
export const PRODUCTS: Product[] = [
  {
    id: "basic-plan",
    name: "Basic",
    description: "Ideal para pequenas operações ou transportadoras iniciando a gestão de riscos",
    priceInCents: 33500, // R$ 335,00
    features: [
      "Até 5 usuários",
      "Monitoramento básico em tempo real",
      "Relatórios mensais de incidentes",
      "Suporte por e-mail",
      "Perfeito para iniciantes",
    ],
  },
  {
    id: "professional-plan",
    name: "Profissional",
    description: "Para equipes de até 10 usuários que precisam de automação e controle completo",
    priceInCents: 59000, // R$ 590,00
    badge: "Mais Escolhido",
    popular: true,
    features: [
      "Até 10 usuários (R$ 59 por usuário - 12% de desconto)",
      "Dashboards em tempo real",
      "Monitoramento automatizado",
      "Alertas via WhatsApp",
      "Suporte prioritário",
      "Plano mais escolhido por transportadoras",
    ],
  },
  {
    id: "enterprise-plan",
    name: "Enterprise",
    description: "Para empresas com grande volume de motoristas e operações complexas",
    priceInCents: 119000, // R$ 1.190,00
    features: [
      "Usuários ilimitados",
      "Valor ajustável conforme operação",
      "Todos os recursos do Profissional",
      "API customizada e integração com ERP",
      "Consultoria dedicada para implementação",
      "Suporte premium 24h",
      "Soluções personalizadas para grandes operações",
    ],
  },
]

// Helper function to format price in BRL
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100)
}
