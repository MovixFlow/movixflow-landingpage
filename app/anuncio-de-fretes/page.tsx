"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  MapPin,
  Package,
  ArrowRight,
  Filter,
  Search,
  X,
  Calendar,
  Building2,
  Phone,
  Mail,
  DollarSign,
  Weight,
  Lock,
  Eye,
  EyeOff,
  User,
  TrendingUp,
  Users,
  CheckCircle2,
  MessageCircle,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { Header } from "@/components/header"
import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { toast } from "sonner"

type Freight = {
  origin: string
  destination: string
  cargoType: string
  value: string
  weight: string
  color: string
  company?: string
  deliveryDate?: string
  description?: string
  requirements?: string[]
  contact?: {
    phone: string
    email: string
  }
}

const TEST_USER = {
  email: "motorista@test.com",
  password: "senha123",
  name: "João Silva",
  phone: "(11) 98765-4321",
  cnh: "12345678900",
  vehicleType: "Caminhão Baú",
  cpf: "123.456.789-00",
  profileComplete: false,
  profileCompletionPending: true,
}

export default function AnuncioDeFretes() {
  const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)
  const [driverLoginModalOpen, setDriverLoginModalOpen] = useState(false)
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  const { isLoggedIn, login } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCargoType, setSelectedCargoType] = useState("Todos")
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [weightRange, setWeightRange] = useState({ min: "", max: "" })
  const [selectedRegion, setSelectedRegion] = useState("Todas")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [regName, setRegName] = useState("")
  const [regCpf, setRegCpf] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  // </CHANGE>
  const [registrationError, setRegistrationError] = useState("")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const router = useRouter()

  // useEffect(() => {
  //   const loggedIn = localStorage.getItem("driverLoggedIn") === "true"
  //   setIsLoggedIn(loggedIn)
  // }, [])

  const freights: Freight[] = [
    {
      origin: "São Paulo, SP",
      destination: "Rio de Janeiro, RJ",
      cargoType: "Normal",
      value: "R$ 3.500",
      weight: "15 ton",
      color: "bg-gray-100 text-gray-800",
      company: "Transportadora São Paulo Ltda",
      deliveryDate: "15/01/2025",
      description: "Transporte de materiais de construção para obra residencial",
      requirements: ["Caminhão truck", "Lona para cobertura", "Motorista com experiência"],
      contact: {
        phone: "(11) 98765-4321",
        email: "contato@transportadorasp.com.br",
      },
    },
    {
      origin: "Curitiba, PR",
      destination: "Florianópolis, SC",
      cargoType: "Frágil",
      value: "R$ 4.200",
      weight: "8 ton",
      color: "bg-yellow-100 text-yellow-800",
      company: "Logística Sul Express",
      deliveryDate: "18/01/2025",
      description: "Transporte de equipamentos eletrônicos e vidros temperados",
      requirements: ["Caminhão baú", "Sistema de amarração especial", "Seguro obrigatório"],
      contact: {
        phone: "(41) 99876-5432",
        email: "operacoes@sulexpress.com.br",
      },
    },
    {
      origin: "Belo Horizonte, MG",
      destination: "Salvador, BA",
      cargoType: "Perecível",
      value: "R$ 5.800",
      weight: "12 ton",
      color: "bg-green-100 text-green-800",
      company: "FreshLog Transportes",
      deliveryDate: "12/01/2025",
      description: "Transporte de alimentos perecíveis para rede de supermercados",
      requirements: ["Caminhão refrigerado", "Temperatura controlada 2-8°C", "Entrega expressa"],
      contact: {
        phone: "(31) 97654-3210",
        email: "fresh@freshlog.com.br",
      },
    },
    {
      origin: "Porto Alegre, RS",
      destination: "Brasília, DF",
      cargoType: "Perigosa",
      value: "R$ 8.500",
      weight: "10 ton",
      color: "bg-red-100 text-red-800",
      company: "SafeCargo Transportes Especiais",
      deliveryDate: "20/01/2025",
      description: "Transporte de produtos químicos industriais com certificação ANTT",
      requirements: ["Certificação MOPP", "Equipamentos de segurança", "Escolta obrigatória"],
      contact: {
        phone: "(51) 98765-1234",
        email: "seguranca@safecargo.com.br",
      },
    },
    {
      origin: "Manaus, AM",
      destination: "Belém, PA",
      cargoType: "Refrigerada",
      value: "R$ 6.900",
      weight: "18 ton",
      color: "bg-blue-100 text-blue-800",
      company: "AmazonFrio Logística",
      deliveryDate: "22/01/2025",
      description: "Transporte de carnes e produtos congelados",
      requirements: ["Caminhão frigorífico", "Temperatura -18°C", "Rastreamento GPS"],
      contact: {
        phone: "(92) 99123-4567",
        email: "operacional@amazonfrio.com.br",
      },
    },
    {
      origin: "Recife, PE",
      destination: "Fortaleza, CE",
      cargoType: "Normal",
      value: "R$ 2.800",
      weight: "6 ton",
      color: "bg-gray-100 text-gray-800",
      company: "Nordeste Cargas",
      deliveryDate: "16/01/2025",
      description: "Transporte de mercadorias gerais para distribuição",
      requirements: ["Caminhão toco", "Documentação em dia"],
      contact: {
        phone: "(81) 98234-5678",
        email: "nordeste@nordestecargas.com.br",
      },
    },
    {
      origin: "Goiânia, GO",
      destination: "Cuiabá, MT",
      cargoType: "Frágil",
      value: "R$ 3.900",
      weight: "5 ton",
      color: "bg-yellow-100 text-yellow-800",
      company: "Centro-Oeste Transportes",
      deliveryDate: "19/01/2025",
      description: "Transporte de móveis e objetos decorativos",
      requirements: ["Caminhão baú", "Embalagem reforçada", "Cuidado no manuseio"],
      contact: {
        phone: "(62) 97345-6789",
        email: "atendimento@centrooeste.com.br",
      },
    },
    {
      origin: "Vitória, ES",
      destination: "Belo Horizonte, MG",
      cargoType: "Perecível",
      value: "R$ 4.500",
      weight: "9 ton",
      color: "bg-green-100 text-green-800",
      company: "VitóriaFresh Logística",
      deliveryDate: "14/01/2025",
      description: "Transporte de frutas e verduras frescas",
      requirements: ["Caminhão refrigerado", "Temperatura 8-12°C", "Entrega matinal"],
      contact: {
        phone: "(27) 99456-7890",
        email: "fresh@vitoriafresh.com.br",
      },
    },
  ]

  const cargoTypes = [
    { name: "Todos", color: "bg-gray-100 text-gray-800", activeColor: "bg-gray-200" },
    { name: "Normal", color: "bg-gray-100 text-gray-800", activeColor: "bg-gray-200" },
    { name: "Frágil", color: "bg-yellow-100 text-yellow-800", activeColor: "bg-yellow-200" },
    { name: "Perecível", color: "bg-green-100 text-green-800", activeColor: "bg-green-200" },
    { name: "Perigosa", color: "bg-red-100 text-red-800", activeColor: "bg-red-200" },
    { name: "Refrigerada", color: "bg-blue-100 text-blue-800", activeColor: "bg-blue-200" },
  ]

  const filteredFreights = freights.filter((freight) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      freight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freight.destination.toLowerCase().includes(searchQuery.toLowerCase())

    // Cargo type filter
    const matchesCargoType = selectedCargoType === "Todos" || freight.cargoType === selectedCargoType

    // Price range filter
    const freightValue = Number.parseFloat(freight.value.replace(/[R$\s.]/g, "").replace(",", "."))
    const minPrice = priceRange.min ? Number.parseFloat(priceRange.min) : 0
    const maxPrice = priceRange.max ? Number.parseFloat(priceRange.max) : Number.POSITIVE_INFINITY
    const matchesPrice = freightValue >= minPrice && freightValue <= maxPrice

    // Weight range filter
    const freightWeight = Number.parseFloat(freight.weight.replace(" ton", ""))
    const minWeight = weightRange.min ? Number.parseFloat(weightRange.min) : 0
    const maxWeight = weightRange.max ? Number.parseFloat(weightRange.max) : Number.POSITIVE_INFINITY
    const matchesWeight = freightWeight >= minWeight && freightWeight <= maxWeight

    // Region filter
    const matchesRegion =
      selectedRegion === "Todas" ||
      freight.origin.includes(selectedRegion) ||
      freight.destination.includes(selectedRegion)

    return matchesSearch && matchesCargoType && matchesPrice && matchesWeight && matchesRegion
  })

  const openFreightDetails = (freight: Freight) => {
    if (!isLoggedIn) {
      setDriverLoginModalOpen(true)
      return
    }
    setSelectedFreight(freight)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedFreight(null), 300)
  }

  const openAnnouncementModal = () => {
    setIsAnnouncementModalOpen(true)
  }

  const closeAnnouncementModal = () => {
    setIsAnnouncementModalOpen(false)
  }

  const openDriverModal = () => {
    setIsDriverModalOpen(true)
  }

  const closeDriverModal = () => {
    setIsDriverModalOpen(false)
  }

  // Removed closeLoginPrompt
  // const closeLoginPrompt = () => {
  //   setIsLoginPromptOpen(false)
  // }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCargoType("Todos")
    setPriceRange({ min: "", max: "" })
    setWeightRange({ min: "", max: "" })
    setSelectedRegion("Todas")
  }

  const handleDriverLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === TEST_USER.email && password === TEST_USER.password) {
      login({
        name: TEST_USER.name,
        email: TEST_USER.email,
        phone: TEST_USER.phone,
        cnh: TEST_USER.cnh,
        vehicleType: TEST_USER.vehicleType,
        cpf: TEST_USER.cpf,
        profileComplete: TEST_USER.profileComplete,
        profileCompletionPending: TEST_USER.profileCompletionPending,
      })
      setDriverLoginModalOpen(false)
      setLoginError("")
      setEmail("")
      setPassword("")
      // setIsLoggedIn(true)
      router.refresh()
    } else {
      setLoginError("Email ou senha incorretos. Use: motorista@test.com / senha123")
    }
  }

  const handleGoogleSignIn = () => {
    login({
      name: "Login com Google",
      email: "google@test.com",
      phone: "",
      cnh: "",
      vehicleType: "",
      cpf: "000.000.000-00",
      profileComplete: false,
      profileCompletionPending: true,
    })
    setDriverLoginModalOpen(false)
    // setIsLoggedIn(true)
    router.refresh()
  }

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    setRegistrationError("")

    if (!regName || !regCpf || !regPassword || !regConfirmPassword) {
      setRegistrationError("Por favor, preencha todos os campos")
      return
    }

    if (regPassword !== regConfirmPassword) {
      setRegistrationError("As senhas não coincidem")
      return
    }

    if (regPassword.length < 6) {
      setRegistrationError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    // Register with minimal data and set profile as incomplete
    login({
      name: regName,
      cpf: regCpf,
      profileComplete: false,
      profileCompletionPending: true,
    })

    setRegistrationSuccess(true)

    setTimeout(() => {
      setRegistrationModalOpen(false)
      setRegistrationSuccess(false)
      setRegName("")
      setRegCpf("")
      setRegPassword("")
      setRegConfirmPassword("")
      router.refresh()
    }, 2000)
  }
  // </CHANGE>

  const handleCreateAccountClick = () => {
    setDriverLoginModalOpen(false)
    setRegistrationModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gray-950 text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 text-blue-400 px-5 py-2 rounded-full mb-8 font-semibold tracking-wide"
            >
              <Truck className="w-4 h-4" />
              <span className="text-xs uppercase">Módulo Exclusivo de Fretes</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight"
            >
              Conecte sua carga ao <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-gradient">
                motorista estratégico
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
            >
              Plataforma inteligente de matching logístico. Reduza tempo ocioso,
              antecipe riscos e escale sua rentabilidade com visibilidade total.
            </motion.p>

            {!isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
              >
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-8 h-auto rounded-2xl group shadow-2xl shadow-blue-600/20 transition-all font-bold"
                  onClick={openAnnouncementModal}
                >
                  Anunciar Frete
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white/10 hover:bg-white/5 px-10 py-8 h-auto rounded-2xl text-lg font-bold backdrop-blur-md"
                  onClick={openDriverModal}
                >
                  Sou Motorista
                </Button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { label: "Fretes Ativos", value: "500+", icon: TrendingUp, color: "text-blue-400" },
                { label: "Motoristas Verificados", value: "1.200+", icon: Users, color: "text-emerald-400" },
                { label: "Taxa de Sucesso", value: "98%", icon: CheckCircle2, color: "text-indigo-400" },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900/50 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center group hover:border-blue-500/30 transition-all">
                  <div className={`w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-500 font-semibold uppercase tracking-widest text-[10px]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por origem ou destino..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 text-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-200 transition-all shadow-sm font-medium"
              />
            </div>

            {/* Marketplace Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-xl border border-gray-100">
                {["Todos", "Urbano", "Rodoviário"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedCargoType(type)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedCargoType === type
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-700">Verificados</span>
                <div className="w-8 h-4 bg-blue-200 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-blue-600 rounded-full" />
                </div>
              </div>

              <Button
                variant="outline"
                className="gap-2 bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold"
                onClick={() => setIsAdvancedFiltersOpen(true)}
              >
                <Filter className="w-4 h-4" />
                Filtros Analíticos
              </Button>
            </div>
          </div>

          {/* Strategic Indicators Bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Fretes Ativos", value: "842", sub: "+12h hoje", color: "text-blue-600", bg: "bg-blue-50/50" },
              { label: "Valor Médio", value: "R$ 4.2k", sub: "Tendência ↑", color: "text-emerald-600", bg: "bg-emerald-50/50" },
              { label: "Top Região", value: "Sudeste", sub: "42% demanda", color: "text-indigo-600", bg: "bg-indigo-50/50" },
              { label: "Urgentes", value: "12", sub: "Coleta imediata", color: "text-rose-600", bg: "bg-rose-50/50" },
            ].map((idx, i) => (
              <div key={i} className={`${idx.bg} border border-white p-4 rounded-2xl`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{idx.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-bold ${idx.color}`}>{idx.value}</span>
                  <span className="text-[10px] font-semibold text-gray-400">{idx.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Filters Display */}
          {(searchQuery ||
            selectedCargoType !== "Todos" ||
            priceRange.min ||
            priceRange.max ||
            weightRange.min ||
            weightRange.max ||
            selectedRegion !== "Todas") && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 font-medium">Filtros ativos:</span>
                {searchQuery && (
                  <Badge className="bg-blue-100 text-blue-800 border-0 px-3 py-1 gap-2">
                    Busca: {searchQuery}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {selectedCargoType !== "Todos" && (
                  <Badge className="bg-blue-100 text-blue-800 border-0 px-3 py-1 gap-2">
                    Tipo: {selectedCargoType}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCargoType("Todos")} />
                  </Badge>
                )}
                {(priceRange.min || priceRange.max) && (
                  <Badge className="bg-blue-100 text-blue-800 border-0 px-3 py-1 gap-2">
                    Preço: R$ {priceRange.min || "0"} - R$ {priceRange.max || "∞"}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange({ min: "", max: "" })} />
                  </Badge>
                )}
                {(weightRange.min || weightRange.max) && (
                  <Badge className="bg-blue-100 text-blue-800 border-0 px-3 py-1 gap-2">
                    Peso: {weightRange.min || "0"} - {weightRange.max || "∞"} ton
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setWeightRange({ min: "", max: "" })} />
                  </Badge>
                )}
                {selectedRegion !== "Todas" && (
                  <Badge className="bg-blue-100 text-blue-800 border-0 px-3 py-1 gap-2">
                    Região: {selectedRegion}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedRegion("Todas")} />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-7 px-2"
                  onClick={clearFilters}
                >
                  Limpar todos
                </Button>
              </div>
            )}
        </div>
      </section>

      {/* Freight Listings */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full w-fit mb-4 border border-blue-100">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest leading-none mt-0.5">Live Marketplace</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Oportunidades em tempo real</h2>
              <p className="text-gray-500 font-medium mt-2">Cargas verificadas e analisadas para garantir sua rentabilidade.</p>
            </div>

            {!isLoggedIn && filteredFreights.length > 3 && (
              <div className="bg-gray-950 text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-xl">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Acesso Restrito</p>
                  <p className="text-sm font-semibold italic">Faça login para ver {filteredFreights.length} fretes</p>
                </div>
              </div>
            )}
          </div>

          {filteredFreights.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <Package className="w-24 h-24 text-gray-100 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Sem fretes por aqui</h3>
              <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium leading-relaxed">
                Tente ajustar seus critérios de busca ou região para encontrar novas oportunidades.
              </p>
              <Button onClick={clearFilters} className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-7 h-auto rounded-xl font-bold transition-all">
                Resetar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFreights.slice(0, 6).map((freight, index) => {
                // Generate a random risk level just for visual variety in this redesign context
                const risks = ["Baixo", "Médio", "Alto"];
                const riskColors = {
                  "Baixo": "bg-emerald-50 text-emerald-700 border-emerald-100",
                  "Médio": "bg-amber-50 text-amber-700 border-amber-100",
                  "Alto": "bg-rose-50 text-rose-700 border-rose-100"
                };
                const risk = risks[index % 3];

                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] transition-all duration-500 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${riskColors[risk as keyof typeof riskColors]}`}>
                          Risco {risk}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 tracking-tight">{freight.value}</div>
                      </div>

                      <div className="relative space-y-6 pl-8">
                        {/* Route Line */}
                        <div className="absolute left-3 top-2 bottom-6 w-0.5 bg-gray-100 border-dashed" />

                        <div className="relative">
                          <div className="absolute -left-7 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Origem</p>
                            <p className="font-bold text-gray-900 text-lg leading-tight">{freight.origin}</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-7 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Destino</p>
                            <p className="font-bold text-gray-900 text-lg leading-tight">{freight.destination}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-gray-600 border border-gray-100">
                          <Package className="w-4 h-4" />
                          <span className="text-xs font-bold">
                            {freight.weight}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl text-blue-700 border border-blue-100">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-xs font-bold">Verificado</span>
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t border-gray-100">
                        <Button
                          className="w-full bg-gray-50 border border-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 font-bold py-7 h-auto rounded-2xl transition-all group-hover:border-blue-500"
                          onClick={() => openFreightDetails(freight)}
                        >
                          Entrar em Contato
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gray-950 text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-blue-600/30 rotate-3"
          >
            <Zap className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-5xl font-bold mb-8 leading-tight tracking-tight">
            Pronto para transformar <br />
            sua <span className="text-blue-500">rentabilidade?</span>
          </h2>
          <p className="text-xl mb-12 text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Cadastre-se na rede que mais cresce no Brasil e tenha acesso a
            fretes exclusivos verificados por inteligência de risco.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-8 h-auto rounded-2xl text-xl font-bold shadow-xl transition-all active:scale-95"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 px-12 py-8 h-auto rounded-2xl text-xl font-bold bg-transparent backdrop-blur-md"
            >
              Falar com Especialista
            </Button>
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

      {/* Advanced Filters Modal */}
      {isAdvancedFiltersOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsAdvancedFiltersOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">Filtros Avançados</h3>
              <button
                onClick={() => setIsAdvancedFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Faixa de Preço (R$)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Mínimo"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Máximo"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Weight Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Faixa de Peso (toneladas)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Mínimo"
                      value={weightRange.min}
                      onChange={(e) => setWeightRange({ ...weightRange, min: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Máximo"
                      value={weightRange.max}
                      onChange={(e) => setWeightRange({ ...weightRange, max: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Região
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Todas">Todas as Regiões</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="BA">Bahia</option>
                  <option value="PE">Pernambuco</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="GO">Goiás</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="AM">Amazonas</option>
                  <option value="PA">Pará</option>
                  <option value="ES">Espírito Santo</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setIsAdvancedFiltersOpen(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    clearFilters()
                    setIsAdvancedFiltersOpen(false)
                  }}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-12 bg-transparent"
                >
                  Limpar Tudo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeAnnouncementModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">Anunciar Novo Frete</h3>
              <button onClick={closeAnnouncementModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                  <input
                    type="text"
                    placeholder="Ex: Transportadora São Paulo Ltda"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Route Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Origem</label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo, SP"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
                    <input
                      type="text"
                      placeholder="Ex: Rio de Janeiro, RJ"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Carga</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Normal</option>
                      <option>Frágil</option>
                      <option>Perecível</option>
                      <option>Perigosa</option>
                      <option>Refrigerada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso (ton)</label>
                    <input
                      type="number"
                      placeholder="Ex: 15"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
                    <input
                      type="text"
                      placeholder="Ex: 3.500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Entrega</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da Carga</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva os detalhes da carga..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos Especiais</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Caminhão truck, lona para cobertura..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <input
                      type="tel"
                      placeholder="(11) 98765-4321"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <input
                      type="email"
                      placeholder="contato@empresa.com.br"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12">
                    Publicar Frete
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeAnnouncementModal}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-12 bg-transparent"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Driver Modal */}
      {isDriverModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeDriverModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900">Cadastro de Motorista</h3>
              <button onClick={closeDriverModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Bem-vindo, motorista!</strong> Cadastre-se para receber notificações instantâneas de fretes
                  disponíveis na sua região.
                </p>
              </div>

              <form className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Ex: João Silva"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone/WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="(11) 98765-4321"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <input
                      type="email"
                      placeholder="motorista@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* CNH */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNH</label>
                    <input
                      type="text"
                      placeholder="Número da CNH"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Categoria C</option>
                      <option>Categoria D</option>
                      <option>Categoria E</option>
                    </select>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Veículo</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Caminhão Toco</option>
                    <option>Caminhão Truck</option>
                    <option>Carreta</option>
                    <option>Bitrem</option>
                    <option>Rodotrem</option>
                  </select>
                </div>

                {/* Specializations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especializações</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Carga Frágil</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Carga Perecível</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Carga Perigosa (MOPP)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm text-gray-700">Refrigerada</span>
                    </label>
                  </div>
                </div>

                {/* Operating Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Região de Atuação</label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo, Rio de Janeiro, Minas Gerais"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12">
                    Cadastrar como Motorista
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDriverModal}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-12 bg-transparent"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Freight Details Modal - Professional Redesign */}
      {isModalOpen && selectedFreight && (
        <div
          className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Minimalist */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Detalhes do Frete</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Disponibilidade Imediata</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Main Info - Value & Type */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                    <Package className="w-7 h-7 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Carga</p>
                    <p className="font-bold text-gray-900 text-xl">{selectedFreight.cargoType}</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Pagamento</p>
                  <span className="text-4xl font-bold text-blue-600 block">{selectedFreight.value}</span>
                </div>
              </div>

              {/* Company Info */}
              {selectedFreight.company && (
                <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                      Empresa Contratante
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{selectedFreight.company}</p>
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Route Display - Clean Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Roteirização
                </h4>
                <div className="relative space-y-0">
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-100 border-dashed" />

                  <div className="relative flex items-center gap-6 p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 z-10">
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Origem</p>
                      <p className="font-bold text-gray-900 text-lg">{selectedFreight.origin}</p>
                    </div>
                  </div>

                  <div className="relative flex items-center gap-6 p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 z-10">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Destino</p>
                      <p className="font-bold text-gray-900 text-lg">{selectedFreight.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <Weight className="w-4 h-4 text-gray-400" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Capacidade</p>
                  </div>
                  <p className="font-bold text-gray-900 text-xl">{selectedFreight.weight}</p>
                </div>
                {selectedFreight.deliveryDate && (
                  <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Previsão</p>
                    </div>
                    <p className="font-bold text-gray-900 text-xl">{selectedFreight.deliveryDate}</p>
                  </div>
                )}
              </div>

              {/* Details & Requirements */}
              <div className="space-y-4">
                {selectedFreight.description && (
                  <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Detalhamento da Carga</h4>
                    <p className="text-gray-600 font-medium leading-relaxed italic">"{selectedFreight.description}"</p>
                  </div>
                )}

                {selectedFreight.requirements && selectedFreight.requirements.length > 0 && (
                  <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Requisitos Obrigatórios</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedFreight.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information - Premium */}
              {selectedFreight.contact && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Canais de Contato</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <a
                      href={`https://wa.me/55${selectedFreight.contact.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 bg-emerald-500 text-white rounded-[2rem] hover:bg-emerald-600 transition-all group shadow-lg shadow-emerald-500/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">WhatsApp Direto</p>
                          <p className="text-xl font-bold">{selectedFreight.contact.phone}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a
                        href={`tel:${selectedFreight.contact.phone}`}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-gray-900">{selectedFreight.contact.phone}</span>
                      </a>
                      <a
                        href={`mailto:${selectedFreight.contact.email}`}
                        className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors truncate"
                      >
                        <Mail className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-bold text-gray-900 truncate">{selectedFreight.contact.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Main Actions */}
            <div className="p-8 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all group"
                onClick={() => {
                  if (selectedFreight.contact) {
                    window.open(`https://wa.me/55${selectedFreight.contact.phone.replace(/\D/g, "")}`, '_blank')
                  }
                }}
              >
                Entrar em Contato
                <MessageCircle className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 h-14 text-lg font-bold rounded-2xl transition-all"
                onClick={closeModal}
              >
                Voltar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={driverLoginModalOpen} onOpenChange={setDriverLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-center text-gray-900">Login - Motorista</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{loginError}</p>
              </div>
            )}

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 font-semibold text-gray-700 flex items-center justify-center gap-3 bg-transparent"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
              </div>
            </div>

            <form onSubmit={handleDriverLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driver-email" className="text-gray-900 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="driver-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver-password" className="text-gray-900 font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="driver-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Esqueceu sua senha?
                </button>
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Entrar
              </Button>

              <div className="text-center text-sm text-gray-600">
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={handleCreateAccountClick}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Criar conta
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={registrationModalOpen} onOpenChange={setRegistrationModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900">Criar Conta - Motorista</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Cadastro rápido - Complete seu perfil depois
              {/* </CHANGE> */}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegistration} className="space-y-4 py-4">
            {registrationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{registrationError}</p>
              </div>
            )}

            {registrationSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600 text-center font-medium">
                  Conta criada! Você pode completar seu perfil depois.
                  {/* </CHANGE> */}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reg-name" className="text-gray-900 font-medium">
                Nome Completo *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="João Silva"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-cpf" className="text-gray-900 font-medium">
                CPF *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="reg-cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={regCpf}
                  onChange={(e) => setRegCpf(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-gray-900 font-medium">
                Senha *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-confirm-password" className="text-gray-900 font-medium">
                Confirmar Senha *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Digite a senha novamente"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Dica:</strong> Após criar sua conta, você poderá completar seu perfil com informações
                adicionais como CNH, veículo, documentos, etc.
              </p>
            </div>
            {/* </CHANGE> */}

            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
              disabled={registrationSuccess}
            >
              Criar Conta
            </Button>

            <div className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setRegistrationModalOpen(false)
                  setDriverLoginModalOpen(true)
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Fazer login
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Removed login prompt modal */}
      {/* {isLoginPromptOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLoginPrompt}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Login Necessário</h3>
                  <p className="text-blue-100 text-sm">Acesse para ver os detalhes</p>
                </div>
              </div>
              <button onClick={closeLoginPrompt} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 text-sm leading-relaxed">
                  <strong>Atenção:</strong> Para visualizar os detalhes completos dos fretes, incluindo informações de
                  contato e requisitos, você precisa fazer login como motorista.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Acesso completo a todos os fretes disponíveis</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Informações de contato direto com empresas</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Notificações de novos fretes na sua região</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={openDriverModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
                >
                  Fazer Login como Motorista
                </Button>
                <Button
                  variant="outline"
                  onClick={closeLoginPrompt}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12 text-base bg-white"
                >
                  Voltar
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Ainda não tem conta?{" "}
                <button
                  onClick={() => {
                    closeLoginPrompt()
                    openDriverModal()
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Cadastre-se gratuitamente
                </button>
              </p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}
