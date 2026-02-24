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
    ClipboardList
} from "lucide-react"

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
            <div className="p-4 border-t border-gray-800">
                <div className={cn(
                    "bg-gray-900 rounded-2xl p-3 flex items-center transition-all",
                    isCollapsed ? "justify-center" : "gap-3"
                )}>
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                        <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Executivo Master</p>
                            <p className="text-xs text-gray-500 truncate">Vip Logística S.A.</p>
                        </div>
                    )}
                </div>
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
