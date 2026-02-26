"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Truck,
    Users,
    Box,
    MessageSquare,
    ShieldAlert,
    BarChart3,
    Settings,
    ChevronLeft,
    Search,
    Zap,
    ShieldCheck,
    ClipboardList,
    LogOut,
    UserCircle,
    ChevronDown
} from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const menuItems = [
    {
        category: "Geral",
        items: [
            { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
            { name: "Alertas Inteligentes", icon: Zap, href: "/dashboard/alerts", badge: "3" },
        ]
    },
    {
        category: "Operacional",
        items: [
            { name: "Gestão de Viagens", icon: Truck, href: "/dashboard/trips" },
            { name: "Gestão de Frotas", icon: Box, href: "/dashboard/fleet" },
            { name: "Motoristas", icon: Users, href: "/dashboard/drivers" },
        ]
    },
    {
        category: "Marketplace",
        items: [
            { name: "Anunciar Frete", icon: ClipboardList, href: "/dashboard/marketplace/post" },
            { name: "Gestão de Fretes", icon: MessageSquare, href: "/dashboard/marketplace/management" },
        ]
    },
    {
        category: "Segurança & BI",
        items: [
            { name: "Análise de Risco", icon: ShieldAlert, href: "/dashboard/risk" },
            { name: "BI Operacional", icon: BarChart3, href: "/dashboard/analytics" },
        ]
    },
    {
        category: "Ajustes",
        items: [
            { name: "Configurações", icon: Settings, href: "/dashboard/settings" },
        ]
    }
]

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const { isLoggedIn, logout, driverData } = useUser()

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const getUserInitials = () => {
        const name = driverData?.name || "U"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <aside
            className={cn(
                "relative flex flex-col h-screen bg-gray-950 text-gray-400 border-r border-gray-800 transition-all duration-300 ease-in-out z-40",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Brand */}
            <div className="flex items-center h-20 px-6 border-b border-gray-800 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-black text-white text-xl tracking-tight">MovixFlow</span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
                {!isCollapsed && (
                    <div className="px-3 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="w-full bg-gray-900 border-none rounded-xl py-2 pl-10 text-sm text-gray-300 focus:ring-1 focus:ring-blue-500/50"
                            />
                        </div>
                    </div>
                )}

                {menuItems.map((group, i) => (
                    <div key={i} className="space-y-1">
                        {!isCollapsed && (
                            <h3 className="px-4 text-[11px] font-black text-gray-600 uppercase tracking-widest mb-4">
                                {group.category}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-blue-600/10 text-blue-400 shadow-sm"
                                                : "hover:bg-gray-900 hover:text-white"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                                            isActive ? "text-blue-500" : "text-gray-500"
                                        )} />

                                        {!isCollapsed && (
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                                {item.badge && (
                                                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-gray-950">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Profile */}
            <div className="p-4 border-t border-gray-800 relative">
                <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className={cn(
                        "w-full bg-gray-900 hover:bg-gray-800 rounded-2xl p-3 flex items-center transition-all group outline-none focus:ring-1 focus:ring-blue-500/50",
                        isCollapsed ? "justify-center" : "gap-3"
                    )}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
                        <span className="text-white text-xs font-black">
                            {isLoggedIn ? getUserInitials() : <Users className="w-5 h-5 text-blue-100" />}
                        </span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                {isLoggedIn ? (driverData?.name || "Motorista") : "Visitante"}
                            </p>
                            <p className="text-[10px] font-black text-gray-500 truncate uppercase tracking-widest">
                                {isLoggedIn ? "Membro Master" : "Acesse sua conta"}
                            </p>
                        </div>
                    )}
                    {!isCollapsed && <ChevronDown className={`w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-all duration-300 ${profileMenuOpen ? "rotate-180" : ""}`} />}
                </button>

                <AnimatePresence>
                    {profileMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setProfileMenuOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, x: isCollapsed ? 20 : 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, x: isCollapsed ? 60 : 0, y: -20, scale: 1 }}
                                exit={{ opacity: 0, x: isCollapsed ? 20 : 0, y: -10, scale: 0.95 }}
                                className={cn(
                                    "absolute bottom-full left-4 mb-2 w-64 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden",
                                    isCollapsed && "left-20"
                                )}
                            >
                                <div className="px-4 py-3 border-b border-gray-800 mb-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Gestão de Perfil</p>
                                    <p className="text-xs text-gray-400 font-medium truncate">{driverData?.email || "Sessão Ativa"}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setProfileMenuOpen(false)
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-all"
                                >
                                    <UserCircle className="w-4 h-4 text-blue-500" />
                                    Meu Perfil
                                </button>

                                <button
                                    onClick={() => setProfileMenuOpen(false)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-all"
                                >
                                    <Settings className="w-4 h-4 text-gray-500" />
                                    Configurações
                                </button>

                                <div className="h-px bg-gray-800 my-1 mx-2" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sair do Sistema
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Collapse Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all shadow-xl"
            >
                <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
            </button>
        </aside>
    )
}
