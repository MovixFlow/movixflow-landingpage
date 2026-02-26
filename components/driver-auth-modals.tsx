"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, User, Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, X, ArrowRight, Smartphone, Fingerprint } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"

interface DriverAuthModalsProps {
    loginOpen: boolean
    setLoginOpen: (open: boolean) => void
    regOpen: boolean
    setRegOpen: (open: boolean) => void
    onSuccess?: () => void
    customHandleLogin?: (e: React.FormEvent, data: any) => void
    customHandleRegister?: (e: React.FormEvent, data: any) => void
}

export function DriverAuthModals({
    loginOpen,
    setLoginOpen,
    regOpen,
    setRegOpen,
    onSuccess,
    customHandleLogin,
    customHandleRegister
}: DriverAuthModalsProps) {
    const { login } = useUser()
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [loginError, setLoginError] = useState("")

    const [regName, setRegName] = useState("")
    const [regCpf, setRegCpf] = useState("")
    const [regEmail, setRegEmail] = useState("")
    const [regPassword, setRegPassword] = useState("")
    const [regConfirmPassword, setRegConfirmPassword] = useState("")
    const [regError, setRegError] = useState("")
    const [regSuccess, setRegSuccess] = useState(false)

    const TEST_USER = {
        email: "motorista@test.com",
        password: "senha123",
        name: "João Silva",
        cpf: "000.000.000-00",
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (customHandleLogin) {
            customHandleLogin(e, { email: loginEmail, password: loginPassword })
            return
        }
        if (loginEmail === TEST_USER.email && loginPassword === TEST_USER.password) {
            login({
                name: TEST_USER.name,
                email: loginEmail,
                cpf: TEST_USER.cpf,
                profileComplete: true,
                profileCompletionPending: false,
            })
            setLoginOpen(false)
            setLoginError("")
            if (onSuccess) onSuccess()
            router.push("/anuncio-de-fretes")
        } else {
            setLoginError("Email ou senha incorretos. Use: motorista@test.com / senha123")
        }
    }

    const handleGoogleSignIn = () => {
        login({
            name: "Usuário Google",
            email: "motorista@gmail.com",
            cpf: "000.000.000-00",
            profileComplete: false,
            profileCompletionPending: true,
        })
        setLoginOpen(false)
        if (onSuccess) onSuccess()
        router.push("/anuncio-de-fretes")
    }

    const handleRegistration = (e: React.FormEvent) => {
        e.preventDefault()
        if (customHandleRegister) {
            customHandleRegister(e, {
                name: regName,
                email: regEmail,
                cpf: regCpf,
                password: regPassword,
                confirmPassword: regConfirmPassword
            })
            return
        }
        setRegError("")

        if (!regName || !regEmail || !regCpf || !regPassword || !regConfirmPassword) {
            setRegError("Por favor, preencha todos os campos obrigatórios.")
            return
        }

        if (regPassword !== regConfirmPassword) {
            setRegError("As senhas não coincidem")
            return
        }

        login({
            name: regName,
            email: regEmail,
            cpf: regCpf,
            profileComplete: false,
            profileCompletionPending: true,
        })

        setRegSuccess(true)
        setTimeout(() => {
            setRegOpen(false)
            setRegSuccess(false)
            setLoginOpen(true)
            if (onSuccess) onSuccess()
        }, 2000)
    }

    return (
        <>
            {/* Login Modal */}
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white/95 backdrop-blur-2xl border-gray-100 rounded-[2.5rem] shadow-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-b from-blue-50/50 to-white px-8 pt-10 pb-6 text-center border-b border-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-500/20 mb-6 rotate-3 transform transition-transform hover:rotate-0">
                                <Truck className="w-10 h-10 text-white" />
                            </div>
                            <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                                Acesso do Motorista
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">
                                Conecte-se à rede estratégica MovixFlow.
                            </DialogDescription>
                        </div>

                        <div className="px-8 py-8 space-y-6">
                            {loginError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
                                        <X className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-sm text-rose-700 font-bold">{loginError}</p>
                                </motion.div>
                            )}

                            <Button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-full h-14 bg-white border-2 border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95 group shadow-sm"
                            >
                                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Entrar com Google</span>
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-6 bg-white text-gray-400 font-bold uppercase tracking-widest">ou use seu e-mail</span>
                                </div>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="email"
                                            placeholder="nome@email.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            className="pl-12 h-14 bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-2xl font-medium transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Senha</Label>
                                        <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Esqueceu a senha?</button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            className="pl-12 pr-12 h-14 bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-2xl font-medium transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all group"
                                >
                                    Entrar na Plataforma
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>

                            <p className="text-center text-sm font-medium text-gray-500">
                                Ainda não tem conta?{" "}
                                <button
                                    onClick={() => {
                                        setLoginOpen(false)
                                        setRegOpen(true)
                                    }}
                                    className="text-blue-600 font-extrabold hover:underline"
                                >
                                    Solicitar Acesso
                                </button>
                            </p>
                        </div>

                        <div className="bg-gray-50/80 px-8 py-5 flex items-center justify-center gap-3 border-t border-gray-100">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Conexão Segura 256-bit</span>
                        </div>
                    </motion.div>
                </DialogContent>
            </Dialog>

            {/* Registration Modal */}
            <Dialog open={regOpen} onOpenChange={setRegOpen}>
                <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden bg-white/95 backdrop-blur-2xl border-gray-100 rounded-[2.5rem] shadow-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-b from-emerald-50/50 to-white px-8 pt-10 pb-6 text-center border-b border-gray-50">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-700 rounded-3xl shadow-xl shadow-emerald-500/20 mb-6 -rotate-3 transform transition-transform hover:rotate-0">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                                Criar Conta Motorista
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">
                                Cadastro rápido para acesso imediato aos fretes.
                            </DialogDescription>
                        </div>

                        <div className="px-8 py-8 space-y-6">
                            {regError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
                                        <X className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-sm text-rose-700 font-bold">{regError}</p>
                                </motion.div>
                            )}

                            {regSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-sm text-emerald-700 font-bold">Conta criada com sucesso! Redirecionando...</p>
                                </motion.div>
                            )}

                            <form onSubmit={handleRegistration} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</Label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="João Silva"
                                                value={regName}
                                                onChange={(e) => setRegName(e.target.value)}
                                                className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl font-medium text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CPF</Label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="000.000.000-00"
                                                value={regCpf}
                                                onChange={(e) => setRegCpf(e.target.value)}
                                                className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl font-medium text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="email"
                                            placeholder="voce@email.com"
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                            className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl font-medium text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={regPassword}
                                                onChange={(e) => setRegPassword(e.target.value)}
                                                className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl font-medium text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={regConfirmPassword}
                                                onChange={(e) => setRegConfirmPassword(e.target.value)}
                                                className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white rounded-xl font-medium text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-blue-50">
                                        <Fingerprint className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        <span className="font-bold">Dica:</span> Após criar sua conta, você poderá completar seu perfil com CNH e biometria facial para acessar fretes verificados.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-[0.98] transition-all group"
                                >
                                    Finalizar Cadastro
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>

                            <p className="text-center text-sm font-medium text-gray-500">
                                Já possui conta?{" "}
                                <button
                                    onClick={() => {
                                        setRegOpen(false)
                                        setLoginOpen(true)
                                    }}
                                    className="text-emerald-600 font-extrabold hover:underline"
                                >
                                    Fazer Login
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </>
    )
}
