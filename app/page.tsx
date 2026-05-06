"use client"

import React, { useEffect, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Shield,
  BarChart3,
  Truck,
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Package,
  Award,
  ClipboardList,
  Search,
  Clock,
  ChevronRight,
  Zap,
  Lock,
  Globe,
  TrendingDown,
  Play,
  Loader2,
} from "lucide-react"
import { Header } from "@/components/header"
import { useCliente } from "@/contexts/cliente-context"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ModalAllModules } from "@/components/modal-all-modules"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "12.000+", label: "Consultas processadas" },
  { value: "98%", label: "Taxa de precisão" },
  { value: "65%", label: "Redução de incidentes" },
  { value: "24/7", label: "Monitoramento ativo" },
]

const features = [
  {
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Gestão de Riscos",
    description:
      "Biometria facial, análise de perfil e alertas preditivos 24/7 para proteção máxima do seu patrimônio.",
    tags: ["Biometria Facial", "Alertas Preditivos", "Perfil de Motorista"],
  },
  {
    icon: Activity,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Gestão Operacional",
    description:
      "Roteirização inteligente, controle de jornada e manutenção preventiva ponta a ponta.",
    tags: ["Telemetria", "Controle de Jornada", "Roteirização"],
  },
  {
    icon: Truck,
    color: "text-orange-600",
    bg: "bg-orange-50",
    title: "Marketplace Seguro",
    description:
      "Ecossistema de fretes com motoristas validados, auditoria constante e conformidade total.",
    tags: ["Validação Cadastral", "Auditoria", "Rating"],
  },
  {
    icon: BarChart3,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "BI & Inteligência",
    description:
      "Dashboards executivos com KPIs de risco, ROI e performance para decisões de alto impacto.",
    tags: ["KPIs Executivos", "Análise de ROI", "Relatórios"],
  },
]

const plans = [
  {
    key: "basic" as const,
    name: "Starter",
    price: "R$ 197",
    annualPrice: "R$ 157",
    annualSaving: "R$ 480",
    period: "/mês",
    sub: "1 usuário · Até 30 motoristas",
    highlight: false,
    badge: null,
    eyebrow: "Para começar com estrutura",
    features: [
      "Checklist digital — elimine papel e retrabalho",
      "Monitoramento básico de frota em tempo real",
      "Gestão de motoristas (até 30)",
      "Marketplace de fretes",
      "Suporte via chat",
    ],
    btnLabel: "Testar grátis por 7 dias",
    action: "checkout" as const,
  },
  {
    key: "standard" as const,
    name: "Growth",
    price: "R$ 670",
    annualPrice: "R$ 536",
    annualSaving: "R$ 1.608",
    period: "/mês",
    sub: "Motoristas ilimitados · Até 10 usuários",
    highlight: true,
    badge: "Mais Popular",
    eyebrow: "Para quem quer resultados reais",
    features: [
      "Tudo do Starter",
      "Validação biométrica — bloqueie fraudes antes do embarque",
      "BI de sinistralidade — veja onde está perdendo dinheiro",
      "Alertas WhatsApp — reaja antes que vire prejuízo",
      "Manutenção preventiva — evite paradas inesperadas",
      "KPIs exclusivos de performance",
      "Suporte prioritário 24/7",
    ],
    btnLabel: "Começar teste grátis",
    action: "checkout" as const,
  },
  {
    key: "professional" as const,
    name: "Enterprise",
    price: "Sob consulta",
    annualPrice: "Sob consulta",
    annualSaving: "",
    period: "",
    sub: "Grandes frotas · Embarcadores",
    highlight: false,
    badge: null,
    eyebrow: "Para operações de grande escala",
    features: [
      "Tudo do Growth",
      "API REST (Totvs, SAP, Oracle)",
      "Dashboard CEO View — visão executiva consolidada",
      "Gerente de sucesso dedicado",
      "Módulos customizados para sua operação",
      "Consultoria de implantação inclusa",
      "SLA de resposta crítica",
    ],
    btnLabel: "Agendar demonstração",
    action: "contact" as const,
  },
]

