"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Building2,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Lock,
  MapPin,
  FileText,
  UserCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getTodasEmpresas, type Empresa } from "@/src/services/empresa.service"
import { api } from "@/src/service/Api"

// ─── Masks / Validation ───────────────────────────────────────────────────────

function maskCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}
function maskCNPJ(v: string) {
  return v.replace(/\D/g, "").slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}
function maskPhone(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}
function validarCPF(cpf: string) {
  const s = cpf.replace(/\D/g, "")
  if (s.length !== 11 || /^(\d)\1+$/.test(s)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += +s[i] * (10 - i)
  let r = (sum * 10) % 11; if (r === 10 || r === 11) r = 0
  if (r !== +s[9]) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += +s[i] * (11 - i)
  r = (sum * 10) % 11; if (r === 10 || r === 11) r = 0
  return r === +s[10]
}
function validarCNPJ(cnpj: string) {
  const s = cnpj.replace(/\D/g, "")
  if (s.length !== 14 || /^(\d)\1+$/.test(s)) return false
  const calc = (n: string, w: number[]) => {
    let sum = 0; for (let i = 0; i < w.length; i++) sum += +n[i] * w[i]
    const r = sum % 11; return r < 2 ? 0 : 11 - r
  }
  return calc(s, [5,4,3,2,9,8,7,6,5,4,3,2]) === +s[12] &&
         calc(s, [6,5,4,3,2,9,8,7,6,5,4,3,2]) === +s[13]
}

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoCadastro = "cliente" | "empresa"

interface ClienteForm {
  nome: string
  documento: string  // CPF ou CNPJ
  email: string
  telefone: string
  senha: string
  confirmarSenha: string
}

interface EmpresaForm {
  razaoSocial: string
  cnpj: string
  nomeResponsavel: string
  emailResponsavel: string
  telefone: string
  cidade: string
  estado: string
  senha: string
  confirmarSenha: string
}

// ─── Estado inicial ───────────────────────────────────────────────────────────

const clienteInicial: ClienteForm = {
  nome: "", documento: "", email: "", telefone: "", senha: "", confirmarSenha: "",
}
const empresaInicial: EmpresaForm = {
  razaoSocial: "", cnpj: "", nomeResponsavel: "", emailResponsavel: "",
  telefone: "", cidade: "", estado: "", senha: "", confirmarSenha: "",
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CadastroModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CadastroModal({ open, onOpenChange }: CadastroModalProps) {
  const [tipo, setTipo] = useState<TipoCadastro | null>(null)
  const [clienteForm, setClienteForm] = useState<ClienteForm>(clienteInicial)
  const [empresaForm, setEmpresaForm] = useState<EmpresaForm>(empresaInicial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loadingEmpresas, setLoadingEmpresas] = useState(false)
  const [idEmpresaSelecionada, setIdEmpresaSelecionada] = useState("")

  useEffect(() => {
    if (tipo === "cliente") {
      setLoadingEmpresas(true)
      getTodasEmpresas()
        .then(setEmpresas)
        .catch(() => toast.error("Não foi possível carregar as empresas."))
        .finally(() => setLoadingEmpresas(false))
    }
  }, [tipo])

  const reset = () => {
    setTipo(null)
    setClienteForm(clienteInicial)
    setEmpresaForm(empresaInicial)
    setErrors({})
    setShowSenha(false)
    setShowConfirmar(false)
    setEnviando(false)
    setSucesso(false)
    setEmpresas([])
    setIdEmpresaSelecionada("")
  }

  const handleClose = (v: boolean) => {
    if (!v) reset()
    onOpenChange(v)
  }

  // ── Validações ──────────────────────────────────────────────────────────────

  const validarCliente = (): boolean => {
    const e: Record<string, string> = {}
    if (!clienteForm.nome.trim() || clienteForm.nome.trim().length < 3)
      e.nome = "Nome deve ter ao menos 3 caracteres"
    const doc = clienteForm.documento.replace(/\D/g, "")
    if (!doc) e.documento = "Documento obrigatório"
    else if (doc.length === 11 && !validarCPF(clienteForm.documento))
      e.documento = "CPF inválido"
    else if (doc.length === 14 && !validarCNPJ(clienteForm.documento))
      e.documento = "CNPJ inválido"
    else if (doc.length !== 11 && doc.length !== 14)
      e.documento = "CPF ou CNPJ inválido"
    if (!clienteForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteForm.email))
      e.email = "E-mail inválido"
    if (!clienteForm.telefone || clienteForm.telefone.replace(/\D/g, "").length < 10)
      e.telefone = "Telefone inválido"
    if (!clienteForm.senha || clienteForm.senha.length < 6)
      e.senha = "Senha deve ter ao menos 6 caracteres"
    if (clienteForm.senha !== clienteForm.confirmarSenha)
      e.confirmarSenha = "As senhas não coincidem"
    if (!idEmpresaSelecionada)
      e.idEmpresa = "Selecione uma empresa"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validarEmpresa = (): boolean => {
    const e: Record<string, string> = {}
    if (!empresaForm.razaoSocial.trim() || empresaForm.razaoSocial.trim().length < 3)
      e.razaoSocial = "Razão social deve ter ao menos 3 caracteres"
    if (!empresaForm.cnpj || !validarCNPJ(empresaForm.cnpj))
      e.cnpj = "CNPJ inválido"
    if (!empresaForm.nomeResponsavel.trim() || empresaForm.nomeResponsavel.trim().length < 3)
      e.nomeResponsavel = "Nome do responsável obrigatório"
    if (!empresaForm.emailResponsavel || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresaForm.emailResponsavel))
      e.emailResponsavel = "E-mail inválido"
    if (!empresaForm.telefone || empresaForm.telefone.replace(/\D/g, "").length < 10)
      e.telefone = "Telefone inválido"
    if (!empresaForm.cidade.trim()) e.cidade = "Cidade obrigatória"
    if (!empresaForm.estado.trim() || empresaForm.estado.trim().length !== 2)
      e.estado = "UF obrigatória (ex: SP)"
    if (!empresaForm.senha || empresaForm.senha.length < 6)
      e.senha = "Senha deve ter ao menos 6 caracteres"
    if (empresaForm.senha !== empresaForm.confirmarSenha)
      e.confirmarSenha = "As senhas não coincidem"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Envio ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const valido = tipo === "cliente" ? validarCliente() : validarEmpresa()
    if (!valido) return

    setEnviando(true)
    try {
      if (tipo === "cliente") {
        await api.post("/clientes/cadastro", {
          nome: clienteForm.nome,
          documento: clienteForm.documento.replace(/\D/g, ""),
          email: clienteForm.email,
          telefone: clienteForm.telefone.replace(/\D/g, ""),
          senha: clienteForm.senha,
          idEmpresa: idEmpresaSelecionada,
        })
      } else {
        await api.post("/empresas/cadastro", {
          razaoSocial: empresaForm.razaoSocial,
          cnpj: empresaForm.cnpj.replace(/\D/g, ""),
          nomeResponsavel: empresaForm.nomeResponsavel,
          emailResponsavel: empresaForm.emailResponsavel,
          telefone: empresaForm.telefone.replace(/\D/g, ""),
          cidade: empresaForm.cidade,
          estado: empresaForm.estado.toUpperCase(),
          senha: empresaForm.senha,
        })
      }
      setSucesso(true)
    } catch (err: any) {
      const msg = err?.response?.data?.mensagem ?? "Erro ao realizar cadastro. Tente novamente."
      toast.error(msg)
    } finally {
      setEnviando(false)
    }
  }

  // ── Helpers de campo ────────────────────────────────────────────────────────

  const setC = (field: keyof ClienteForm, value: string) => {
    setClienteForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => ({ ...p, [field]: "" }))
  }
  const setE = (field: keyof EmpresaForm, value: string) => {
    setEmpresaForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => ({ ...p, [field]: "" }))
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {sucesso ? "Cadastro realizado!" : tipo ? (tipo === "cliente" ? "Cadastro de Cliente" : "Cadastro de Empresa Parceira") : "Criar conta"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {sucesso
              ? undefined
              : tipo
              ? "Preencha os dados abaixo para criar sua conta"
              : "Selecione o tipo de cadastro que deseja realizar"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* ── TELA: Escolha do tipo ── */}
          {!tipo && !sucesso && (
            <motion.div
              key="escolha"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-4 py-4"
            >
              <button
                type="button"
                onClick={() => setTipo("cliente")}
                className="group flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
              >
                <div className="w-14 h-14 bg-indigo-100 group-hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <UserCircle className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 group-hover:text-indigo-700 text-lg transition-colors">
                    Sou Cliente
                  </p>
                  <p className="text-sm text-gray-500">
                    Pessoa física ou jurídica que deseja solicitar consultas de risco
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 ml-auto transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => setTipo("empresa")}
                className="group flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <Building2 className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 group-hover:text-blue-700 text-lg transition-colors">
                    Sou Empresa Parceira
                  </p>
                  <p className="text-sm text-gray-500">
                    Empresa que deseja se vincular e processar consultas de risco
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 ml-auto transition-colors" />
              </button>
            </motion.div>
          )}

          {/* ── TELA: Formulário Cliente ── */}
          {tipo === "cliente" && !sucesso && (
            <motion.form
              key="form-cliente"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4 py-4"
            >
              <CampoForm
                label="Nome completo / Razão social"
                icon={<User className="w-4 h-4" />}
                error={errors.nome}
              >
                <Input
                  placeholder="João da Silva"
                  value={clienteForm.nome}
                  onChange={(e) => setC("nome", e.target.value)}
                />
              </CampoForm>

              <CampoForm
                label="CPF ou CNPJ"
                icon={<FileText className="w-4 h-4" />}
                error={errors.documento}
              >
                <Input
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  value={clienteForm.documento}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "")
                    setC("documento", raw.length <= 11 ? maskCPF(e.target.value) : maskCNPJ(e.target.value))
                  }}
                />
              </CampoForm>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CampoForm label="E-mail" icon={<Mail className="w-4 h-4" />} error={errors.email}>
                  <Input
                    type="email"
                    placeholder="voce@email.com"
                    value={clienteForm.email}
                    onChange={(e) => setC("email", e.target.value)}
                  />
                </CampoForm>
                <CampoForm label="Telefone" icon={<Phone className="w-4 h-4" />} error={errors.telefone}>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={clienteForm.telefone}
                    onChange={(e) => setC("telefone", maskPhone(e.target.value))}
                  />
                </CampoForm>
              </div>

              <CampoForm label="Empresa" icon={<Building2 className="w-4 h-4" />} error={errors.idEmpresa}>
                <Select
                  value={idEmpresaSelecionada}
                  onValueChange={(v) => {
                    setIdEmpresaSelecionada(v)
                    setErrors((p) => ({ ...p, idEmpresa: "" }))
                  }}
                  disabled={loadingEmpresas}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingEmpresas ? "Carregando empresas..." : "Selecione uma empresa"} />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CampoForm>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CampoForm label="Senha" icon={<Lock className="w-4 h-4" />} error={errors.senha}>
                  <div className="relative">
                    <Input
                      type={showSenha ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={clienteForm.senha}
                      onChange={(e) => setC("senha", e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowSenha((p) => !p)}
                    >
                      {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </CampoForm>
                <CampoForm label="Confirmar senha" error={errors.confirmarSenha}>
                  <div className="relative">
                    <Input
                      type={showConfirmar ? "text" : "password"}
                      placeholder="Repita a senha"
                      value={clienteForm.confirmarSenha}
                      onChange={(e) => setC("confirmarSenha", e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmar((p) => !p)}
                    >
                      {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </CampoForm>
              </div>

              <FormFooter
                onBack={() => { setTipo(null); setErrors({}) }}
                enviando={enviando}
              />
            </motion.form>
          )}

          {/* ── TELA: Formulário Empresa Parceira ── */}
          {tipo === "empresa" && !sucesso && (
            <motion.form
              key="form-empresa"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4 py-4"
            >
              <CampoForm label="Razão social" icon={<Building2 className="w-4 h-4" />} error={errors.razaoSocial}>
                <Input
                  placeholder="Transportadora Exemplo Ltda"
                  value={empresaForm.razaoSocial}
                  onChange={(e) => setE("razaoSocial", e.target.value)}
                />
              </CampoForm>

              <CampoForm label="CNPJ" icon={<FileText className="w-4 h-4" />} error={errors.cnpj}>
                <Input
                  placeholder="00.000.000/0001-00"
                  value={empresaForm.cnpj}
                  onChange={(e) => setE("cnpj", maskCNPJ(e.target.value))}
                />
              </CampoForm>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CampoForm label="Nome do responsável" icon={<User className="w-4 h-4" />} error={errors.nomeResponsavel} className="sm:col-span-2">
                  <Input
                    placeholder="Nome do responsável pelo cadastro"
                    value={empresaForm.nomeResponsavel}
                    onChange={(e) => setE("nomeResponsavel", e.target.value)}
                  />
                </CampoForm>

                <CampoForm label="E-mail do responsável" icon={<Mail className="w-4 h-4" />} error={errors.emailResponsavel}>
                  <Input
                    type="email"
                    placeholder="responsavel@empresa.com"
                    value={empresaForm.emailResponsavel}
                    onChange={(e) => setE("emailResponsavel", e.target.value)}
                  />
                </CampoForm>

                <CampoForm label="Telefone" icon={<Phone className="w-4 h-4" />} error={errors.telefone}>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={empresaForm.telefone}
                    onChange={(e) => setE("telefone", maskPhone(e.target.value))}
                  />
                </CampoForm>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CampoForm label="Cidade" icon={<MapPin className="w-4 h-4" />} error={errors.cidade}>
                  <Input
                    placeholder="São Paulo"
                    value={empresaForm.cidade}
                    onChange={(e) => setE("cidade", e.target.value)}
                  />
                </CampoForm>
                <CampoForm label="Estado (UF)" error={errors.estado}>
                  <Input
                    placeholder="SP"
                    maxLength={2}
                    value={empresaForm.estado}
                    onChange={(e) => setE("estado", e.target.value.toUpperCase())}
                  />
                </CampoForm>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CampoForm label="Senha" icon={<Lock className="w-4 h-4" />} error={errors.senha}>
                  <div className="relative">
                    <Input
                      type={showSenha ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={empresaForm.senha}
                      onChange={(e) => setE("senha", e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowSenha((p) => !p)}
                    >
                      {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </CampoForm>
                <CampoForm label="Confirmar senha" error={errors.confirmarSenha}>
                  <div className="relative">
                    <Input
                      type={showConfirmar ? "text" : "password"}
                      placeholder="Repita a senha"
                      value={empresaForm.confirmarSenha}
                      onChange={(e) => setE("confirmarSenha", e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmar((p) => !p)}
                    >
                      {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </CampoForm>
              </div>

              <FormFooter
                onBack={() => { setTipo(null); setErrors({}) }}
                enviando={enviando}
              />
            </motion.form>
          )}

          {/* ── TELA: Sucesso ── */}
          {sucesso && (
            <motion.div
              key="sucesso"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5 py-8 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-1">
                  {tipo === "cliente" ? "Cadastro realizado!" : "Solicitação enviada!"}
                </h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  {tipo === "cliente"
                    ? "Sua conta foi criada. Acesse com seu e-mail e senha para solicitar consultas de risco."
                    : "Sua solicitação de parceria foi recebida. Nossa equipe entrará em contato em breve para concluir o vínculo."}
                </p>
              </div>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 mt-2"
                onClick={() => handleClose(false)}
              >
                Fechar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function CampoForm({
  label,
  icon,
  error,
  children,
  className,
}: {
  label?: string
  icon?: React.ReactNode
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          {icon && <span className="text-gray-400">{icon}</span>}
          {label}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function FormFooter({
  onBack,
  enviando,
}: {
  onBack: () => void
  enviando: boolean
}) {
  return (
    <div className="flex gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        className="flex-1 rounded-xl"
        onClick={onBack}
        disabled={enviando}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar
      </Button>
      <Button
        type="submit"
        disabled={enviando}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
      >
        {enviando ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Enviando...</>
        ) : (
          <><CheckCircle2 className="w-4 h-4 mr-1" /> Criar conta</>
        )}
      </Button>
    </div>
  )
}
