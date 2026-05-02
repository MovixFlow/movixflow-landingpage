"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  UserCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Phone,
  FileText,
  Loader2,
  Building2,
  Users,
  User,
  MapPin,
  Search,
  ClipboardList,
  Link2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { api } from "@/src/service/Api"
import { AuthService } from "@/src/services/Auth/authService"
import { useCliente, type TipoCliente } from "@/contexts/cliente-context"
import { getParceiras, type Empresa } from "@/src/services/empresa.service"
import { cn } from "@/lib/utils"

// ─── Masks / Validation ───────────────────────────────────────────────────────

function maskCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}
function maskCNPJ(v: string) {
  return v.replace(/\D/g, "").slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}
function maskPhone(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "login" | "register" | "pendente"
type RegStep = "tipo" | "dados" | "vinculo" | "sucesso"

interface PFForm {
  nome: string; cpf: string; dataNascimento: string
  telefone: string; email: string; senha: string; confirmar: string
}
interface EmpresaForm {
  nome: string; cpf: string; email: string; telefone: string; senha: string; confirmar: string
  nomeEmpresa: string; cnpjEmpresa: string; telefoneEmpresa: string; enderecoEmpresa: string; cepEmpresa: string
}

const pfInicial: PFForm = { nome:"", cpf:"", dataNascimento:"", telefone:"", email:"", senha:"", confirmar:"" }
const empInicial: EmpresaForm = { nome:"", cpf:"", email:"", telefone:"", senha:"", confirmar:"", nomeEmpresa:"", cnpjEmpresa:"", telefoneEmpresa:"", enderecoEmpresa:"", cepEmpresa:"" }

// ─── Props ────────────────────────────────────────────────────────────────────

interface ClienteAuthModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialView?: View
}

// ─── TIPO CONFIG ──────────────────────────────────────────────────────────────

const TIPOS: { value: TipoCliente; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  {
    value: "PF",
    label: "Pessoa Física",
    sub: "Solicitante individual de consultas de risco",
    icon: <User className="w-7 h-7" />,
    color: "indigo",
  },
  {
    value: "EMPRESA_TERCEIRA",
    label: "Empresa Terceira",
    sub: "Empresa contratante que terceiriza serviços logísticos",
    icon: <Building2 className="w-7 h-7" />,
    color: "blue",
  },
  {
    value: "EMPRESA_CONSULTAS",
    label: "Empresa Solicitante",
    sub: "Empresa que solicita consultas de risco para sua operação",
    icon: <ClipboardList className="w-7 h-7" />,
    color: "violet",
  },
]

