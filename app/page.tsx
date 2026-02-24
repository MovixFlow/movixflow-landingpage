"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield,
  BarChart3,
  Truck,
  Star,
  ArrowRight,
  Bell,
  FileCheck,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Lock,
  ShieldCheck,
  TrendingDown,
  Package,
  MessageCircle,
} from "lucide-react"
import { Header } from "@/components/header"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { ModalAllModules } from "@/components/modal-all-modules"

export default function MovixFlowLanding() {
  const router = useRouter()
  const { isLoggedIn } = useUser()
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showModulesModal, setShowModulesModal] = useState(false)


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleTalkToSpecialist = () => {
    // Scroll to contact section
    const contactSection = document.getElementById("contato")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const whyChooseBenefits = [
    {
      icon: Shield,
      title: "Gestão de Riscos",
      description: "Monitoramento 24/7 com alertas inteligentes",
      color: "bg-blue-100 text-blue-800",
    },
    {
      icon: Truck,
      title: "Anúncio de Fretes",
      description: "Publique e gerencie com segurança",
      color: "bg-orange-100 text-orange-800",
    },
    {
      icon: AlertTriangle,
      title: "Alertas de Risco",
      description: "Notificações automáticas em tempo real",
      color: "bg-red-100 text-red-800",
    },
    {
      icon: Activity,
      title: "Monitoramento Real-Time",
      description: "Visibilidade total das operações",
      color: "bg-green-100 text-green-800",
    },
    {
      icon: Scan,
      title: "Validação Biométrica",
      description: "Reconhecimento facial seguro",
      color: "bg-cyan-100 text-cyan-800",
    },
    {
      icon: BarChart3,
      title: "Análise Preditiva",
      description: "BI avançado para prevenir problemas",
      color: "bg-indigo-100 text-indigo-800",
    },
  ]

  const testimonials = [
    {
      name: "Carlos Silva",
      company: "TransLog Transportes",
      text: "Reduzimos incidentes em 65% e conseguimos prevenir problemas antes que aconteçam.",
      rating: 5,
      logo: "TL",
    },
    {
      name: "Marina Santos",
      company: "Cargo Express",
      text: "Os alertas automáticos nos salvaram de prejuízos enormes. Encontramos motoristas confiáveis rapidamente.",
      rating: 5,
      logo: "CE",
    },
    {
      name: "Roberto Oliveira",
      company: "LogiMaster",
      text: "Nossa operação ficou 40% mais segura. Investimento que se paga rapidamente.",
      rating: 5,
      logo: "LM",
    },
  ]

  const integrations = [
    { icon: Bell, title: "Alertas Inteligentes", description: "Notificações em tempo real" },
    { icon: Activity, title: "Telemetria Avançada", description: "Monitoramento contínuo" },
    { icon: Shield, title: "Validação de Segurança", description: "Verificação automatizada" },
    { icon: BarChart3, title: "Análise Preditiva", description: "Prevenção baseada em dados" },
    { icon: Scan, title: "Reconhecimento Facial", description: "Autenticação biométrica" },
    { icon: Truck, title: "Gestão de Fretes", description: "Controle de cargas" },
  ]

  const riskTypes = [
    {
      icon: Shield,
      title: "Gestão de Riscos",
      description: "Prevenção ativa com biometria facial, análise de perfil e alertas preditivos 24/7 para máxima segurança patrimonial.",
      color: "from-blue-600 to-indigo-600",
      features: ["Biometria Facial", "Alertas Preditivos", "Perfil de Motorista"]
    },
    {
      icon: Activity,
      title: "Gestão Operacional",
      description: "Eficiência ponta a ponta, desde a roteirização inteligente até o controle de jornada e manutenção preventiva.",
      color: "from-emerald-500 to-teal-600",
      features: ["Telemetria Integrada", "Controle de Jornada", "Roteirização Otimizada"]
    },
    {
      icon: Truck,
      title: "Marketplace Seguro",
      description: "Ecossistema de fretes com motoristas previamente validados, auditoria constante e conformidade total.",
      color: "from-orange-500 to-amber-600",
      features: ["Validação Cadastral", "Auditoria de Cargas", "Rating de Segurança"]
    },
    {
      icon: BarChart3,
      title: "Inteligência de Dados & BI",
      description: "Dashboards de alto nível para CEOs e Diretores tomarem decisões baseadas em ROI, segurança e performance.",
      color: "from-purple-600 to-pink-600",
      features: ["KPIs Executivos", "Análise de ROI", "Relatórios de Incidentes"]
    }
  ]

  const howItWorks = [
    {
      step: "01",
      title: "Antecipe",
      description: "Conecte sua frota e mapeie perfis de risco com nossa inteligência preditiva avançada.",
      icon: Users
    },
    {
      step: "02",
      title: "Previna",
      description: "Monitore em tempo real com alertas automáticos que evitam incidentes antes que eles ocorram.",
      icon: Shield
    },
    {
      step: "03",
      title: "Lucre",
      description: "Analise KPIs estratégicos e reduza perdas financeiras com uma operação otimizada e segura.",
      icon: TrendingUp
    }
  ]

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Header />

      {/* Hero Section - Focused B2B */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-8 border border-blue-100 backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">SaaS Logístico Inteligente</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-gray-900 mb-8 tracking-tight leading-[0.9]">
              Prevenção ativa e <span className="text-blue-600">eficiência</span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent text-[0.8em]">
                a inteligência que antecipa incidentes
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed font-medium">
              Transforme sua gestão logística com a única plataforma que integra monitoramento inteligente e análise preditiva de riscos. Reduza prejuízos e assuma o controlestrategico da sua frota.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-8 h-auto rounded-2xl shadow-2xl shadow-blue-200/50 transition-all hover:scale-105 active:scale-95 group"
                onClick={handleTalkToSpecialist}
              >
                Solicitar Demonstração Executiva
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-xl px-12 py-8 h-auto rounded-2xl transition-all font-bold"
                asChild
              >
                <a href="#beneficios">Ver Soluções de Risco</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-blue-900 rounded-[2.5rem] shadow-3xl overflow-hidden border-[8px] border-white ring-1 ring-gray-200">
              {/* Dashboard Preview / BI Mockup Area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 font-black text-4xl uppercase tracking-widest">Dashboard Executivo Preview</div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-2xl backdrop-blur-xl border border-white/10" />
                <div className="absolute bottom-10 right-10 w-48 h-32 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10" />
                <div className="absolute top-1/2 right-20 w-12 h-64 bg-green-500/20 rounded-full blur-3xl" />
              </div>
            </div>
            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <span className="text-2xl font-bold">TJ GERENCIAMENTO DE RISCOS</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Como Funciona - Clean 3 Steps */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Inteligência em 3 passos</h2>
            <p className="text-xl text-gray-600">Simplicidade para gerenciar complexidade logística</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -translate-y-1/2 -z-10" />

            {howItWorks.map((item, index) => (
              <div key={index} className="relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                <div className="absolute -top-4 -right-4 text-6xl font-black text-gray-100 -z-10 select-none">{item.step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Macro Pilares - Strategic Blocks */}
      <section id="beneficios" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Tudo o que sua transportadora precisa para <span className="text-blue-600">performar</span>
              </h2>
              <p className="text-xl text-gray-600">Módulos integrados criados por quem entende de chão de fábrica e logística nacional.</p>
            </div>
            <Button
              size="lg"
              className="bg-gray-900 hover:bg-black text-white px-8 py-6 h-auto rounded-xl"
              onClick={() => setShowModulesModal(true)}
            >
              Explorar Todos os Módulos
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {riskTypes.map((pilar, index) => (
              <div key={index} className="group relative overflow-hidden rounded-[2.5rem] p-12 bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${pilar.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full`} />

                <div className={`w-20 h-20 bg-gradient-to-br ${pilar.color} rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-blue-100 group-hover:rotate-6 transition-transform`}>
                  <pilar.icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-6">{pilar.title}</h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-md">{pilar.description}</p>

                <div className="flex flex-wrap gap-3">
                  {pilar.features.map((feat, i) => (
                    <span key={i} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-semibold border border-gray-100">{feat}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prova Social / Testemunhos - Premium */}
      <section id="depoimentos" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Quem confia no MovixFlow</h2>
            <p className="text-xl text-gray-600">Líderes do setor que transformaram sua logística conosco.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, star) => (
                    <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 mb-10 font-medium italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-8 border-t border-gray-200">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {t.logo}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-blue-600 font-semibold text-sm">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BI / Inteligência Showcase */}
      <section className="py-32 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">
                Visão Estratégica para <span className="text-blue-400">Decisões de Alto Impacto</span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Não apenas dados, mas insights que protegem sua rentabilidade. Nosso BI Executivo consolida indicadores de risco global e performance, permitindo que gestores antecipem incidentes com precisão cirúrgica.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Predição de Prejuízos", desc: "Antecipe zonas de sinistralidade antes do embarque e proteja sua margem." },
                  { title: "Control Room Executivo", desc: "Visão consolidada para diretores e CEOs com KPIs de performance e risco." },
                  { title: "Gestão Proativa", desc: "Notificações inteligentes que eliminam gargalos e previnem ociosidade da frota." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 hover:scale-[1.02] transition-transform duration-700">
                {/* Visual Representation of BI charts */}
                <div className="space-y-6">
                  <div className="h-4 w-1/3 bg-white/20 rounded-full" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 bg-blue-500/40 rounded-2xl animate-pulse" />
                    <div className="h-32 bg-indigo-500/40 rounded-2xl animate-pulse delay-75" />
                    <div className="h-32 bg-purple-500/40 rounded-2xl animate-pulse delay-150" />
                  </div>
                  <div className="h-48 bg-white/10 rounded-2xl border border-white/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Pro Focus */}
      <section id="pricing" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Investimento que se paga</h2>
            <p className="text-xl text-gray-600">Planos escaláveis para frotas de todos os tamanhos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Professional (Focus) */}
            <div className="md:col-span-1 order-2 md:order-1">
              <div className="border border-gray-200 p-10 rounded-[2.5rem] h-full flex flex-col hover:border-blue-200 transition-colors">
                <h3 className="text-2xl font-bold mb-4">Essencial</h3>
                <div className="mb-8">
                  <span className="text-5xl font-black text-gray-900">R$ 335</span>
                  <span className="text-gray-500 text-xl">/mês</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {["Até 5 usuários", "Monitoramento Real-time", "Gestão de Motoristas", "Suporte via E-mail"].map((f, i) => (
                    <li key={i} className="flex gap-3 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full py-6 rounded-2xl border-2 font-bold">Assinar Plano</Button>
              </div>
            </div>

            <div className="md:col-span-1 order-1 md:order-2 scale-110 relative z-10">
              <div className="bg-blue-600 p-10 rounded-[2.5rem] h-full flex flex-col shadow-2xl shadow-blue-300 text-white">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-blue-900 font-bold px-6 py-2 rounded-full text-sm">MAIS ESCOLHIDO</div>
                <h3 className="text-2xl font-bold mb-4">Profissional</h3>
                <div className="mb-8">
                  <span className="text-5xl font-black">R$ 590</span>
                  <span className="text-blue-100 text-xl">/mês</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {["Até 10 usuários", "BI Operacional Completo", "Alertas via WhatsApp", "Prioridade de Suporte", "API de Integração"].map((f, i) => (
                    <li key={i} className="flex gap-3 text-blue-50">
                      <CheckCircle2 className="w-5 h-5 text-white" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full py-8 rounded-2xl bg-white text-blue-600 hover:bg-gray-100 font-black text-lg">EXPERIMENTAR GRÁTIS</Button>
              </div>
            </div>

            <div className="md:col-span-1 order-3">
              <div className="border border-gray-200 p-10 rounded-[2.5rem] h-full flex flex-col hover:border-blue-200 transition-colors">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <div className="mb-8">
                  <span className="text-3xl font-black text-gray-900 italic">Sob consulta</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {["Usuários Ilimitados", "Consultoria de Implantação", "SLA Garantido", "Módulos Customizados"].map((f, i) => (
                    <li key={i} className="flex gap-3 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full py-6 rounded-2xl border-2 font-bold">Falar com Consultor</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-12 lg:p-24 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">Inteligência que protege,<br />eficiência que escala.</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">Assuma o controle total da sua transportadora hoje mesmo. Reduza riscos imprevistos e maximize sua margem de lucro com o MovixFlow.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-8 h-auto rounded-2xl text-xl font-bold shadow-xl">Agendar Reunião Estratégica</Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-12 py-8 h-auto rounded-2xl text-xl font-bold bg-transparent">Falar com Especialista</Button>
          </div>
        </div>
      </section>

      {/* Footer Simplified */}
      <footer className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="max-w-xs text-center md:text-left">
              <img src="/logo.svg" alt="MovixFlow" className="h-8 mb-6 mx-auto md:mx-0" />
              <p className="text-gray-500 font-medium">Tecnologia inteligente para gestão de risco e performance logística nacional.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-12 text-gray-600 font-semibold">
              <a href="#" className="hover:text-blue-600 transition-colors">Produto</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Soluções</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Preços</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Blog</a>
            </div>

            <div className="flex gap-4">
              {/* Social icons could go here */}
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-sm font-medium">
            <p>© 2025 MovixFlow Logística Humana S.A.</p>
            <div className="flex gap-8">
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
            </div>
          </div>
        </div>
      </footer>

      <ModalAllModules
        isOpen={showModulesModal}
        onClose={() => setShowModulesModal(false)}
      />
    </div>
  )
}