const steps = [
  {
    num: "01",
    icon: Users,
    title: "Conecte sua frota",
    description:
      "Integre motoristas e veículos em minutos. Nossa API conecta com seu TMS/ERP sem fricção.",
  },
  {
    num: "02",
    icon: Shield,
    title: "Ative a prevenção",
    description:
      "Alertas automáticos e biometria identificam riscos antes que virem prejuízos.",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Escale com dados",
    description:
      "Tome decisões baseadas em KPIs reais e reduza perdas financeiras consistentemente.",
  },
]

const testimonials = [
  {
    text: "Reduzimos incidentes em 65% e conseguimos prevenir problemas antes que aconteçam. O MovixFlow mudou nossa operação.",
    name: "Carlos Silva",
    role: "Diretor Operacional",
    company: "TransLog Transportes",
    initials: "CS",
  },
  {
    text: "Os alertas automáticos nos salvaram de prejuízos enormes. Encontramos motoristas confiáveis rapidamente.",
    name: "Marina Santos",
    role: "Gerente de Risco",
    company: "Cargo Express",
    initials: "MS",
  },
  {
    text: "Nossa operação ficou 40% mais segura. Um investimento que se paga no primeiro mês de uso.",
    name: "Roberto Oliveira",
    role: "CEO",
    company: "LogiMaster",
    initials: "RO",
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL ?? ""

export default function MovixFlowLanding() {
  const { isClienteLogado, clienteData } = useCliente()
  const [showModulesModal, setShowModulesModal] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [billingAnnual, setBillingAnnual] = useState(false)

  const handleCheckout = useCallback(async (plan: "basic" | "standard", empresaId?: string) => {
    setCheckoutLoading(plan)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, empresaId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error ?? "Erro ao iniciar pagamento. Tente novamente.")
      }
    } catch {
      alert("Erro ao iniciar pagamento. Tente novamente.")
    } finally {
      setCheckoutLoading(null)
    }
  }, [])

  // Retorno do frontend após login: ?plan=X&empresaId=Y → inicia checkout automaticamente
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const plan = params.get("plan") as "basic" | "standard" | null
    const empresaId = params.get("empresaId")
    if (plan && empresaId && (plan === "basic" || plan === "standard")) {
      // Limpa os params da URL antes de iniciar
      window.history.replaceState({}, "", window.location.pathname)
      handleCheckout(plan, empresaId)
    }
  }, [handleCheckout])

  const handlePlanClick = (plan: "basic" | "standard") => {
    // Usuário já logado na landing page → checkout direto
    if (isClienteLogado && clienteData?.idEmpresa) {
      handleCheckout(plan, clienteData.idEmpresa)
      return
    }
    // Não logado → redireciona para o cadastro do frontend com returnUrl
    const returnUrl = typeof window !== "undefined" ? window.location.origin : ""
    const registerUrl = `${FRONTEND_URL}/cadastro?plan=${plan}&returnUrl=${encodeURIComponent(returnUrl)}`
    window.location.href = registerUrl
  }

  // ── Cliente logado: dashboard simplificado ──────────────────────────────────
  if (isClienteLogado && clienteData) {
    return (
      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <p className="text-sm font-semibold text-blue-600 mb-1">Bem-vindo de volta</p>
            <h1 className="text-3xl font-black text-gray-900">
              Olá, {clienteData.nome.split(" ")[0]}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {clienteData.tipo === "PF" ? "Pessoa Física" : "Empresa"} ·{" "}
              {clienteData.statusAcesso === "PENDENTE"
                ? "Cadastro em análise"
                : "Acesso ativo"}
            </p>
          </motion.div>

          {clienteData.statusAcesso === "PENDENTE" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4"
            >
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-semibold text-sm">
                  Cadastro em análise
                </p>
                <p className="text-amber-700 text-sm mt-0.5">
                  Sua conta está sendo verificada. Assim que aprovada você terá
                  acesso completo à plataforma.
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {[
              {
                icon: ClipboardList,
                title: "Solicitar Consulta de Risco",
                desc: "Inicie uma nova análise para condutores ou veículos de forma rápida.",
                href: "/solicitar-consulta",
                accent: "blue",
              },
              {
                icon: Search,
                title: "Acompanhar Consultas",
                desc: "Acompanhe o status das suas solicitações e pareceres em tempo real.",
                href: "/acompanhar",
                accent: "indigo",
              },
            ].map((card) => {
              const isPendente = clienteData.statusAcesso === "PENDENTE"
              const colorMap: Record<string, string> = {
                blue: "text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white",
                indigo: "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white",
              }
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  {isPendente ? (
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 opacity-50 cursor-not-allowed h-full flex flex-col">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all",
                          card.accent === "blue"
                            ? "text-blue-400 bg-blue-50"
                            : "text-indigo-400 bg-indigo-50"
                        )}
                      >
                        <card.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-400 mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed flex-1">
                        {card.desc}
                      </p>
                      <p className="text-amber-500 text-xs font-semibold mt-4 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Disponível após aprovação
                      </p>
                    </div>
                  ) : (
                    <Link href={card.href} className="group block h-full">
                      <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all h-full flex flex-col">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all",
                            colorMap[card.accent]
                          )}
                        >
                          <card.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {card.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed flex-1">
                          {card.desc}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-semibold mt-5 flex items-center gap-1 group-hover:gap-2 transition-all",
                            card.accent === "blue" ? "text-blue-600" : "text-indigo-600"
                          )}
                        >
                          Acessar <ArrowRight className="w-4 h-4" />
                        </p>
                      </div>
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Plataforma
                </p>
                <h2 className="text-2xl font-black text-white mb-1">
                  Mantenha sua operação segura
                </h2>
                <p className="text-gray-400 text-sm">
                  Valide motoristas e veículos antes de cada embarque.
                </p>
              </div>
              {clienteData.statusAcesso === "PENDENTE" ? (
                <Button
                  disabled
                  className="bg-white/10 text-white/40 font-bold rounded-xl px-6 py-3 shrink-0 cursor-not-allowed"
                >
                  <Clock className="w-4 h-4 mr-2" /> Aguardando aprovação
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl px-6 py-3 shrink-0 shadow-lg"
                >
                  <Link href="/solicitar-consulta">
                    <Shield className="w-4 h-4 mr-2 text-blue-600" /> Nova Validação
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Landing page pública ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-0 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-[-200px] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tag topo */}
          <FadeIn>
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 border border-blue-100 bg-blue-50 px-4 py-2 rounded-full">
                <Zap className="w-3.5 h-3.5" />
                Plataforma B2B para Transporte & Logística
              </span>
            </div>
          </FadeIn>

          {/* Layout 2 colunas */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Coluna esquerda: texto ── */}
            <div>
              <FadeIn delay={0.06}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-gray-900 mb-6">
                  Gestão de{" "}
                  <span className="text-blue-600">Riscos</span>{" "}
                  e{" "}
                  <span className="relative">
                    <span className="relative z-10">Logística</span>
                    <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue-100 -z-0 rounded" />
                  </span>
                  {" "}em uma só plataforma.
                </h1>
              </FadeIn>

              <FadeIn delay={0.12}>
                <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                  Valide motoristas com biometria, monitore operações em tempo real e tome decisões estratégicas com BI executivo — tudo integrado para transportadoras.
                </p>
              </FadeIn>

              {/* Dois pilares em destaque */}
              <FadeIn delay={0.16}>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-white" />
                      </div>
                      <p className="text-sm font-bold text-blue-900">Gestão de Riscos</p>
                    </div>
                    <p className="text-xs text-blue-700/70 leading-relaxed">
                      Biometria facial, alertas preditivos e validação 24/7
                    </p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-3.5 h-3.5 text-white" />
                      </div>
                      <p className="text-sm font-bold text-indigo-900">Gestão Logística</p>
                    </div>
                    <p className="text-xs text-indigo-700/70 leading-relaxed">
                      Roteirização, telemetria, fretes e controle de jornada
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-6 h-auto rounded-xl shadow-lg shadow-blue-200/60 transition-all hover:-translate-y-0.5"
                    onClick={() => {
                      document
                        .getElementById("contato")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Solicitar demonstração
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-base px-8 py-6 h-auto rounded-xl transition-all"
                    asChild
                  >
                    <a href="#beneficios">
                      Ver como funciona
                    </a>
                  </Button>
                </div>
              </FadeIn>

              {/* Trust bar */}
              <FadeIn delay={0.26}>
                <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-gray-400">
                  {[
                    { icon: CheckCircle2, label: "12.000+ consultas processadas" },
                    { icon: ShieldCheck, label: "98% de precisão" },
                    { icon: Zap, label: "Ativo em 24h" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <t.icon className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">{t.label}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* ── Coluna direita: dashboard dark ── */}
            <FadeIn delay={0.18}>
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-blue-400/10 blur-[60px] rounded-3xl -z-10" />

                {/* Dashboard card */}
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-300/30">
                  <Image
                    src="/dashboard-showcase.png"
                    alt="Dashboard MovixFlow — Gestão de Riscos e Logística em tempo real"
                    width={1200}
                    height={750}
                    priority
                    className="w-full h-auto block"
                  />
                </div>

                {/* Floating badge */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-xl items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Incidentes reduzidos</p>
                    <p className="text-emerald-600 font-black text-lg leading-none">−65%</p>
                  </div>
                </div>

                <div className="hidden sm:flex absolute -top-4 -right-4 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-xl items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Scan className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Biometria ativa</p>
                    <p className="text-blue-600 font-black text-sm leading-none">24/7</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-gray-100 py-12 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
                    {s.value}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="beneficios" className="py-16 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 block">
                Como funciona
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Três passos para uma operação segura
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Do cadastro ao resultado em minutos. Sem complexidade, sem
                treinamentos longos.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-blue-100 hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-blue-200">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-5xl font-black text-gray-100 select-none">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-28 px-4 bg-gray-50/60">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 block">
                  Soluções
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  Tudo que sua transportadora
                  <br />
                  precisa para{" "}
                  <span className="text-blue-600">performar</span>
                </h2>
                <p className="text-gray-500 text-lg max-w-lg">
                  Módulos integrados criados por quem entende de chão de fábrica
                  e logística nacional.
                </p>
              </div>
              <Button
                variant="outline"
                className="shrink-0 border-gray-300 text-gray-700 hover:bg-white font-bold rounded-xl px-6 py-3 h-auto"
                onClick={() => setShowModulesModal(true)}
              >
                Ver todos os módulos <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105",
                      f.bg
                    )}
                  >
                    <f.icon className={cn("w-6 h-6", f.color)} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {f.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {f.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BI SHOWCASE ── */}
      <section className="py-20 lg:py-28 px-4 bg-gray-900 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeIn>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 block">
                  Business Intelligence
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                  Visão estratégica para decisões de alto impacto
                </h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                  Não apenas dados — insights que protegem sua rentabilidade.
                  Consolide indicadores de risco e performance para antecipar
                  incidentes com precisão.
                </p>
                <div className="space-y-5">
                  {[
                    {
                      title: "Predição de Prejuízos",
                      desc: "Antecipe zonas de sinistralidade antes do embarque.",
                    },
                    {
                      title: "Control Room Executivo",
                      desc: "KPIs consolidados para diretores e CEOs.",
                    },
                    {
                      title: "Gestão Proativa",
                      desc: "Elimine gargalos e previna ociosidade da frota.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">
                          {item.title}
                        </p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full -z-10" />
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white text-sm font-bold">
                      Performance Semanal
                    </p>
                    <span className="text-[11px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      ↑ 12% este mês
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Risco Baixo", pct: "74%", color: "bg-emerald-500" },
                      { label: "Risco Médio", pct: "18%", color: "bg-amber-500" },
                      { label: "Risco Alto", pct: "8%", color: "bg-red-500" },
                    ].map((b) => (
                      <div
                        key={b.label}
                        className="bg-white/5 border border-white/5 rounded-xl p-4 text-center"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center",
                            b.color + "/20"
                          )}
                        >
                          <div
                            className={cn("w-3 h-3 rounded-full", b.color)}
                          />
                        </div>
                        <p className="text-white font-black text-xl">{b.pct}</p>
                        <p className="text-white/40 text-[10px] font-semibold mt-0.5">
                          {b.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <p className="text-white/40 text-[11px] font-semibold mb-3">
                      Evolução de Consultas
                    </p>
                    <div className="flex items-end gap-1.5 h-16">
                      {[40, 65, 50, 80, 60, 90, 75, 95, 70, 85, 65, 100].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-blue-500/60 rounded-t-sm"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-16 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 block">
                Depoimentos
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Quem confia no MovixFlow
              </h2>
              <p className="text-gray-500 text-lg">
                Líderes do setor que transformaram sua logística conosco.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-gray-200 hover:shadow-lg transition-all flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 flex-1">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 lg:py-28 px-4 bg-gray-50/60 overflow-hidden">
        <div className="max-w-6xl mx-auto">

          {/* Âncora de preço */}
          <FadeIn>
            <div className="flex justify-center mb-14">
              <div className="inline-flex items-start sm:items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 text-sm text-amber-800 font-medium max-w-2xl">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5 sm:mt-0" />
                <span>
                  Uma única falha operacional pode custar mais de{" "}
                  <strong>R$&nbsp;5.000</strong>. O MovixFlow previne isso
                  diariamente — por menos do que uma avaria de pneu.
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Cabeçalho */}
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 block">
                Planos & Preços
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Invista menos do que um sinistro custa
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">
                Comece grátis. Sem cartão de crédito. Cancele quando quiser.
              </p>
            </div>
          </FadeIn>

          {/* Toggle mensal / anual */}
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className={cn("text-sm font-medium transition-colors", !billingAnnual ? "text-gray-900" : "text-gray-400")}>
                Mensal
              </span>
              <button
                type="button"
                aria-label="Alternar faturamento anual"
                onClick={() => setBillingAnnual(!billingAnnual)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  billingAnnual ? "bg-blue-600" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                    billingAnnual ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
              <span className={cn("text-sm font-medium flex items-center gap-2 transition-colors", billingAnnual ? "text-gray-900" : "text-gray-400")}>
                Anual
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  −20%
                </span>
              </span>
            </div>
          </FadeIn>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div
                  className={cn(
                    "relative bg-white rounded-2xl border-2 p-8 flex flex-col h-full transition-all",
                    plan.highlight
                      ? "border-blue-600 shadow-2xl shadow-blue-100 lg:-mt-5"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
                  )}
                >
                  {/* Badge flutuante */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-lg shadow-blue-200 whitespace-nowrap">
                        <Zap className="w-3 h-3" />
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Eyebrow */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    {plan.eyebrow}
                  </p>

                  {/* Nome do plano */}
                  <h3 className="text-xl font-black text-gray-900 mb-5">{plan.name}</h3>

                  {/* Preço */}
                  <div className="mb-1 min-h-[56px] flex items-end">
                    {plan.price === "Sob consulta" ? (
                      <span className="text-2xl font-black text-gray-800">Sob consulta</span>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-black text-gray-900 leading-none">
                          {billingAnnual ? plan.annualPrice : plan.price}
                        </span>
                        <span className="text-gray-400 font-medium text-sm pb-1">/mês</span>
                      </div>
                    )}
                  </div>

                  {/* Economia anual */}
                  <div className="h-5 mb-2">
                    {plan.annualSaving && billingAnnual && (
                      <p className="text-xs text-emerald-600 font-semibold">
                        Cobrado anualmente · Você economiza {plan.annualSaving}/ano
                      </p>
                    )}
                  </div>

                  <p className="text-gray-400 text-xs font-medium mb-8">{plan.sub}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat, j) => (
                      <li
                        key={j}
                        className={cn(
                          "flex items-start gap-2.5 text-sm",
                          feat === "Tudo do Starter" || feat === "Tudo do Growth"
                            ? "text-blue-600 font-semibold"
                            : "text-gray-600"
                        )}
                      >
                        <CheckCircle2
                          className={cn(
                            "w-4 h-4 mt-0.5 shrink-0",
                            feat === "Tudo do Starter" || feat === "Tudo do Growth"
                              ? "text-blue-500"
                              : plan.highlight
                              ? "text-blue-600"
                              : "text-gray-400"
                          )}
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.action === "checkout" ? (
                    <button
                      type="button"
                      disabled={checkoutLoading === plan.key}
                      onClick={() => handlePlanClick(plan.key as "basic" | "standard")}
                      className={cn(
                        "w-full rounded-xl font-bold py-3.5 text-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed",
                        plan.highlight
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                          : "bg-gray-900 hover:bg-black text-white"
                      )}
                    >
                      {checkoutLoading === plan.key ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Aguarde…
                        </>
                      ) : (
                        <>
                          {plan.btnLabel}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <a
                      href="#contato"
                      className="w-full rounded-xl font-bold py-3.5 text-sm transition-all cursor-pointer text-white flex items-center justify-center gap-2 bg-gray-900 hover:bg-black"
                    >
                      {plan.btnLabel}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}

                  {/* Nota de trial */}
                  {plan.action === "checkout" && (
                    <p className="text-center text-xs text-gray-400 mt-3">
                      7 dias grátis · Sem cartão de crédito
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Reversão de risco */}
          <FadeIn delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>7 dias grátis, sem cartão</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Sem contrato de fidelidade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Cancele quando quiser, sem multa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Suporte humano em todos os planos</span>
              </div>
            </div>
          </FadeIn>

          {/* Nota de uso variável */}
          <FadeIn delay={0.3}>
            <p className="text-center text-xs text-gray-400 mt-6 max-w-lg mx-auto">
              * Consultas de risco (validação biométrica e score de motorista) são cobradas por uso — somente quando utilizadas.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-28 px-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "O que é gestão de riscos logísticos?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Gestão de riscos logísticos é o conjunto de práticas e tecnologias para identificar, avaliar e mitigar ameaças à operação de transporte rodoviário. Inclui validação de motoristas, monitoramento de frotas em tempo real, controle de jornada e análise preditiva de sinistros. Transportadoras que adotam gestão estruturada de riscos reduzem incidentes em até 65% no primeiro ano.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Como funciona a validação biométrica de motoristas?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A validação biométrica usa reconhecimento facial para confirmar que o motorista que inicia a viagem é quem está cadastrado e autorizado. No momento do embarque, o motorista faz uma selfie que é comparada com a foto registrada no cadastro. O sistema verifica também a validade da CNH, histórico de infrações e score de risco antes de liberar o embarque.",
                  },
                },
                {
                  "@type": "Question",
                  name: "O MovixFlow integra com TMS e ERP?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sim. O MovixFlow oferece API REST para integração com os principais sistemas TMS e ERP do mercado brasileiro, incluindo Totvs, SAP e Oracle. A integração permite sincronização automática de motoristas, rotas, documentos e KPIs de risco. O plano Professional inclui suporte dedicado de implantação e customização da integração.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Qual a diferença entre motorista de frota, agregado e autônomo?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Motorista de frota é funcionário CLT da transportadora e opera veículo da empresa. Motorista agregado é proprietário do próprio veículo e trabalha em regime de parceria com a transportadora. Motorista autônomo (TAC) é contratado por viagem, sem vínculo fixo. O MovixFlow gerencia os três perfis com processos de validação e monitoramento adaptados para cada tipo.",
                  },
                },
                {
                  "@type": "Question",
                  name: "O MovixFlow está em conformidade com a LGPD?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sim. O MovixFlow trata dados pessoais e biométricos de motoristas em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018). Os dados são coletados com base legal de execução de contrato e legítimo interesse de segurança, armazenados com criptografia e acessíveis apenas por usuários autorizados. Consulte nossa Política de Privacidade para detalhes.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Quanto custa o MovixFlow?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "O MovixFlow tem três planos: Basic (R$ 67/mês para 1 usuário e até 50 motoristas), Standard (R$ 670/mês para 10 usuários e motoristas ilimitados) e Professional (sob consulta para embarcadores com volume ilimitado e integração API). Não há taxa de setup e o contrato pode ser cancelado a qualquer momento.",
                  },
                },
              ],
            }),
          }}
        />
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 block">
                Perguntas frequentes
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Dúvidas sobre o MovixFlow
              </h2>
              <p className="text-gray-500 text-lg">
                Respostas rápidas para as perguntas mais comuns de gestores e transportadoras.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {[
              {
                q: "O que é gestão de riscos logísticos?",
                a: "Gestão de riscos logísticos é o conjunto de práticas e tecnologias para identificar, avaliar e mitigar ameaças à operação de transporte. Inclui validação de motoristas, monitoramento de frotas em tempo real, controle de jornada e análise preditiva de sinistros. Transportadoras que adotam gestão estruturada de riscos reduzem incidentes em até 65% no primeiro ano.",
              },
              {
                q: "Como funciona a validação biométrica de motoristas?",
                a: "A validação usa reconhecimento facial para confirmar que o motorista autorizado está conduzindo. No embarque, o motorista faz uma selfie comparada ao cadastro. O sistema verifica CNH, histórico de infrações e score de risco antes de liberar o embarque — eliminando documentos fraudulentos e o uso de terceiros.",
              },
              {
                q: "O MovixFlow integra com TMS e ERP?",
                a: "Sim. Oferecemos API REST para integração com os principais sistemas do mercado brasileiro, incluindo Totvs, SAP e Oracle. A integração sincroniza motoristas, rotas, documentos e KPIs de risco automaticamente. O plano Professional inclui suporte dedicado de implantação.",
              },
              {
                q: "O MovixFlow está em conformidade com a LGPD?",
                a: "Sim. Tratamos dados pessoais e biométricos em conformidade com a Lei 13.709/2018 (LGPD). Os dados são coletados com base legal adequada, armazenados com criptografia e acessíveis apenas por usuários autorizados. Mantemos política de privacidade detalhada e DPO disponível para consulta.",
              },
              {
                q: "Quanto custa e como funciona o cancelamento?",
                a: "O Basic custa R$ 67/mês (1 usuário, até 50 motoristas) e o Standard R$ 670/mês (10 usuários, ilimitado). Não há taxa de setup, nem contrato de fidelidade — cancele quando quiser sem multa. O plano Professional é sob consulta para embarcadores com volume ilimitado.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-gray-200 hover:shadow-md transition-all">
                  <h3 className="text-base font-bold text-gray-900 mb-3">{item.q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section id="contato" className="py-16 lg:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="bg-gray-900 rounded-2xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/10 pointer-events-none" />
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-5 block">
                  Comece hoje
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
                  Inteligência que protege.
                  <br />
                  Eficiência que escala.
                </h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
                  Assuma o controle da sua transportadora. Reduza riscos e
                  maximize resultados com o MovixFlow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-4 h-auto rounded-xl text-base shadow-lg transition-all"
                    asChild
                  >
                    <Link href="/contato">
                      Agendar reunião estratégica
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-white/10 font-bold px-8 py-4 h-auto rounded-xl text-base transition-all border border-white/10"
                    asChild
                  >
                    <a
                      href="https://wa.me/5563992748276?text=Olá! Gostaria de falar com um especialista MovixFlow."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Falar com especialista
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />

      <ModalAllModules
        isOpen={showModulesModal}
        onClose={() => setShowModulesModal(false)}
      />
    </div>
  )
}
