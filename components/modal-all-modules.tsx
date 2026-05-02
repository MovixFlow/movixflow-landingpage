"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    LayoutDashboard,
    Settings,
    MapPin,
    Users,
    Search,
    BarChart3,
    Share2,
    ClipboardList,
    UserPlus,
    Contact,
    Truck,
    Shield,
    Radio,
    ShieldAlert,
    Navigation,
    Building,
    ArrowRight,
    X,
    ShieldCheck
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const moduleCategories = [
    {
        name: "Governança & Gestão",
        color: "from-blue-600 to-indigo-700",
        modules: [
            { name: "Dashboard", desc: "Visão 360º da operação em tempo real.", icon: LayoutDashboard },
            { name: "Configurações", desc: "Personalize fluxos e parâmetros do sistema.", icon: Settings },
            { name: "Gerenciar Usuários", desc: "Controle de acessos e níveis de permissão.", icon: Users },
            { name: "Gestão de Clientes", desc: "CRM logístico e histórico de parceiros.", icon: Building },
        ]
    },
    {
        name: "Operação & Logística",
        color: "from-emerald-500 to-teal-600",
        modules: [
            { name: "Locais de Carregamento", desc: "Gestão de hubs, CDs e pontos de carga.", icon: MapPin },
            { name: "Buscar Agendamentos", desc: "Pesquisa inteligente de janelas e docas.", icon: Search },
            { name: "Agendamentos Analytics", desc: "BI dedicado ao fluxo de carregamento.", icon: BarChart3 },
            { name: "Passagem de Turno", desc: "Continuidade sem perda de informação.", icon: Share2 },
            { name: "Análise de Turnos", desc: "Performance e produtividade das equipes.", icon: ClipboardList },
            { name: "Gestão de Viagens", desc: "Controle ponta a ponta em tempo real.", icon: Navigation },
        ]
    },
    {
        name: "Frotas & Ativos",
        color: "from-orange-500 to-amber-600",
        modules: [
            { name: "Cadastrar Motorista/Veículo", desc: "Onboarding ágil com validação ativa.", icon: UserPlus },
            { name: "Ver Motoristas", desc: "Base de dados de condutores verificados.", icon: Contact },
            { name: "Ver Veículos", desc: "Gestão de ativos e conformidade técnica.", icon: Truck },
        ]
    },
    {
        name: "Segurança & Escolta",
        color: "from-red-500 to-rose-600",
        modules: [
            { name: "Gestão de Escoltas", desc: "Coordenação de segurança em rota.", icon: Shield },
            { name: "Controle de Escoltas", desc: "Monitoramento de iscas e equipes.", icon: Radio },
            { name: "Escoltas Disponíveis", desc: "Marketplace de segurança patrimonial.", icon: ShieldAlert },
        ]
    },
    {
        name: "Compliance & Risco",
        color: "from-indigo-500 to-purple-600",
        modules: [
            { name: "Nova Consulta de Risco", desc: "Validação preditiva com múltiplas fontes PGFN e ANTT.", icon: ShieldCheck, href: "/solicitar-consulta" },
            { name: "Acompanhar Consultas", desc: "Dashboard de status e histórico de liberações aprovadas.", icon: ClipboardList, href: "/acompanhar" },
        ]
    }
]

interface ModalAllModulesProps {
    isOpen: boolean
    onClose: () => void
}

export function ModalAllModules({ isOpen, onClose }: ModalAllModulesProps) {
    const router = useRouter()

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-7xl h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-3xl border-gray-100 p-0 rounded-3xl sm:rounded-[3rem] shadow-3xl scrollbar-hide overflow-x-hidden">
                <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50">
                    <button
                        onClick={onClose}
                        className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-gray-900" />
                    </button>
                </div>

                <div className="p-6 sm:p-12 lg:p-20">
                    <DialogHeader className="mb-12 sm:mb-16 text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-6 border border-blue-100 w-fit">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="text-xs sm:text-sm font-bold tracking-wide uppercase italic">Ecossistema MovixFlow</span>
                        </div>
                        <DialogTitle className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                            Todos os módulos para sua <br className="hidden sm:block" />
                            <span className="text-blue-600">operação escalar</span>
                        </DialogTitle>
                        <DialogDescription className="text-lg sm:text-xl text-gray-500 max-w-2xl font-medium">
                            Explore a profundidade da nossa plataforma. Cada módulo foi desenhado para resolver gargalos reais da logística e segurança nacional.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-16 sm:space-y-24">
                        {moduleCategories.map((category, catIdx) => (
                            <div key={catIdx} className="w-full">
                                <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                                    <h3 className="text-lg sm:text-2xl font-black text-gray-900 uppercase tracking-widest whitespace-nowrap">{category.name}</h3>
                                    <div className="h-0.5 flex-1 bg-gray-100" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                                    {category.modules.map((module: any, modIdx) => (
                                        <motion.div
                                            key={modIdx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: modIdx * 0.05 + catIdx * 0.1 }}
                                            onClick={() => {
                                                if (module.href) {
                                                    router.push(module.href)
                                                    onClose()
                                                }
                                            }}
                                            className={`group relative p-6 sm:p-8 bg-gray-50/50 rounded-2xl sm:rounded-3xl border border-gray-100 min-h-[220px] flex flex-col justify-between transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-blue-100/50 ${module.href ? "cursor-pointer active:scale-95" : ""}`}
                                        >
                                            <div>
                                                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${category.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                                                    <module.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                                </div>
                                                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight break-words">
                                                    {module.name}
                                                </h4>
                                                <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium line-clamp-3">
                                                    {module.desc}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-blue-600 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 mt-4 sm:mt-6 transition-all">
                                                Detalhes do módulo <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </div>

                                            {/* Interactive background accent */}
                                            <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-[0.03] rounded-bl-full transition-opacity`} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 sm:mt-32 p-8 sm:p-12 bg-gray-900 rounded-2xl sm:rounded-[3rem] text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                        <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6">Precisa de um fluxo customizado?</h3>
                        <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium">Nossa arquitetura modular permite integrações sob medida para operações complexas.</p>
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                        >
                            Falar com Engenheiro de Soluções
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