const colorMap: Record<string, { border: string; bg: string; icon: string; ring: string; btn: string }> = {
  indigo: { border:"border-indigo-500", bg:"bg-indigo-50", icon:"text-indigo-600", ring:"ring-indigo-100", btn:"bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20" },
  blue:   { border:"border-blue-500",   bg:"bg-blue-50",   icon:"text-blue-600",   ring:"ring-blue-100",   btn:"bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" },
  violet: { border:"border-violet-500", bg:"bg-violet-50", icon:"text-violet-600", ring:"ring-violet-100", btn:"bg-violet-600 hover:bg-violet-700 shadow-violet-500/20" },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ClienteAuthModal({ open, onOpenChange, initialView = "login" }: ClienteAuthModalProps) {
  const { loginCliente, logoutCliente } = useCliente()
  const [view, setView] = useState<View>(initialView)

  // login
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPwd, setLoginPwd] = useState("")
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginando, setLoginando] = useState(false)

  // register multi-step
  const [step, setStep] = useState<RegStep>("tipo")
  const [tipo, setTipo] = useState<TipoCliente | null>(null)
  const [pfForm, setPfForm] = useState<PFForm>(pfInicial)
  const [empForm, setEmpForm] = useState<EmpresaForm>(empInicial)
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)

  // vinculo
  const [buscaEmp, setBuscaEmp] = useState("")
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [buscando, setBuscando] = useState(false)
  const [empSelecionada, setEmpSelecionada] = useState<Empresa | null>(null)
  const [vinculando, setVinculando] = useState(false)

  useEffect(() => { if (open) setView(initialView) }, [open, initialView])

  const reset = () => {
    setView("login"); setStep("dados"); setTipo("EMPRESA_CONSULTAS")
    setPfForm(pfInicial); setEmpForm(empInicial)
    setFieldErrors({}); setLoginError("")
    setBuscaEmp(""); setEmpresas([]); setEmpSelecionada(null)
  }

  const buscarEmpresas = useCallback(async () => {
    setBuscando(true)
    try { setEmpresas(await getParceiras()) }
    catch { toast.error("Não foi possível carregar empresas.") }
    finally { setBuscando(false) }
  }, [])

  // ── LOGIN ─────────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(""); setLoginando(true)
    try {
      const response = await AuthService.authenticateLogin({ usuario: loginEmail, senha: loginPwd })

      const tiposNaoPermitidos = ["ADMINISTRADOR", "FUNCIONARIO"]
      if (tiposNaoPermitidos.includes(response.claims.tipoUsuario)) {
        setLoginError("Acesso negado. Use o portal corporativo para este tipo de conta.")
        return
      }

      const userData = {
        id: response.claims.id,
        identificador: response.claims.identificador,
        nome: response.claims.nome,
        email: response.claims.email,
        tipo: (response.claims.tipoUsuario as TipoCliente) ?? "CLIENTE_CONSULTA",
        statusAcesso: response.claims.statusAcesso,
        idEmpresa: response.claims.idEmpresa,
        empresaVinculadaId: response.claims.idEmpresaVinculada || undefined,
        empresaVinculadaNome: response.claims.nomeEmpresaVinculada || undefined,
      }

      loginCliente(userData)

      toast.success(`Bem-vindo, ${response.claims.nome}!`)
      onOpenChange(false); reset()
    } catch (err: any) {
      const status = err?.response?.status
      if (err?.code === "ECONNABORTED" || err?.message?.includes("timeout"))
        setLoginError("Servidor não respondeu. Verifique se o backend está rodando.")
      else if (!err?.response)
        setLoginError("Não foi possível conectar ao servidor (localhost:5991).")
      else if (status === 401) setLoginError("Usuário ou senha inválidos.")
      else if (status === 402) setLoginError("Acesso bloqueado: pagamento em atraso.")
      else if (status === 403) setLoginError("Acesso suspenso: entre em contato com o suporte.")
      else setLoginError(err?.response?.data?.mensagem ?? err?.response?.data?.message ?? "Erro ao efetuar login.")
    } finally { setLoginando(false) }
  }

  // ── REGISTER – validação ──────────────────────────────────────────────────

  const validarDados = (): boolean => {
    const e: Record<string, string> = {}
    if (tipo === "PF") {
      if (!pfForm.nome.trim() || pfForm.nome.length < 3) e.nome = "Nome obrigatório (mín. 3 caracteres)"
      if (!pfForm.cpf.trim()) e.cpf = "CPF obrigatório"
      if (!pfForm.telefone || pfForm.telefone.replace(/\D/g,"").length < 10) e.telefone = "Telefone inválido"
      if (!pfForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pfForm.email)) e.email = "E-mail inválido"
      if (!pfForm.senha || pfForm.senha.length < 6) e.senha = "Mínimo 6 caracteres"
      if (pfForm.senha !== pfForm.confirmar) e.confirmar = "Senhas não coincidem"
    } else {
      if (!empForm.nomeEmpresa.trim() || empForm.nomeEmpresa.length < 3) e.nomeEmpresa = "Razão social obrigatória"
      if (!empForm.cnpjEmpresa.trim()) e.cnpjEmpresa = "CNPJ obrigatório"
      if (!empForm.telefoneEmpresa || empForm.telefoneEmpresa.replace(/\D/g,"").length < 10) e.telefoneEmpresa = "Telefone da empresa inválido"
      if (!empForm.cepEmpresa.trim() || empForm.cepEmpresa.replace(/\D/g,"").length !== 8) e.cepEmpresa = "CEP inválido"
      if (!empForm.enderecoEmpresa.trim()) e.enderecoEmpresa = "Endereço obrigatório"

      if (!empForm.nome.trim() || empForm.nome.length < 3) e.nome = "Nome do responsável obrigatório"
      if (!empForm.cpf.trim()) e.cpf = "CPF obrigatório"
      if (!empForm.telefone || empForm.telefone.replace(/\D/g,"").length < 10) e.telefone = "Telefone do responsável inválido"
      if (!empForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empForm.email)) e.email = "E-mail inválido"
      if (!empForm.senha || empForm.senha.length < 6) e.senha = "Mínimo 6 caracteres"
      if (empForm.senha !== empForm.confirmar) e.confirmar = "Senhas não coincidem"
    }
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmitDados = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarDados()) return
    setEnviando(true)
    try {
      if (tipo === "PF") {
        await AuthService.registerNewUser({
          nome: pfForm.nome,
          email: pfForm.email,
          telefone: pfForm.telefone.replace(/\D/g, ""),
          senha: pfForm.senha,
          tipoConta: "CLIENTE_CONSULTA",
          cpf: pfForm.cpf.replace(/\D/g, ""),
          dataNascimento: pfForm.dataNascimento || undefined,
        })
      } else {
        await AuthService.registerNewUser({
          nome: empForm.nome,
          email: empForm.email,
          telefone: empForm.telefone.replace(/\D/g, ""),
          senha: empForm.senha,
          tipoConta: "CLIENTE_CONSULTA",
          nomeEmpresa: empForm.nomeEmpresa,
          cnpjEmpresa: empForm.cnpjEmpresa,
          telefoneEmpresa: empForm.telefoneEmpresa,
          enderecoEmpresa: empForm.enderecoEmpresa,
          cepEmpresa: empForm.cepEmpresa,
        })
      }
      const dadosLocal = {
        nome: tipo === "PF" ? pfForm.nome : empForm.nome,
        email: tipo === "PF" ? pfForm.email : empForm.email,
        tipo,
      }
      localStorage.setItem("movixflow_cliente_pre_registro", JSON.stringify(dadosLocal))
      setStep("vinculo")
      buscarEmpresas()
    } catch (err: any) {
      toast.error(err?.response?.data?.mensagem ?? "Erro ao criar conta. Tente novamente.")
    } finally { setEnviando(false) }
  }

  const handleSelecionarEVincular = async (emp: Empresa) => {
    if (vinculando) return
    setEmpSelecionada(emp)
    setVinculando(true)
    try {
      const email = tipo === "PF" ? pfForm.email : empForm.email
      await api.post("/clientes/vinculos", { emailCliente: email, idEmpresaParceira: emp.id })
      localStorage.removeItem("movixflow_cliente_pre_registro")
      AuthService.logout()
      logoutCliente()
      toast.success(`Solicitação enviada para ${emp.nome}! Agora acesse com seu e-mail e senha.`)
      reset()
    } catch (err: any) {
      setEmpSelecionada(null)
      toast.error(err?.response?.data?.mensagem ?? "Erro ao solicitar vínculo.")
    } finally { setVinculando(false) }
  }

  const setPF = (f: keyof PFForm, v: string) => { setPfForm(p => ({...p, [f]: v})); setFieldErrors(p => ({...p, [f]: ""})) }
  const setEmp = (f: keyof EmpresaForm, v: string) => { setEmpForm(p => ({...p, [f]: v})); setFieldErrors(p => ({...p, [f]: ""})) }

  const tipoAtivo = TIPOS.find(t => t.value === tipo)
  const cor = tipoAtivo ? colorMap[tipoAtivo.color] : colorMap.indigo

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && view === "register") return; if (!v) reset(); onOpenChange(v) }}>
      <DialogContent
        className={cn("p-0 overflow-hidden bg-white border-slate-200 rounded-[2rem] shadow-2xl transition-all duration-300 max-h-[90vh] flex flex-col", view === "login" ? "sm:max-w-[400px]" : "sm:max-w-[500px]")}
        onInteractOutside={(e) => { if (view === "register") e.preventDefault() }}
        onEscapeKeyDown={(e) => { if (view === "register") e.preventDefault() }}
      >

        {/* ── Header ── */}
        <div className="bg-gradient-to-b from-slate-50 to-white px-6 pt-6 pb-3 text-center border-b border-slate-100 relative overflow-hidden shrink-0">
          {/* Blobs flutuantes dinâmicos */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[120%] bg-indigo-200/30 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[80%] bg-violet-200/30 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="mx-auto w-12 h-12 bg-white border border-indigo-50 rounded-xl shadow-xl shadow-indigo-500/10 flex items-center justify-center mb-3 relative z-10 -rotate-3 hover:rotate-3 transition-transform duration-500">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-inner">
              <UserCircle className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div className="relative z-10" key={`${view}-${step}`} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} transition={{ duration:0.18 }}>
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                {view === "login"    ? "Acesso à Plataforma"
                  : step === "dados"   ? "Crie sua Conta"
                  : step === "vinculo" ? "Vincular Parceiro"
                  : "Conta Criada"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {view === "login"    ? "Gerencie suas consultas e frota."
                  : step === "dados"   ? "Preencha as informações com atenção."
                  : step === "vinculo" ? "Escolha a empresa para autorização."
                  : "Sua conta já pode ser utilizada."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Tabs — só na view de login */}
          {view === "login" && (
            <div className="flex mt-4 bg-slate-100/80 rounded-xl p-1 gap-1 relative z-10 shadow-inner max-w-sm mx-auto">
              <TabBtn active={true} onClick={() => {}}>Entrar</TabBtn>
              <TabBtn active={false} onClick={() => { AuthService.logout(); logoutCliente(); setView("register"); setStep("dados"); setTipo("EMPRESA_CONSULTAS") }}>Criar conta</TabBtn>
            </div>
          )}

          {/* Stepper — só no register */}
          {view === "register" && step !== "sucesso" && (
            <div className="flex items-center justify-center gap-2 mt-4 relative z-10">
              {(["dados","vinculo"] as RegStep[]).map((s, i) => (
                <React.Fragment key={s}>
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                    step === s ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                    : (step === "vinculo" && i === 0) ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-400"
                  )}>
                    {(step === "vinculo" && i === 0) ? <CheckCircle2 className="w-3.5 h-3.5"/> : i+1}
                  </div>
                  {i < 1 && <div className={cn("h-px w-6 transition-all", (step === "vinculo" && i === 0) ? "bg-indigo-600" : "bg-slate-200")} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">

            {/* ───── LOGIN ───── */}
            {view === "login" && (
              <motion.div key="login" initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }} transition={{ duration:0.25, ease: "easeOut" }} className="space-y-4">
                {loginError && <ErrorBox msg={loginError} />}

                <form onSubmit={handleLogin} className="space-y-4">
                  <Field label="E-mail profissional">
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <Input type="email" placeholder="nome@empresa.com.br" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="pl-10 h-11 bg-slate-50 hover:bg-white focus:bg-white border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm text-sm text-slate-800 font-medium placeholder:text-slate-400" required />
                    </div>
                  </Field>
                  <Field label="Senha" aside={<button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Esqueceu a senha?</button>}>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <Input type={showLoginPwd ? "text":"password"} placeholder="••••••••" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} className="pl-10 pr-10 h-11 bg-slate-50 hover:bg-white focus:bg-white border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm text-sm text-slate-800 font-medium placeholder:text-slate-400 tracking-wider" required />
                      <ToggleEye show={showLoginPwd} onToggle={() => setShowLoginPwd(p => !p)} />
                    </div>
                  </Field>
                  <div className="pt-1">
                    <Button type="submit" disabled={loginando} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.25)] active:scale-[0.98] transition-all">
                      {loginando ? <><Loader2 className="w-4 h-4 animate-spin mr-2"/>Entrando...</> : <><span>Entrar na Plataforma</span><ArrowRight className="ml-2 w-4 h-4"/></>}
                    </Button>
                  </div>
                </form>

                <div className="flex flex-col items-center gap-1 mt-2">
                  <button type="button" onClick={() => { AuthService.logout(); logoutCliente(); setView("register"); setStep("dados"); setTipo("EMPRESA_CONSULTAS") }} className="text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors py-1.5 px-4 rounded-xl hover:bg-indigo-50">Não tem acesso? Crie uma conta grátis</button>
                </div>
              </motion.div>
            )}

            {/* ───── STEP: DADOS ───── */}
            {view === "register" && step === "dados" && (
              <motion.div key="step-dados" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.2 }}>
                <form onSubmit={handleSubmitDados} className="space-y-3">

                  {/* ── PESSOA FÍSICA ── */}
                  {tipo === "PF" && (
                    <div className="space-y-5 animate-in slide-in-from-bottom-2 fade-in duration-500">
                      <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4">
                        <Field label="Nome completo" error={fieldErrors.nome}>
                          <InputIcon icon={<User className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                            <Input placeholder="Como você gostaria de ser chamado?" value={pfForm.nome} onChange={e => setPF("nome", e.target.value)} className="pl-11 h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm" />
                          </InputIcon>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                          <Field label="CPF" error={fieldErrors.cpf}>
                            <InputIcon icon={<FileText className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                              <Input placeholder="000.000.000-00" value={pfForm.cpf} onChange={e => setPF("cpf", maskCPF(e.target.value))} className="pl-11 h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm font-medium tracking-wider" />
                            </InputIcon>
                          </Field>
                          <Field label="Data de Nascimento">
                            <Input type="date" value={pfForm.dataNascimento} onChange={e => setPF("dataNascimento", e.target.value)} className="h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm" />
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Telefone" error={fieldErrors.telefone}>
                            <InputIcon icon={<Phone className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                              <Input placeholder="(00) 00000-0000" value={pfForm.telefone} onChange={e => setPF("telefone", maskPhone(e.target.value))} className="pl-11 h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm" />
                            </InputIcon>
                          </Field>
                          <Field label="E-mail" error={fieldErrors.email}>
                            <InputIcon icon={<Mail className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                              <Input type="email" placeholder="voce@email.com" value={pfForm.email} onChange={e => setPF("email", e.target.value)} className="pl-11 h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm" />
                            </InputIcon>
                          </Field>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-slate-400" />
                          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Segurança da Conta</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Senha" error={fieldErrors.senha}>
                            <div className="relative group">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                              <Input type={showPwd?"text":"password"} placeholder="••••••••" value={pfForm.senha} onChange={e => setPF("senha", e.target.value)} className="pl-11 pr-11 h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm" />
                              <ToggleEye show={showPwd} onToggle={() => setShowPwd(p=>!p)} />
                            </div>
                          </Field>
                          <Field label="Confirmar Senha" error={fieldErrors.confirmar}>
                            <div className="relative group">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                              <Input type={showConfirm?"text":"password"} placeholder="••••••••" value={pfForm.confirmar} onChange={e => setPF("confirmar", e.target.value)} className="pl-11 pr-11 h-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all shadow-sm" />
                              <ToggleEye show={showConfirm} onToggle={() => setShowConfirm(p=>!p)} />
                            </div>
                          </Field>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── EMPRESA ── */}
                  {(tipo === "EMPRESA_TERCEIRA" || tipo === "EMPRESA_CONSULTAS") && (
                    <div className="space-y-5 animate-in slide-in-from-bottom-2 fade-in duration-500">
                      
                      {/* Dados da Empresa */}
                      <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm space-y-5 relative overflow-hidden group/box hover:border-indigo-200 transition-colors">
                        <div className="absolute top-0 right-0 p-6 -mr-6 -mt-6 opacity-[0.02] group-hover/box:opacity-[0.04] transition-opacity"><Building2 className="w-40 h-40 text-slate-900" /></div>
                        <div className="relative">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                              <Building2 className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900">Dados da Instituição</h3>
                              <p className="text-[11px] text-slate-500 font-medium tracking-wide">Informações oficiais da empresa</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Razão Social" error={fieldErrors.nomeEmpresa} className="col-span-2">
                              <InputIcon icon={<Building2 className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                                <Input placeholder="Sua Empresa Logística Ltda" value={empForm.nomeEmpresa} onChange={e => setEmp("nomeEmpresa", e.target.value)} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all" />
                              </InputIcon>
                            </Field>
                            <Field label="CNPJ" error={fieldErrors.cnpjEmpresa}>
                              <Input placeholder="00.000.000/0001-00" value={empForm.cnpjEmpresa} onChange={e => setEmp("cnpjEmpresa", maskCNPJ(e.target.value))} className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all text-center tracking-wider font-semibold text-slate-700" />
                            </Field>
                            <Field label="Telefone da Empresa" error={fieldErrors.telefoneEmpresa}>
                              <InputIcon icon={<Phone className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                                <Input placeholder="(00) 0000-0000" value={empForm.telefoneEmpresa} onChange={e => setEmp("telefoneEmpresa", maskPhone(e.target.value))} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all" />
                              </InputIcon>
                            </Field>
                            <Field label="CEP" error={fieldErrors.cepEmpresa}>
                              <InputIcon icon={<MapPin className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                                <Input placeholder="00000-000" value={empForm.cepEmpresa} onChange={e => {
                                  let v = e.target.value.replace(/\D/g, "").slice(0, 8);
                                  v = v.replace(/^(\d{5})(\d)/, "$1-$2");
                                  setEmp("cepEmpresa", v)
                                }} className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all" />
                              </InputIcon>
                            </Field>
                            <Field label="Endereço Completo" error={fieldErrors.enderecoEmpresa}>
                              <Input placeholder="Rua, Número, Bairro..." value={empForm.enderecoEmpresa} onChange={e => setEmp("enderecoEmpresa", e.target.value)} className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl transition-all" />
                            </Field>
                          </div>
                        </div>
                      </div>

                      {/* Dados do Administrador */}
                      <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/50 p-6 rounded-[1.5rem] border border-indigo-100 mt-6 space-y-5 relative overflow-hidden shadow-[inset_0_1px_3px_rgba(255,255,255,0.6)]">
                        <div className="absolute top-0 right-0 p-4 -mr-4 -mt-4 opacity-[0.03]"><ShieldCheck className="w-40 h-40 text-indigo-900" /></div>
                        <div className="relative">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                              <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-indigo-900">Credenciais de Acesso</h3>
                              <p className="text-[10px] text-indigo-600/70 font-black uppercase tracking-wider">Conta do Administrador</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Nome do Responsável" error={fieldErrors.nome} className="col-span-2">
                              <InputIcon icon={<User className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                                <Input placeholder="Nome completo" value={empForm.nome} onChange={e => setEmp("nome", e.target.value)} className="pl-11 h-12 bg-white border-white focus:bg-white focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl shadow-sm transition-all" />
                              </InputIcon>
                            </Field>
                            
                            <Field label="CPF do Responsável" error={fieldErrors.cpf}>
                              <InputIcon icon={<FileText className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                                <Input placeholder="000.000.000-00" value={empForm.cpf} onChange={e => setEmp("cpf", maskCPF(e.target.value))} className="pl-11 h-12 bg-white border-white focus:bg-white focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl shadow-sm transition-all text-center tracking-wider font-semibold text-slate-700" />
                              </InputIcon>
                            </Field>
                            <Field label="Celular Pessoal" error={fieldErrors.telefone}>
                              <InputIcon icon={<Phone className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                                <Input placeholder="(00) 00000-0000" value={empForm.telefone} onChange={e => setEmp("telefone", maskPhone(e.target.value))} className="pl-11 h-12 bg-white border-white focus:bg-white focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl shadow-sm transition-all" />
                              </InputIcon>
                            </Field>
                            
                            <Field label="E-mail de Acesso" error={fieldErrors.email} className="col-span-2">
                              <InputIcon icon={<Mail className="w-4.5 h-4.5 group-focus-within:text-indigo-500 transition-colors"/>}>
                                <Input type="email" placeholder="voce@empresa.com.br" value={empForm.email} onChange={e => setEmp("email", e.target.value)} className="pl-11 h-12 bg-white border-white focus:bg-white focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl shadow-sm transition-all text-indigo-900 font-medium" />
                              </InputIcon>
                            </Field>
                            
                            <Field label="Crie uma Senha" error={fieldErrors.senha}>
                              <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <Input type={showPwd?"text":"password"} placeholder="••••••••" value={empForm.senha} onChange={e => setEmp("senha", e.target.value)} className="pl-11 pr-11 h-12 bg-white border-white focus:bg-white focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl shadow-sm transition-all font-medium" />
                                <ToggleEye show={showPwd} onToggle={() => setShowPwd(p=>!p)} />
                              </div>
                            </Field>
                            <Field label="Confirmar Senha" error={fieldErrors.confirmar}>
                              <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <Input type={showConfirm?"text":"password"} placeholder="••••••••" value={empForm.confirmar} onChange={e => setEmp("confirmar", e.target.value)} className="pl-11 pr-11 h-12 bg-white border-white focus:bg-white focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/20 rounded-xl shadow-sm transition-all font-medium" />
                                <ToggleEye show={showConfirm} onToggle={() => setShowConfirm(p=>!p)} />
                              </div>
                            </Field>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-6 border-t border-slate-100 mt-8">
                    <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors" onClick={() => setView("login")} disabled={enviando}>
                      <ArrowLeft className="w-4 h-4 mr-1.5" />Voltar
                    </Button>
                    <Button type="submit" disabled={enviando} className="flex-[2] h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] active:scale-[0.98] hover:-translate-y-0.5 transition-all">
                      {enviando ? <><Loader2 className="w-4 h-4 animate-spin mr-1.5"/>Criando conta...</> : <>Finalizar Cadastro <ArrowRight className="ml-1.5 w-4 h-4"/></>}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ───── STEP: VÍNCULO ───── */}
            {view === "register" && step === "vinculo" && (
              <motion.div key="step-vinculo" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.2 }} className="space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3 items-start">
                  <Link2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    Selecione a empresa parceira para enviar sua solicitação de acesso. A empresa irá analisar e aprovar seu cadastro antes que você possa entrar na plataforma.
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-400 rounded-xl"
                    placeholder="Buscar empresa por nome ou CNPJ..."
                    value={buscaEmp}
                    onChange={e => setBuscaEmp(e.target.value)}
                    onFocus={() => { if (empresas.length === 0) buscarEmpresas() }}
                  />
                </div>

                {buscando && <div className="flex justify-center py-3"><Loader2 className="w-5 h-5 animate-spin text-indigo-400"/></div>}

                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {!buscando && empresas.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-3">Nenhuma empresa encontrada.</p>
                  )}
                  {empresas
                    .filter(emp =>
                      !buscaEmp ||
                      emp.nome.toLowerCase().includes(buscaEmp.toLowerCase()) ||
                      emp.cnpj.replace(/\D/g, "").includes(buscaEmp.replace(/\D/g, ""))
                    )
                    .map(emp => {
                      const selecionada = empSelecionada?.id === emp.id
                      return (
                        <button key={emp.id} type="button"
                          onClick={() => handleSelecionarEVincular(emp)}
                          disabled={vinculando}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border transition-all",
                            selecionada && vinculando
                              ? "border-indigo-400 bg-indigo-50 opacity-70 cursor-wait"
                              : "border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/50 active:scale-[0.99]",
                            vinculando && !selecionada ? "opacity-40 cursor-not-allowed" : ""
                          )}>
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold text-sm text-slate-900">{emp.nome}</p>
                              <p className="text-xs text-slate-400">{emp.cnpj}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                              {selecionada && vinculando
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                                : <><MapPin className="w-3 h-3"/>{emp.endereco}</>
                              }
                            </div>
                          </div>
                        </button>
                      )
                    })}
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="bg-slate-50 px-7 py-3.5 flex items-center justify-center gap-2 border-t border-slate-100 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">Conexão Segura 256-bit</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
      {children}
    </button>
  )
}

function Field({ label, aside, error, children, className }: { label: string; aside?: React.ReactNode; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</Label>
        {aside}
      </div>
      {children}
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  )
}

function InputIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      {children}
    </div>
  )
}

function ToggleEye({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none">
      {show ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
    </button>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5">
      <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
        <X className="w-3 h-3 text-white"/>
      </div>
      <p className="text-sm text-rose-700 font-semibold">{msg}</p>
    </div>
  )
}

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"/></div>
      <div className="relative flex justify-center text-[10px]">
        <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">ou use seu e-mail</span>
      </div>
    </div>
  )
}

