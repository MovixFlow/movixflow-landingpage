"use client"

import React, { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Truck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  Smartphone,
  Fingerprint,
  Phone,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"

// ─── CPF mask ────────────────────────────────────────────────────────────────
function maskCPF(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}
function maskPhone(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DriverAuthModalsProps {
  loginOpen: boolean
  setLoginOpen: (open: boolean) => void
  regOpen: boolean
  setRegOpen: (open: boolean) => void
  onSuccess?: () => void
  customHandleLogin?: (e: React.FormEvent, data: any) => void
  customHandleRegister?: (e: React.FormEvent, data: any) => void
}

type View = "login" | "register"

// ─── Component ────────────────────────────────────────────────────────────────

export function DriverAuthModals({
  loginOpen,
  setLoginOpen,
  regOpen,
  setRegOpen,
  onSuccess,
  customHandleLogin,
  customHandleRegister,
}: DriverAuthModalsProps) {
  const { login } = useUser()
  const router = useRouter()

  // unified modal open state
  const isOpen = loginOpen || regOpen
  const initialView: View = regOpen ? "register" : "login"
  const [view, setView] = useState<View>(initialView)

  // sync: when parent opens one of the two modals, set the correct view
  React.useEffect(() => {
    if (regOpen) setView("register")
    else if (loginOpen) setView("login")
  }, [loginOpen, regOpen])

  const handleClose = (open: boolean) => {
    if (!open) {
      setLoginOpen(false)
      setRegOpen(false)
    }
  }

  const switchTo = (v: View) => {
    setView(v)
    if (v === "login") {
      setRegOpen(false)
      setLoginOpen(true)
    } else {
      setLoginOpen(false)
      setRegOpen(true)
    }
  }

  // ── Login state ─────────────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [loginError, setLoginError] = useState("")

  // ── Register state ──────────────────────────────────────────────────────────
  const [regName, setRegName] = useState("")
  const [regCpf, setRegCpf] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [showRegConfirm, setShowRegConfirm] = useState(false)
  const [regError, setRegError] = useState("")
  const [regSuccess, setRegSuccess] = useState(false)

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    if (customHandleLogin) {
      customHandleLogin(e, { email: loginEmail, password: loginPassword })
      return
    }
    setLoginError("Autenticação de motorista não disponível no momento.")
  }


  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    setRegError("")

    if (customHandleRegister) {
      customHandleRegister(e, {
        name: regName,
        email: regEmail,
        cpf: regCpf,
        phone: regPhone,
        password: regPassword,
        confirmPassword: regConfirmPassword,
      })
      return
    }

    if (!regName || !regEmail || !regCpf || !regPassword || !regConfirmPassword) {
      setRegError("Preencha todos os campos obrigatórios.")
      return
    }
    if (regPassword !== regConfirmPassword) {
      setRegError("As senhas não coincidem.")
      return
    }
    if (regPassword.length < 6) {
      setRegError("A senha deve ter ao menos 6 caracteres.")
      return
    }

    login({
      name: regName,
      email: regEmail,
      cpf: regCpf,
      phone: regPhone,
      profileComplete: false,
      profileCompletionPending: true,
    })
    setRegSuccess(true)
    setTimeout(() => {
      setRegSuccess(false)
      setRegName(""); setRegCpf(""); setRegEmail("")
      setRegPhone(""); setRegPassword(""); setRegConfirmPassword("")
      switchTo("login")
      if (onSuccess) onSuccess()
    }, 2000)
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white border-gray-100 rounded-[2rem] shadow-2xl max-h-[90vh] flex flex-col">
        {/* ── Header ── */}
        <div className="bg-gradient-to-b from-blue-50/60 to-white px-8 pt-9 pb-6 text-center border-b border-gray-50 shrink-0">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/25 mb-5 rotate-3 hover:rotate-0 transition-transform">
            <Truck className="w-8 h-8 text-white" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                {view === "login" ? "Acesso do Motorista" : "Criar Conta Motorista"}
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                {view === "login"
                  ? "Conecte-se à rede estratégica MovixFlow."
                  : "Cadastro rápido para acesso imediato aos fretes."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Tab toggle */}
          <div className="flex mt-5 bg-gray-100 rounded-xl p-1 gap-1">
            <TabBtn active={view === "login"} onClick={() => switchTo("login")}>
              Entrar
            </TabBtn>
            <TabBtn active={view === "register"} onClick={() => switchTo("register")}>
              Criar conta
            </TabBtn>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-7 py-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">

            {/* ──────────────── LOGIN VIEW ──────────────── */}
            {view === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.22 }}
                className="space-y-5"
              >
                {loginError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                    <div className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-sm text-rose-700 font-semibold">{loginError}</p>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest">
                      ou use seu e-mail
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <Field label="E-mail">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="nome@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-400 rounded-xl"
                        required
                      />
                    </div>
                  </Field>

                  <Field
                    label="Senha"
                    aside={
                      <button type="button" className="text-xs font-bold text-blue-600 hover:underline">
                        Esqueceu a senha?
                      </button>
                    }
                  >
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={showLoginPwd ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-400 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPwd((p) => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all group mt-1"
                  >
                    Entrar na Plataforma
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-500">
                  Ainda não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => switchTo("register")}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Criar conta grátis
                  </button>
                </p>
              </motion.div>
            )}

            {/* ──────────────── REGISTER VIEW ──────────────── */}
            {view === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                {regError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                    <div className="w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-sm text-rose-700 font-semibold">{regError}</p>
                  </div>
                )}

                {regSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3"
                  >
                    <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-sm text-emerald-700 font-bold">
                      Conta criada com sucesso! Redirecionando para o login...
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleRegistration} className="space-y-4">
                  {/* Nome + CPF */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nome completo" className="col-span-2">
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="João Silva"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="pl-10 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-400 rounded-xl"
                          required
                        />
                      </div>
                    </Field>

                    <Field label="CPF">
                      <div className="relative">
                        <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="000.000.000-00"
                          value={regCpf}
                          onChange={(e) => setRegCpf(maskCPF(e.target.value))}
                          className="pl-10 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-400 rounded-xl"
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Telefone">
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="(00) 00000-0000"
                          value={regPhone}
                          onChange={(e) => setRegPhone(maskPhone(e.target.value))}
                          className="pl-10 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-400 rounded-xl"
                        />
                      </div>
                    </Field>
                  </div>

                  {/* E-mail */}
                  <Field label="E-mail">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="voce@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="pl-10 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-400 rounded-xl"
                        required
                      />
                    </div>
                  </Field>

                  {/* Senha + Confirmar */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Senha">
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type={showRegPwd ? "text" : "password"}
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="pl-10 pr-9 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-400 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPwd((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showRegPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </Field>

                    <Field label="Confirmar">
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type={showRegConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="pl-10 pr-9 h-11 bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-400 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirm((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showRegConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </Field>
                  </div>

                  {/* Biometria tip */}
                  <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 items-start">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-blue-100 mt-0.5">
                      <Fingerprint className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      <span className="font-bold">Após o cadastro</span>, complete seu perfil com CNH e biometria facial para acessar fretes verificados.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all group"
                  >
                    Finalizar Cadastro
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-500">
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => switchTo("login")}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    Fazer login
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="bg-gray-50 px-7 py-4 flex items-center justify-center gap-2 border-t border-gray-100 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">
            Conexão Segura 256-bit
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
        active
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  )
}

function Field({
  label,
  aside,
  children,
  className,
}: {
  label: string
  aside?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {label}
        </Label>
        {aside}
      </div>
      {children}
    </div>
  )
}
