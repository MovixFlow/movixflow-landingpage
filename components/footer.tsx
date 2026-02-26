"use client"

import Link from "next/link"
import {
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px] -z-10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/20 rounded-full blur-[120px] -z-10 translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand & Mission */}
                    <div className="lg:col-span-4 max-w-sm">
                        <Link href="/" className="inline-block mb-8 transition-opacity hover:opacity-80">
                            <img src="/logo.svg" alt="MovixFlow" className="h-10" />
                        </Link>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
                            Tecnologia de ponta para gestão operacional e de risco. Conectando transportadoras, embarcadores e motoristas em um ecossistema seguro.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, href: "#", label: "Facebook" },
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                                { icon: Youtube, href: "#", label: "YouTube" },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all border border-gray-100 hover:border-blue-100"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-12">
                        <div>
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-[0.2em] mb-8">Navegação</h4>
                            <ul className="space-y-4">
                                {["Home", "Produto", "Soluções", "Preços", "Blog"].map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors flex items-center group">
                                            <ArrowRight className="w-4 h-4 mr-0 opacity-0 -ml-4 group-hover:mr-2 group-hover:opacity-100 transition-all" />
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-[0.2em] mb-8">Suporte</h4>
                            <ul className="space-y-4">
                                {["Ajuda", "Documentação", "Privacidade", "Termos", "Contato"].map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-gray-500 hover:text-blue-600 font-semibold transition-colors flex items-center group">
                                            <ArrowRight className="w-4 h-4 mr-0 opacity-0 -ml-4 group-hover:mr-2 group-hover:opacity-100 transition-all" />
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter / Contact */}
                    <div className="lg:col-span-4">
                        <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Fique por dentro das novidades</h4>
                            <p className="text-gray-500 text-sm mb-8 font-medium">Assine nossa newsletter e receba insights sobre logística e gestão de risco.</p>

                            <div className="flex gap-2 mb-8">
                                <Input
                                    placeholder="Seu melhor e-mail"
                                    className="h-12 rounded-xl bg-white border-gray-200 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                />
                                <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 font-bold transition-all hover:scale-105 active:scale-95">
                                    Assinar
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-bold opacity-80">63 992748276</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                                        <Mail className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="text-sm font-bold opacity-80">contato@movixflow.com.br</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                        <span>© {new Date().getFullYear()} MovixFlow Logística Humana S.A.</span>
                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-200" />
                        <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                            <ShieldCheck className="w-4 h-4" />
                            SaaS Certificado
                        </span>
                    </div>

                    <div className="flex items-center gap-8 text-sm font-bold text-gray-400">
                        <Link href="#" className="hover:text-gray-900 transition-colors">Segurança</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">Cookies</Link>
                        <Link href="#" className="hover:text-gray-900 transition-colors">Compliance</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
