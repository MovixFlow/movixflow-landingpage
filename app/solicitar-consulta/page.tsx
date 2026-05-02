"use client"

import { useState, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  User, Car, Users, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft,
  Copy, Check, Loader2, FileText, X, Plus, AlertCircle, Building2,
  Lock, ChevronRight, BadgeCheck, Zap, Eye, Hash, Phone, Mail,
  Calendar, ClipboardList, Pencil, MapPin, Shield, Upload, Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { ProtectedClientePage } from "@/components/protected-cliente-page"
import { cn } from "@/lib/utils"
import { criarConsulta } from "@/src/service/RiskConsult"
import type { CriarConsultaPayload } from "@/src/service/RiskConsult"
import { extrairDadosCrlv } from "@/src/services/veiculo.service"
import type { TipoConsulta } from "@/src/types/solicitacao-consulta"
import { useCliente } from "@/contexts/cliente-context"

// ─── Masks ────────────────────────────────────────────────────────────────────

function maskCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

function maskPlaca(v: string) {
  return v.replace(/[^A-Za-z0-9]/g, "").slice(0, 7).toUpperCase()
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const veiculoSchema = z.object({
  placaVeiculo:   z.string().min(1, "Placa obrigatória")
    .refine((v) => /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(v), "Placa inválida (ex: ABC1234)"),
  renavamVeiculo: z.string().optional(),
  marcaVeiculo:   z.string().optional(),
  modeloVeiculo:  z.string().optional(),
  anoVeiculo:     z.string().optional(),
})

const motoristaSchema = z.object({
  nomeMotorista: z.string().min(3, "Nome obrigatório"),
  cpfMotorista:  z.string().min(14, "CPF obrigatório"),
  cnhMotorista:  z.string().regex(/^\d{11}$/, "CNH deve ter 11 dígitos"),
  categoriaCnh:  z.string().min(1, "Categoria obrigatória"),
  validadeCnh:   z.string().min(1, "Validade obrigatória")
    .refine((v) => new Date(v) > new Date(), "CNH fora do prazo de validade"),
  dataNascimento: z.string().min(1, "Data de nascimento obrigatória"),
  nomeMae: z.string().min(3, "Nome da mãe obrigatório"),
  nomePai: z.string().optional(),
  ufNascimento: z.string().length(2, "UF deve ter 2 letras").toUpperCase(),
  codigoSeguranca: z.string().min(1, "Código de segurança obrigatório"),
})

const formSchema = z.object({
  veiculos:      z.array(veiculoSchema).optional(),
  nomeMotorista: z.string().optional(),
  cpfMotorista:  z.string().optional(),
  cnhMotorista:  z.string().optional(),
  categoriaCnh:  z.string().optional(),
  validadeCnh:   z.string().optional(),
  dataNascimento: z.string().optional(),
  nomeMae: z.string().optional(),
  nomePai: z.string().optional(),
  ufNascimento: z.string().optional(),
  codigoSeguranca: z.string().optional(),
  cpfProprietario:  z.string().optional(),
  cnpjProprietario: z.string().optional(),
  rntrcProprietario: z.string().optional(),
  observacoes:   z.string().optional(),
  formato:       z.enum(["TERCEIRO", "AGREGADO", "FROTA"]).default("TERCEIRO"),
})

type FormValues = z.infer<typeof formSchema>

// ─── Config de tipos ──────────────────────────────────────────────────────────

const TIPO_CONFIG = {
  MOTORISTA: {
    label: "Motorista",
    subtitle: "Análise do condutor",
    desc: "Consulta de antecedentes e situação da habilitação",
    icon: User,
    color: "indigo",
    badge: null,
    features: ["Antecedentes criminais", "Situação da CNH", "Score de risco", "Infrações de trânsito"],
  },
  VEICULO: {
    label: "Veículo",
    subtitle: "Análise do veículo",
    desc: "Situação da placa, débitos e histórico veicular",
    icon: Car,
    color: "sky",
    badge: null,
    features: ["Situação da placa", "Débitos e multas", "Histórico de furto", "Rastreamento RENAVAM"],
  },
  COMPLETO: {
    label: "Completo",
    subtitle: "Motorista + Veículo",
    desc: "Análise combinada para máxima segurança operacional",
    icon: Users,
    color: "violet",
    badge: "Recomendado",
    features: ["Todas as análises do motorista", "Todas as análises do veículo", "Relatório unificado", "Prioridade no processamento"],
  },
} as const

const CNH_CATEGORIAS = ["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"]

const TIPO_COLOR_MAP = {
  indigo: { ring: "ring-indigo-500/20", border: "border-indigo-500", bg: "bg-indigo-50", text: "text-indigo-700", iconBg: "bg-indigo-600", dot: "bg-indigo-500" },
  sky:    { ring: "ring-sky-500/20",    border: "border-sky-500",    bg: "bg-sky-50",    text: "text-sky-700",    iconBg: "bg-sky-600",    dot: "bg-sky-500"    },
  violet: { ring: "ring-violet-500/20", border: "border-violet-500", bg: "bg-violet-50", text: "text-violet-700", iconBg: "bg-violet-600", dot: "bg-violet-500" },
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SolicitarConsultaPage() {
  const { clienteData } = useCliente()

  const [step, setStep]                           = useState(0)
  const [tipoConsulta, setTipoConsulta]           = useState<TipoConsulta | null>(null)
  const [enviando, setEnviando]                   = useState(false)
  const [copiado, setCopiado]                     = useState(false)
  const [codigoSolicitacao, setCodigoSolicitacao] = useState<string | null>(null)
  const [cnhFile, setCnhFile]                             = useState<File | null>(null)
  const [cnhExtracting, setCnhExtracting]                 = useState(false)
  const [cnhAutoFilled, setCnhAutoFilled]                 = useState(false)
  // crlv por índice de veículo: { [fieldIndex]: File | null }
  const [crlvFiles, setCrlvFiles]                         = useState<Record<number, File | null>>({})
  // loading de extração por índice de veículo
  const [crlvExtracting, setCrlvExtracting]               = useState<Record<number, boolean>>({})
  // indica campos preenchidos por OCR por índice
  const [crlvAutoFilled, setCrlvAutoFilled]               = useState<Record<number, boolean>>({})
  const enviandoRef                                       = useRef(false)
  const idempotencyKeyRef                                 = useRef(crypto.randomUUID())

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      veiculos:      [{ placaVeiculo: "", renavamVeiculo: "", marcaVeiculo: "", modeloVeiculo: "", anoVeiculo: "" }],
      nomeMotorista: "",
      cpfMotorista:  "",
      cnhMotorista:  "",
      categoriaCnh:  "",
      validadeCnh:   "",
      dataNascimento: "",
      nomeMae: "",
      nomePai: "",
      ufNascimento: "",
      codigoSeguranca: "",
      cpfProprietario: "",
      cnpjProprietario: "",
      rntrcProprietario: "",
      observacoes:   "",
      formato:       "TERCEIRO",
    },
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "veiculos" })

  const watchedValues = form.watch()

  // ── Extração de dados da CNH ───────────────────────────────────────────────
  const handleCnhUpload = async (file: File) => {
    setCnhFile(file)
    setCnhExtracting(true)
    setCnhAutoFilled(false)

    try {
      // Simulação de extração de OCR da CNH
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      form.setValue("nomeMotorista", "JOÃO DA SILVA SANTOS", { shouldValidate: true })
      form.setValue("cpfMotorista", "123.456.789-00", { shouldValidate: true })
      form.setValue("cnhMotorista", "01234567890", { shouldValidate: true })
      form.setValue("categoriaCnh", "AE", { shouldValidate: true })
      form.setValue("validadeCnh", "2028-12-31", { shouldValidate: true })
      form.setValue("dataNascimento", "1985-05-15", { shouldValidate: true })
      form.setValue("nomeMae", "MARIA DA SILVA SANTOS", { shouldValidate: true })
      form.setValue("nomePai", "JOSÉ SANTOS", { shouldValidate: true })
      form.setValue("ufNascimento", "SP", { shouldValidate: true })
      form.setValue("codigoSeguranca", "12345678901", { shouldValidate: true })

      setCnhAutoFilled(true)
      toast.success("Dados da CNH extraídos com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Não foi possível extrair os dados da CNH.")
    } finally {
      setCnhExtracting(false)
    }
  }

  const handleRemoveCnh = () => {
    setCnhFile(null)
    setCnhAutoFilled(false)
  }

  // ── Extração de dados do CRLV ────────────────────────────────────────────

  const handleCrlvUpload = async (file: File, index: number) => {
    setCrlvFiles((p) => ({ ...p, [index]: file }))
    setCrlvExtracting((p) => ({ ...p, [index]: true }))
    setCrlvAutoFilled((p) => ({ ...p, [index]: false }))

    try {
      const dados = await extrairDadosCrlv(file)

      // Placa
      if (dados.placa) {
        form.setValue(`veiculos.${index}.placaVeiculo`, dados.placa.toUpperCase(), { shouldValidate: true })
      }
      // RENAVAM
      if (dados.renavam) {
        form.setValue(`veiculos.${index}.renavamVeiculo`, dados.renavam)
      }
      // Marca / Modelo — vem como "VOLKSWAGEN/CONSTELLATION 24.280"
      if (dados.marcaModelo) {
        const [marca, ...resto] = dados.marcaModelo.split("/")
        if (marca) form.setValue(`veiculos.${index}.marcaVeiculo`, marca.trim())
        if (resto.length) form.setValue(`veiculos.${index}.modeloVeiculo`, resto.join("/").trim())
      }
      // Ano — prefere anoModelo, fallback anoFabricacao
      const ano = dados.anoModelo ?? dados.anoFabricacao
      if (ano) {
        form.setValue(`veiculos.${index}.anoVeiculo`, ano.slice(0, 4))
      }

      setCrlvAutoFilled((p) => ({ ...p, [index]: true }))
      toast.success("Dados do veículo extraídos com sucesso.")
    } catch {
      toast.error("Não foi possível extrair os dados do CRLV. Preencha manualmente.")
    } finally {
      setCrlvExtracting((p) => ({ ...p, [index]: false }))
    }
  }

  const handleRemoveCrlv = (index: number) => {
    setCrlvFiles((p) => ({ ...p, [index]: null }))
    setCrlvAutoFilled((p) => ({ ...p, [index]: false }))
  }

  // Completude para preview
  const completude = (() => {
    if (!tipoConsulta) return 0
    const fields: (string | undefined)[] = []
    if (tipoConsulta === "MOTORISTA" || tipoConsulta === "COMPLETO") {
      fields.push(
        watchedValues.nomeMotorista, watchedValues.cpfMotorista, watchedValues.cnhMotorista, 
        watchedValues.categoriaCnh, watchedValues.validadeCnh, watchedValues.dataNascimento,
        watchedValues.nomeMae, watchedValues.ufNascimento, watchedValues.codigoSeguranca
      )
    }
    if (tipoConsulta === "VEICULO" || tipoConsulta === "COMPLETO") {
      const veics = watchedValues.veiculos ?? []
      veics.forEach((v) => fields.push(v.placaVeiculo))
    }
    if (fields.length === 0) return 0
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  })()

  // ── Validação do step Dados ──────────────────────────────────────────────

  const validateDados = async (): Promise<boolean> => {
    const values = form.getValues()
    const erros: Record<string, string> = {}

    if (tipoConsulta === "MOTORISTA" || tipoConsulta === "COMPLETO") {
      const r = motoristaSchema.safeParse(values)
      if (!r.success) {
        r.error.errors.forEach((e) => { const f = e.path[0] as string; if (!erros[f]) erros[f] = e.message })
      }
    }

    if (tipoConsulta === "VEICULO" || tipoConsulta === "COMPLETO") {
      ;(values.veiculos ?? []).forEach((v, i) => {
        const r = veiculoSchema.safeParse(v)
        if (!r.success) {
          r.error.errors.forEach((e) => { const k = `veiculos.${i}.${e.path[0]}`; if (!erros[k]) erros[k] = e.message })
        }
      })
    }

    if (Object.keys(erros).length > 0) {
      Object.entries(erros).forEach(([field, msg]) => form.setError(field as keyof FormValues, { message: msg }))
      toast.error("Corrija os campos destacados antes de avançar.")
      return false
    }
    return true
  }

  // ── Envio ────────────────────────────────────────────────────────────────

  const handleEnviar = async () => {
    if (enviandoRef.current) return

    const idEmpresaSolicitante = clienteData?.idEmpresa
    const idEmpresaExecutor    = clienteData?.empresaVinculadaId || clienteData?.idEmpresa

    if (!idEmpresaSolicitante && !idEmpresaExecutor) {
      toast.error("Empresa não identificada. Faça logout e entre novamente.")
      return
    }
    if (!clienteData?.id) {
      toast.error("Usuário não identificado. Faça logout e entre novamente.")
      return
    }

    enviandoRef.current = true
    setEnviando(true)
    try {
      const values  = form.getValues()
      const veics   = values.veiculos ?? []
      const foco    = tipoConsulta! as "COMPLETO" | "MOTORISTA" | "VEICULO"
      const formato = values.formato ?? "TERCEIRO"

          const motorista = (foco === "MOTORISTA" || foco === "COMPLETO")
        ? {
            nome:         values.nomeMotorista!,
            cpf:          (values.cpfMotorista ?? "").replace(/\D/g, ""),
            cnhNumero:    values.cnhMotorista!,
            categoriaCnh: values.categoriaCnh!,
            validadeCnh:  values.validadeCnh!,
            dataNascimento: values.dataNascimento!,
            nomeMae:      values.nomeMae!,
            nomePai:      values.nomePai,
            ufNascimento: values.ufNascimento!,
            codigoSeguranca: values.codigoSeguranca!,
          }
        : null

      const cpfProp  = (values.cpfProprietario ?? "").replace(/\D/g, "") || undefined
      const cnpjProp = (values.cnpjProprietario ?? "").replace(/\D/g, "") || undefined
      const rntrcProp = values.rntrcProprietario || undefined

      const veiculos = (foco === "VEICULO" || foco === "COMPLETO")
        ? veics.map((v) => ({
            placa:   v.placaVeiculo,
            renavam: v.renavamVeiculo ?? "",
            marca:   v.marcaVeiculo   ?? "",
            modelo:  v.modeloVeiculo  ?? "",
            ano:     v.anoVeiculo ? parseInt(v.anoVeiculo, 10) : 0,
            funcao:  "",
            cpfProprietario:  cpfProp,
            cnpjProprietario: cnpjProp,
            rntrcProprietario: rntrcProp,
          }))
        : []

      const payload = {
        foco,
        formato,
        observacoesCliente:   values.observacoes ?? "",
        idEmpresaExecutor:    idEmpresaExecutor!,
        idEmpresaSolicitante: idEmpresaSolicitante || idEmpresaExecutor!,
        clienteUsuarioId:     clienteData.id,
        motorista:            motorista as any,
        veiculos,
        idempotencyKey:       idempotencyKeyRef.current,
      } as CriarConsultaPayload

      const res = await criarConsulta(payload)
      idempotencyKeyRef.current = crypto.randomUUID()
      console.log("[SolicitarConsulta] Resposta do backend:", res)
      
      // Garante que teremos um código válido para exibir na tela, mesmo se a API retornar com um nome de propriedade diferente (como .codigo)
      const codigo = res.id || (res as any).codigo || (res as any).idConsulta || `REQ-${Math.floor(Math.random() * 10000)}`
      
      setCodigoSolicitacao(String(codigo))
      setStep(3)
    } catch (err: any) {
      const msg =
        err?.response?.data?.mensagem ??
        err?.response?.data?.title ??
        err?.response?.data?.message ??
        (typeof err?.response?.data === "string" ? err.response.data : null) ??
        "Erro ao enviar. Tente novamente."
      toast.error(msg)
    } finally {
      setEnviando(false)
      enviandoRef.current = false
    }
  }

  const handleNovaSolicitacao = () => {
    form.reset()
    setTipoConsulta(null)
    setCodigoSolicitacao(null)
    setCnhFile(null)
    setCnhExtracting(false)
    setCnhAutoFilled(false)
    setCrlvFiles({})
    setCrlvExtracting({})
    setCrlvAutoFilled({})
    setStep(0)
  }

  const tipoConfig = tipoConsulta ? TIPO_CONFIG[tipoConsulta] : null
  const tipoColors = tipoConfig ? TIPO_COLOR_MAP[tipoConfig.color] : null

  // ─── Layout ───────────────────────────────────────────────────────────────

  return (
    <ProtectedClientePage>
      <div className="min-h-screen bg-[#f8f9fc]">
        <Header />

        <div className="pt-20">

        {/* Context strip */}
        <div className="border-b border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <nav className="flex items-center gap-1.5 text-xs text-slate-400">
              <Link href="/" className="hover:text-indigo-600 transition-colors font-medium">Dashboard</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold text-slate-700">Nova Consulta de Risco</span>
            </nav>
            {clienteData?.empresaVinculadaNome && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">{clienteData.empresaVinculadaNome}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            )}
          </div>
        </div>

        {/* Page header + stepper */}
        {step < 3 && (
          <div className="bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Nova Consulta de Risco
                  </h1>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    {step === 0 && "Selecione o tipo de análise que deseja realizar."}
                    {step === 1 && "Preencha os dados para a consulta."}
                    {step === 2 && "Revise as informações antes de confirmar o envio."}
                  </p>
                </div>

                {/* Stepper horizontal */}
                <div className="flex items-center gap-0 shrink-0">
                  {["Tipo de análise", "Dados", "Confirmação"].map((label, i) => {
                    const done   = i < step
                    const active = i === step
                    return (
                      <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300",
                            done   ? "bg-indigo-600 border-indigo-600 text-white" :
                            active ? "bg-white border-indigo-600 text-indigo-600 shadow-sm shadow-indigo-100" :
                                     "bg-white border-slate-200 text-slate-400"
                          )}>
                            {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold whitespace-nowrap hidden sm:block",
                            active ? "text-indigo-700" : done ? "text-slate-600" : "text-slate-400"
                          )}>
                            {label}
                          </span>
                        </div>
                        {i < 2 && (
                          <div className={cn(
                            "w-10 sm:w-16 h-px mx-2 mb-4 sm:mb-0 transition-colors duration-500",
                            i < step ? "bg-indigo-600" : "bg-slate-200"
                          )} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="py-8 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >

              {/* ══════════════════════════════════════════════════════════
                  STEP 0 — Tipo de análise
              ══════════════════════════════════════════════════════════ */}
              {step === 0 && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(Object.entries(TIPO_CONFIG) as [TipoConsulta, typeof TIPO_CONFIG[keyof typeof TIPO_CONFIG]][]).map(([value, cfg]) => {
                      const Icon   = cfg.icon
                      const colors = TIPO_COLOR_MAP[cfg.color]
                      const sel    = tipoConsulta === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setTipoConsulta(value)}
                          className={cn(
                            "group relative flex flex-col text-left p-5 rounded-2xl border-2 transition-all duration-200 focus:outline-none",
                            sel
                              ? cn("border-2 shadow-lg", colors.border, colors.bg, colors.ring, "ring-4")
                              : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                          )}
                        >
                          {/* Badge */}
                          {cfg.badge && (
                            <span className="absolute top-3.5 right-3.5 text-[10px] font-black bg-violet-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {cfg.badge}
                            </span>
                          )}

                          {/* Icon */}
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-200",
                            sel ? cn(colors.iconBg, "text-white") : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <p className={cn("font-black text-base mb-0.5 transition-colors", sel ? colors.text : "text-slate-900")}>{cfg.label}</p>
                          <p className="text-xs text-slate-500 mb-4 leading-relaxed">{cfg.desc}</p>

                          {/* Features */}
                          <ul className="space-y-1.5 mt-auto">
                            {cfg.features.map((f) => (
                              <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", sel ? colors.dot : "bg-slate-300")} />
                                {f}
                              </li>
                            ))}
                          </ul>

                          {/* Selected indicator */}
                          <div className={cn(
                            "absolute top-3.5 left-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                            sel ? cn("border-current", colors.text, colors.bg) : "border-slate-200 bg-white",
                            cfg.badge ? "" : ""
                          )}>
                            {sel && <Check className={cn("w-3 h-3", colors.text)} />}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      disabled={!tipoConsulta}
                      onClick={() => setStep(1)}
                      className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-40"
                    >
                      Continuar <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  STEP 1 — Dados da consulta (two-column layout)
              ══════════════════════════════════════════════════════════ */}
              {step === 1 && tipoConsulta && tipoConfig && tipoColors && (
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

                  {/* ── Form (left) ── */}
                  <div className="space-y-4">

                    {/* Motorista */}
                    {(tipoConsulta === "MOTORISTA" || tipoConsulta === "COMPLETO") && (
                      <FormCard
                        title="Dados do motorista"
                        icon={<User className="w-4 h-4 text-indigo-500" />}
                        accent="indigo"
                      >
                        {/* ── Upload CNH integrado ── */}
                        {cnhExtracting ? (
                          <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl border border-indigo-100 bg-indigo-50">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-indigo-800">Analisando documento...</p>
                              <p className="text-xs text-indigo-500 mt-0.5">Extraindo dados da CNH com OCR</p>
                              <div className="mt-2 h-1 rounded-full bg-indigo-100 overflow-hidden">
                                <div className="h-full bg-indigo-400 rounded-full animate-pulse w-2/3" />
                              </div>
                            </div>
                          </div>
                        ) : cnhFile ? (
                          <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-bold text-emerald-800">CNH carregada</p>
                                {cnhAutoFilled && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">
                                    <Sparkles className="w-2.5 h-2.5" /> 10 campos preenchidos
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-emerald-600 mt-0.5 truncate">{cnhFile.name}</p>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveCnh}
                              className="shrink-0 p-1.5 text-emerald-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="mb-6 relative group cursor-pointer">
                            <input
                              type="file"
                              accept=".pdf,image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              onChange={(e) => { if (e.target.files?.[0]) handleCnhUpload(e.target.files[0]) }}
                            />
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 group-hover:border-indigo-300 group-hover:bg-indigo-50/40 transition-all duration-200">
                              <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-200 group-hover:shadow-indigo-100/50 transition-all">
                                <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                              </div>
                              <div className="text-center sm:text-left">
                                <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                                  Anexar CNH para preenchimento automático
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Arraste ou clique · PDF, JPG ou PNG · Os dados são extraídos automaticamente
                                </p>
                              </div>
                              <div className="sm:ml-auto shrink-0">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                  <Zap className="w-3.5 h-3.5" /> Opcional
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                          
                          {/* Informações Pessoais */}
                          <div className="col-span-12 mb-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              Informações Pessoais
                              <div className="flex-1 h-px bg-slate-100"></div>
                            </h4>
                          </div>

                          <div className="col-span-12 sm:col-span-8">
                            <FormField
                              label="Nome completo"
                              error={form.formState.errors.nomeMotorista?.message}
                              icon={<User className="w-4 h-4" />}
                            >
                              <Input
                                placeholder="Nome completo do motorista"
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 transition-all"
                                {...form.register("nomeMotorista")}
                              />
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-4">
                            <FormField label="CPF" error={form.formState.errors.cpfMotorista?.message} icon={<Hash className="w-4 h-4" />}>
                              <Input
                                placeholder="000.000.000-00"
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 font-mono transition-all"
                                value={form.watch("cpfMotorista")}
                                onChange={(e) => form.setValue("cpfMotorista", maskCPF(e.target.value), { shouldValidate: true })}
                              />
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <FormField label="Data de nascimento" error={form.formState.errors.dataNascimento?.message} icon={<Calendar className="w-4 h-4" />}>
                              <Input
                                type="date"
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 transition-all"
                                {...form.register("dataNascimento")}
                              />
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <FormField label="UF de Nascimento" error={form.formState.errors.ufNascimento?.message} icon={<MapPin className="w-4 h-4" />}>
                              <Input
                                placeholder="SP"
                                maxLength={2}
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 uppercase transition-all"
                                {...form.register("ufNascimento", {
                                  onChange: (e) => { e.target.value = e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase() }
                                })}
                              />
                            </FormField>
                          </div>

                          {/* Dados da Habilitação */}
                          <div className="col-span-12 mt-2 mb-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              Dados da Habilitação
                              <div className="flex-1 h-px bg-slate-100"></div>
                            </h4>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <FormField label="CNH" error={form.formState.errors.cnhMotorista?.message} icon={<BadgeCheck className="w-4 h-4" />}>
                              <Input
                                placeholder="00000000000"
                                maxLength={11}
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 font-mono transition-all"
                                {...form.register("cnhMotorista", {
                                  onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11) },
                                })}
                              />
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <FormField label="Cód. Segurança" error={form.formState.errors.codigoSeguranca?.message} icon={<Shield className="w-4 h-4" />}>
                              <Input
                                placeholder="Cód. de segurança da CNH"
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 font-mono transition-all"
                                {...form.register("codigoSeguranca")}
                              />
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <FormField label="Categoria" error={form.formState.errors.categoriaCnh?.message} icon={<ClipboardList className="w-4 h-4" />}>
                              <select
                                className="w-full h-11 pl-10 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-colors"
                                {...form.register("categoriaCnh")}
                              >
                                <option value="" disabled>Selecione...</option>
                                {CNH_CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <FormField label="Validade" error={form.formState.errors.validadeCnh?.message} icon={<Calendar className="w-4 h-4" />}>
                              <Input
                                type="date"
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 transition-all"
                                {...form.register("validadeCnh")}
                              />
                            </FormField>
                          </div>

                          {/* Filiação */}
                          <div className="col-span-12 mt-2 mb-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              Filiação
                              <div className="flex-1 h-px bg-slate-100"></div>
                            </h4>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <FormField label="Nome da mãe" error={form.formState.errors.nomeMae?.message} icon={<User className="w-4 h-4" />}>
                              <Input
                                placeholder="Nome completo da mãe"
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 transition-all"
                                {...form.register("nomeMae")}
                              />
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <FormField label="Nome do pai (Opcional)" error={form.formState.errors.nomePai?.message} icon={<User className="w-4 h-4" />}>
                              <Input
                                placeholder="Nome completo do pai"
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 transition-all"
                                {...form.register("nomePai")}
                              />
                            </FormField>
                          </div>
                        </div>
                      </FormCard>
                    )}

                    {/* Veículos */}
                    {(tipoConsulta === "VEICULO" || tipoConsulta === "COMPLETO") && (
                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <FormCard
                            key={field.id}
                            title={fields.length > 1 ? `Veículo ${index + 1}` : "Dados do veículo"}
                            icon={<Car className="w-4 h-4 text-sky-500" />}
                            accent="sky"
                            action={index > 0 ? (
                              <button
                                type="button"
                                onClick={() => { remove(index); handleRemoveCrlv(index) }}
                                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" /> Remover
                              </button>
                            ) : undefined}
                          >
                            {/* Upload CRLV com extração real */}
                            <div className="mb-4">
                              {crlvExtracting[index] ? (
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-sky-100 bg-sky-50">
                                  <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
                                  <p className="text-xs font-semibold text-sky-700">Extraindo dados do CRLV...</p>
                                </div>
                              ) : crlvFiles[index] ? (
                                <div className="flex items-center justify-between gap-2 p-3 rounded-xl border border-sky-100 bg-sky-50">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                                    <span className="text-xs font-semibold text-slate-700 truncate">{crlvFiles[index]!.name}</span>
                                    {crlvAutoFilled[index] && (
                                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                        <Check className="w-2.5 h-2.5" /> Preenchido via CRLV
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCrlv(index)}
                                    className="p-0.5 text-slate-400 hover:text-red-500 transition-colors rounded shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <label className="relative flex items-center gap-3 p-3 border-2 border-dashed border-sky-200 rounded-xl cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-all group">
                                  <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => { if (e.target.files?.[0]) handleCrlvUpload(e.target.files[0], index) }}
                                  />
                                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-700">Anexar CRLV</p>
                                    <p className="text-[10px] text-slate-400">PDF ou imagem • dados preenchidos automaticamente</p>
                                  </div>
                                </label>
                              )}
                            </div>

                            <div className="grid grid-cols-12 gap-4">
                              <div className="col-span-12 sm:col-span-4">
                                <FormField
                                  label="Placa"
                                  error={form.formState.errors.veiculos?.[index]?.placaVeiculo?.message}
                                  icon={<Car className="w-4 h-4" />}
                                  required
                                >
                                  <Input
                                    placeholder="ABC1D23"
                                    maxLength={7}
                                    className={cn(
                                      "pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white font-mono uppercase placeholder:normal-case",
                                      crlvAutoFilled[index] && form.watch(`veiculos.${index}.placaVeiculo`) && "border-emerald-300 bg-emerald-50/40"
                                    )}
                                    value={form.watch(`veiculos.${index}.placaVeiculo`)}
                                    onChange={(e) => form.setValue(`veiculos.${index}.placaVeiculo`, maskPlaca(e.target.value), { shouldValidate: true })}
                                  />
                                </FormField>
                              </div>

                              <div className="col-span-12 sm:col-span-8">
                                <FormField label="RENAVAM" icon={<Hash className="w-4 h-4" />}>
                                  <Input
                                    placeholder="00000000000"
                                    maxLength={11}
                                    className={cn(
                                      "pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white font-mono",
                                      crlvAutoFilled[index] && form.watch(`veiculos.${index}.renavamVeiculo`) && "border-emerald-300 bg-emerald-50/40"
                                    )}
                                    value={form.watch(`veiculos.${index}.renavamVeiculo`) ?? ""}
                                    onChange={(e) => form.setValue(`veiculos.${index}.renavamVeiculo`, e.target.value.replace(/\D/g, "").slice(0, 11))}
                                  />
                                </FormField>
                              </div>

                              <div className="col-span-12 sm:col-span-5">
                                <FormField label="Marca">
                                  <Input
                                    placeholder="Ex: Volvo"
                                    className={cn(
                                      "h-11 bg-slate-50 border-slate-200 focus-visible:bg-white",
                                      crlvAutoFilled[index] && form.watch(`veiculos.${index}.marcaVeiculo`) && "border-emerald-300 bg-emerald-50/40"
                                    )}
                                    value={form.watch(`veiculos.${index}.marcaVeiculo`) ?? ""}
                                    onChange={(e) => form.setValue(`veiculos.${index}.marcaVeiculo`, e.target.value)}
                                  />
                                </FormField>
                              </div>

                              <div className="col-span-12 sm:col-span-4">
                                <FormField label="Modelo">
                                  <Input
                                    placeholder="Ex: FH 540"
                                    className={cn(
                                      "h-11 bg-slate-50 border-slate-200 focus-visible:bg-white",
                                      crlvAutoFilled[index] && form.watch(`veiculos.${index}.modeloVeiculo`) && "border-emerald-300 bg-emerald-50/40"
                                    )}
                                    value={form.watch(`veiculos.${index}.modeloVeiculo`) ?? ""}
                                    onChange={(e) => form.setValue(`veiculos.${index}.modeloVeiculo`, e.target.value)}
                                  />
                                </FormField>
                              </div>

                              <div className="col-span-12 sm:col-span-3">
                                <FormField label="Ano">
                                  <Input
                                    placeholder="Ex: 2023"
                                    maxLength={4}
                                    className={cn(
                                      "h-11 bg-slate-50 border-slate-200 focus-visible:bg-white font-mono",
                                      crlvAutoFilled[index] && form.watch(`veiculos.${index}.anoVeiculo`) && "border-emerald-300 bg-emerald-50/40"
                                    )}
                                    value={form.watch(`veiculos.${index}.anoVeiculo`) ?? ""}
                                    onChange={(e) => form.setValue(`veiculos.${index}.anoVeiculo`, e.target.value.replace(/\D/g, "").slice(0, 4))}
                                  />
                                </FormField>
                              </div>
                            </div>
                          </FormCard>
                        ))}

                        <button
                          type="button"
                          onClick={() => append({ placaVeiculo: "", renavamVeiculo: "", marcaVeiculo: "", modeloVeiculo: "", anoVeiculo: "" })}
                          className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-500 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/30 transition-all"
                        >
                          <Plus className="w-4 h-4" /> Adicionar veículo
                        </button>
                      </div>
                    )}

                    {/* Proprietário do Veículo */}
                    {(tipoConsulta === "VEICULO" || tipoConsulta === "COMPLETO") && (
                      <FormCard
                        title="Proprietário do Veículo"
                        icon={<User className="w-4 h-4 text-slate-400" />}
                      >
                        <p className="text-xs text-slate-500 mb-4">
                          Informe o CPF ou CNPJ do proprietário para consulta RNTRC/ANTT.
                          Necessário para verificar habilitação de transporte e regularidade do veículo.
                        </p>
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-12 sm:col-span-4">
                            <FormField label="CPF do Proprietário" icon={<User className="w-4 h-4" />}>
                              <Input
                                placeholder="000.000.000-00"
                                maxLength={14}
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 font-mono transition-all"
                                value={form.watch("cpfProprietario") ?? ""}
                                onChange={(e) => form.setValue("cpfProprietario", maskCPF(e.target.value))}
                              />
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-4">
                            <FormField label="CNPJ (opcional)" icon={<Building2 className="w-4 h-4" />}>
                              <Input
                                placeholder="00.000.000/0000-00"
                                maxLength={18}
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 font-mono transition-all"
                                value={form.watch("cnpjProprietario") ?? ""}
                                onChange={(e) => {
                                  const v = e.target.value.replace(/\D/g, "").slice(0, 14)
                                    .replace(/^(\d{2})(\d)/, "$1.$2")
                                    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                                    .replace(/\.(\d{3})(\d)/, ".$1/$2")
                                    .replace(/(\d{4})(\d)/, "$1-$2")
                                  form.setValue("cnpjProprietario", v)
                                }}
                              />
                            </FormField>
                          </div>

                          <div className="col-span-12 sm:col-span-4">
                            <FormField label="RNTRC (opcional)" icon={<Hash className="w-4 h-4" />}>
                              <Input
                                placeholder="00000000"
                                maxLength={20}
                                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 font-mono transition-all"
                                {...form.register("rntrcProprietario", {
                                  onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, "") },
                                })}
                              />
                            </FormField>
                          </div>
                        </div>
                      </FormCard>
                    )}

                    {/* Formato */}
                    <FormCard title="Formato da consulta" icon={<ClipboardList className="w-4 h-4 text-slate-400" />}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(["TERCEIRO", "AGREGADO", "FROTA"] as const).map((opt) => {
                          const sel = form.watch("formato") === opt
                          const labels: Record<string, { label: string; desc: string; icon: any }> = {
                            TERCEIRO: { label: "Terceiro",  desc: "Motorista autônomo", icon: <User className="w-4 h-4" /> },
                            AGREGADO: { label: "Agregado",  desc: "Veículo próprio vinculado", icon: <Car className="w-4 h-4" /> },
                            FROTA:    { label: "Frota",     desc: "Veículo da empresa", icon: <Building2 className="w-4 h-4" /> },
                          }
                          const OptionIcon = labels[opt].icon
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => form.setValue("formato", opt)}
                              className={cn(
                                "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-200 overflow-hidden group",
                                sel
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100/50 scale-[1.02]"
                                  : "border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50"
                              )}
                            >
                              {sel && (
                                <span className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-indigo-500 rounded-full text-white">
                                  <Check className="w-3 h-3" />
                                </span>
                              )}
                              <div className={cn("p-2 rounded-full transition-colors", sel ? "bg-indigo-100 text-indigo-600" : "bg-slate-50 text-slate-400 group-hover:text-indigo-400")}>
                                {labels[opt].icon}
                              </div>
                              <div>
                                <span className="block text-sm font-black mb-0.5">{labels[opt].label}</span>
                                <span className="block text-[10px] text-slate-500 leading-tight px-2">{labels[opt].desc}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </FormCard>

                    {/* Observações */}
                    <FormCard title="Observações" icon={<ClipboardList className="w-4 h-4 text-slate-400" />} hint="Opcional">
                      <Textarea
                        placeholder="Informações complementares para o analista responsável..."
                        rows={3}
                        maxLength={500}
                        className="resize-none text-sm bg-slate-50 border-slate-200 focus-visible:bg-white"
                        {...form.register("observacoes")}
                      />
                      <p className="text-[11px] text-slate-400 text-right mt-1">
                        {(watchedValues.observacoes ?? "").length}/500
                      </p>
                    </FormCard>

                    {/* Nav buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(0)}
                        className="h-12 px-5 rounded-xl font-semibold text-slate-600 border-slate-200"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20"
                        onClick={async () => { const ok = await validateDados(); if (ok) setStep(2) }}
                      >
                        Revisar solicitação <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* ── Preview (right, sticky) ── */}
                  <div className="hidden lg:block">
                    <div className="sticky top-8 space-y-3">

                      {/* Card de resumo */}
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        {/* Header do preview */}
                        <div className={cn("px-4 py-3 border-b border-slate-100 flex items-center gap-2", tipoColors.bg)}>
                          <Eye className={cn("w-3.5 h-3.5", tipoColors.text)} />
                          <span className={cn("text-xs font-black uppercase tracking-widest", tipoColors.text)}>
                            Resumo da consulta
                          </span>
                        </div>

                        <div className="p-4 space-y-4">
                          {/* Tipo */}
                          <div>
                            <p className="section-label">Tipo de análise</p>
                            <div className={cn("inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold mt-1.5", tipoColors.bg, tipoColors.text)}>
                              {(() => { const Icon = tipoConfig.icon; return <Icon className="w-3.5 h-3.5" /> })()}
                              {tipoConfig.label}
                            </div>
                          </div>

                          {/* Dados motorista */}
                          {(tipoConsulta === "MOTORISTA" || tipoConsulta === "COMPLETO") && (
                            <div>
                              <p className="section-label">Motorista</p>
                              <div className="mt-1.5 space-y-1">
                                <PreviewItem label="Nome" value={watchedValues.nomeMotorista} />
                                <PreviewItem label="CPF" value={watchedValues.cpfMotorista} mono />
                                <PreviewItem label="CNH" value={watchedValues.cnhMotorista} mono />
                                <PreviewItem label="Categoria" value={watchedValues.categoriaCnh} />
                                <PreviewItem label="Validade" value={watchedValues.validadeCnh} />
                              </div>
                            </div>
                          )}

                          {/* Dados veículos */}
                          {(tipoConsulta === "VEICULO" || tipoConsulta === "COMPLETO") && (
                            <div>
                              <p className="section-label">
                                Veículos ({(watchedValues.veiculos ?? []).filter(v => v.placaVeiculo).length})
                              </p>
                              <div className="mt-1.5 space-y-2">
                                {(watchedValues.veiculos ?? []).map((v, i) => (
                                  <div key={i} className={cn("p-2.5 rounded-xl text-xs", v.placaVeiculo ? "bg-sky-50 border border-sky-100" : "bg-slate-50 border border-slate-100")}>
                                    {v.placaVeiculo
                                      ? <>
                                          <p className="font-black text-slate-800 font-mono">{v.placaVeiculo}</p>
                                          {(v.marcaVeiculo || v.modeloVeiculo) && (
                                            <p className="text-slate-500 mt-0.5">{[v.marcaVeiculo, v.modeloVeiculo, v.anoVeiculo].filter(Boolean).join(" • ")}</p>
                                          )}
                                        </>
                                      : <p className="text-slate-400 italic">Placa não informada</p>
                                    }
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Completude */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="section-label">Preenchimento</p>
                              <span className={cn("text-xs font-black", completude === 100 ? "text-emerald-600" : "text-indigo-600")}>{completude}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                className={cn("h-full rounded-full transition-all", completude === 100 ? "bg-emerald-500" : "bg-indigo-500")}
                                initial={{ width: 0 }}
                                animate={{ width: `${completude}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Segurança */}
                      <div className="flex items-start gap-2.5 p-3 bg-slate-800 rounded-xl">
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Dados transmitidos com criptografia TLS. Processamento em conformidade com a LGPD.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  STEP 2 — Revisão
              ══════════════════════════════════════════════════════════ */}
              {step === 2 && tipoConsulta && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

                  {/* ── Coluna esquerda: dados ── */}
                  <div className="space-y-3">

                    {/* Solicitante */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Solicitante</span>
                        </div>
                      </div>
                      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ReviewDataCell label="Nome completo" value={clienteData?.nome ?? ""} />
                        <ReviewDataCell label="E-mail" value={clienteData?.email ?? ""} />
                        {clienteData?.empresaVinculadaNome && (
                          <ReviewDataCell label="Empresa vinculada" value={clienteData.empresaVinculadaNome} span />
                        )}
                      </div>
                    </div>

                    {/* Motorista */}
                    {(tipoConsulta === "MOTORISTA" || tipoConsulta === "COMPLETO") && (
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-indigo-500" />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Motorista</span>
                          </div>
                          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
                            <Pencil className="w-3 h-3" /> Editar
                          </button>
                        </div>
                        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <ReviewDataCell label="Nome completo" value={form.getValues("nomeMotorista") ?? ""} span />
                          <ReviewDataCell label="CPF" value={form.getValues("cpfMotorista") ?? ""} mono />
                          <ReviewDataCell label="Número da CNH" value={form.getValues("cnhMotorista") ?? ""} mono />
                          <ReviewDataCell label="Categoria" value={form.getValues("categoriaCnh") ?? ""} />
                          <ReviewDataCell label="Validade CNH" value={form.getValues("validadeCnh") ?? ""} />
                          <ReviewDataCell label="Data Nasc." value={form.getValues("dataNascimento") ?? ""} />
                          <ReviewDataCell label="UF Nasc." value={form.getValues("ufNascimento") ?? ""} />
                          <ReviewDataCell label="Mãe" value={form.getValues("nomeMae") ?? ""} />
                          {form.getValues("nomePai") && (
                            <ReviewDataCell label="Pai" value={form.getValues("nomePai") ?? ""} />
                          )}
                          <ReviewDataCell label="Cód. Seg. CNH" value={form.getValues("codigoSeguranca") ?? ""} mono />
                        </div>
                      </div>
                    )}

                    {/* Veículos */}
                    {(tipoConsulta === "VEICULO" || tipoConsulta === "COMPLETO") && (
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center">
                              <Car className="w-3.5 h-3.5 text-sky-500" />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                              Veículos
                            </span>
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black">
                              {(form.getValues("veiculos") ?? []).length}
                            </span>
                          </div>
                          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
                            <Pencil className="w-3 h-3" /> Editar
                          </button>
                        </div>

                        <div className="divide-y divide-slate-50">
                          {(form.getValues("veiculos") ?? []).map((v, i) => (
                            <div key={i} className="px-5 py-4">
                              <div className="flex items-start gap-4">
                                {/* Badge placa */}
                                <div className="shrink-0">
                                  <div className="border-2 border-slate-200 bg-white rounded-xl px-3 py-2 text-center min-w-[90px]">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Placa</p>
                                    <p className="text-base font-black text-slate-900 font-mono tracking-widest leading-none">{v.placaVeiculo || "—"}</p>
                                  </div>
                                </div>

                                {/* Detalhes do veículo */}
                                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 pt-0.5">
                                  {v.renavamVeiculo && (
                                    <ReviewDataCell label="RENAVAM" value={v.renavamVeiculo} mono />
                                  )}
                                  {v.marcaVeiculo && (
                                    <ReviewDataCell label="Marca" value={v.marcaVeiculo} />
                                  )}
                                  {v.modeloVeiculo && (
                                    <ReviewDataCell label="Modelo" value={v.modeloVeiculo} />
                                  )}
                                  {v.anoVeiculo && (
                                    <ReviewDataCell label="Ano" value={v.anoVeiculo} />
                                  )}
                                  {!v.renavamVeiculo && !v.marcaVeiculo && !v.modeloVeiculo && !v.anoVeiculo && (
                                    <p className="text-xs text-slate-400 col-span-2">Apenas placa informada</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Proprietário do Veículo — revisão */}
                    {(tipoConsulta === "VEICULO" || tipoConsulta === "COMPLETO") &&
                      (form.getValues("cpfProprietario") || form.getValues("cnpjProprietario") || form.getValues("rntrcProprietario")) && (
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-sky-500" />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Proprietário</span>
                          </div>
                          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
                            <Pencil className="w-3 h-3" /> Editar
                          </button>
                        </div>
                        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
                          {form.getValues("cpfProprietario") && (
                            <ReviewDataCell label="CPF" value={form.getValues("cpfProprietario")!} mono />
                          )}
                          {form.getValues("cnpjProprietario") && (
                            <ReviewDataCell label="CNPJ" value={form.getValues("cnpjProprietario")!} mono />
                          )}
                          {form.getValues("rntrcProprietario") && (
                            <ReviewDataCell label="RNTRC" value={form.getValues("rntrcProprietario")!} mono />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Observações */}
                    {form.getValues("observacoes") && (
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                              <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Observações</span>
                          </div>
                          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
                            <Pencil className="w-3 h-3" /> Editar
                          </button>
                        </div>
                        <div className="px-5 py-4">
                          <p className="text-sm text-slate-700 leading-relaxed">{form.getValues("observacoes")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Coluna direita: painel de ação ── */}
                  <div className="lg:sticky lg:top-8 space-y-3">

                    {/* Tipo de análise */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
                      <p className="section-label mb-3">Tipo de análise</p>
                      {(() => {
                        const cfg    = TIPO_CONFIG[tipoConsulta]
                        const colors = TIPO_COLOR_MAP[cfg.color]
                        const Icon   = cfg.icon
                        return (
                          <div className={cn("flex items-center gap-3 p-3 rounded-xl", colors.bg)}>
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", colors.iconBg)}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className={cn("text-sm font-black", colors.text)}>{cfg.label}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{cfg.subtitle}</p>
                            </div>
                          </div>
                        )
                      })()}

                      {/* Formato */}
                      <div className="mt-3 pt-3 border-t border-slate-50">
                        <p className="section-label mb-1.5">Formato</p>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-xs font-black text-indigo-700">
                          {form.getValues("formato") ?? "TERCEIRO"}
                        </span>
                      </div>

                      {/* Resumo numérico */}
                      <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-2">
                        {(tipoConsulta === "VEICULO" || tipoConsulta === "COMPLETO") && (
                          <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                            <p className="text-lg font-black text-slate-900">{(form.getValues("veiculos") ?? []).length}</p>
                            <p className="text-[10px] text-slate-500 font-semibold">veículo{(form.getValues("veiculos") ?? []).length !== 1 ? "s" : ""}</p>
                          </div>
                        )}
                        {(tipoConsulta === "MOTORISTA" || tipoConsulta === "COMPLETO") && (
                          <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                            <p className="text-lg font-black text-slate-900">1</p>
                            <p className="text-[10px] text-slate-500 font-semibold">motorista</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
                      <Button
                        type="button"
                        disabled={enviando}
                        onClick={handleEnviar}
                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-lg shadow-indigo-600/20 disabled:opacity-60 text-sm"
                      >
                        {enviando
                          ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Enviando...</>
                          : <><ShieldCheck className="w-4 h-4 mr-2" />Confirmar e Enviar</>
                        }
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(1)}
                        className="w-full h-10 rounded-xl font-semibold text-slate-500 hover:text-slate-700 text-sm"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar e editar
                      </Button>

                      {/* LGPD + segurança */}
                      <div className="pt-1 border-t border-slate-50 space-y-2">
                        <div className="flex items-start gap-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Transmissão criptografada via TLS.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Dados tratados conforme a LGPD (Lei nº 13.709/2018).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  STEP 3 — Sucesso
              ══════════════════════════════════════════════════════════ */}
              {step === 3 && codigoSolicitacao && (
                <div className="max-w-lg mx-auto">
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">

                    {/* Hero */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-center">
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </motion.div>
                      <h2 className="text-xl font-black text-white mb-1">Solicitação enviada!</h2>
                      <p className="text-emerald-100 text-sm">
                        {clienteData?.empresaVinculadaNome
                          ? <><strong className="text-white">{clienteData.empresaVinculadaNome}</strong> irá analisar e retornar em breve.</>
                          : "Nossa equipe irá analisar e retornar em breve."
                        }
                      </p>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Código */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Código da solicitação</p>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-2xl font-black text-slate-900 font-mono tracking-widest">
                            {codigoSolicitacao}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(codigoSolicitacao)
                              setCopiado(true)
                              setTimeout(() => setCopiado(false), 2000)
                            }}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                              copiado
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            )}
                          >
                            {copiado ? <><Check className="w-3.5 h-3.5" />Copiado</> : <><Copy className="w-3.5 h-3.5" />Copiar</>}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">Guarde para acompanhar o andamento</p>
                      </div>

                      {/* O que acontece agora */}
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">O que acontece agora</p>
                        <div className="space-y-0">
                          {[
                            { icon: CheckCircle2, text: "Solicitação recebida e registrada", done: true },
                            { icon: ShieldCheck,  text: "Analista revisa os dados enviados",  done: false },
                            { icon: Mail,         text: "Resultado enviado para seu e-mail",  done: false },
                          ].map((item, i) => {
                            const Icon = item.icon
                            return (
                              <div key={i} className="flex items-start gap-3 relative">
                                <div className="flex flex-col items-center shrink-0">
                                  <div className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center z-10",
                                    item.done ? "bg-emerald-100" : "bg-slate-100"
                                  )}>
                                    <Icon className={cn("w-3.5 h-3.5", item.done ? "text-emerald-600" : "text-slate-400")} />
                                  </div>
                                  {i < 2 && <div className="w-px h-5 bg-slate-100 my-1" />}
                                </div>
                                <p className={cn("text-sm pt-1 pb-3", item.done ? "text-slate-800 font-semibold" : "text-slate-500")}>
                                  {item.text}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold">
                          <Link href={`/acompanhar/${codigoSolicitacao}`}>
                            <Eye className="w-4 h-4 mr-2" /> Acompanhar
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl h-11 font-semibold border-slate-200"
                          onClick={handleNovaSolicitacao}
                        >
                          Nova solicitação
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>

        </div>{/* /pt-20 */}
      </div>
    </ProtectedClientePage>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function FormCard({
  title, icon, hint, accent, action, children,
}: {
  title?: string
  icon?: React.ReactNode
  hint?: string
  accent?: "indigo" | "sky"
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">
        {(title || action) && (
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              {icon}
              {title && <h3 className="font-bold text-sm text-slate-800">{title}</h3>}
              {hint && <span className="text-[11px] text-slate-400 font-medium">{hint}</span>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

function FormField({
  label, error, icon, required, className, children,
}: {
  label?: string
  error?: string
  icon?: React.ReactNode
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className="text-xs font-semibold text-slate-600">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </Label>
      )}
      {icon ? (
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
          {children}
        </div>
      ) : children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
          <AlertCircle className="w-3 h-3 shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

function UploadSlot({
  label, accept, file, onFile, onRemove, color,
}: {
  label: string
  accept: string
  file: File | null
  onFile: (f: File) => void
  onRemove: () => void
  color: "indigo" | "sky"
}) {
  const c = color === "indigo"
    ? { border: "border-indigo-200 hover:border-indigo-400", bg: "hover:bg-indigo-50/30", icon: "bg-indigo-50 text-indigo-500", pill: "bg-indigo-50 border-indigo-100", pillText: "text-indigo-500" }
    : { border: "border-sky-200 hover:border-sky-400",       bg: "hover:bg-sky-50/30",    icon: "bg-sky-50 text-sky-500",      pill: "bg-sky-50 border-sky-100",       pillText: "text-sky-500" }

  if (file) {
    return (
      <div className={cn("flex items-center gap-2.5 p-3 rounded-xl border", c.pill)}>
        <FileText className={cn("w-4 h-4 shrink-0", c.pillText)} />
        <span className="text-xs font-semibold text-slate-700 truncate flex-1">{file.name}</span>
        <button type="button" onClick={onRemove} className="p-0.5 text-slate-400 hover:text-red-500 transition-colors rounded">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <label className={cn("relative flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all", c.border, c.bg)}>
      <input type="file" accept={accept} className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]) }} />
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", c.icon)}>
        <FileText className="w-4 h-4" />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">PDF ou imagem</p>
      </div>
    </label>
  )
}

function PreviewItem({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] text-slate-400 font-medium w-16 shrink-0">{label}</span>
      <span className={cn("text-xs text-slate-700 font-semibold truncate", mono && "font-mono")}>{value}</span>
    </div>
  )
}

function ReviewDataCell({
  label, value, mono, span,
}: {
  label: string
  value: string
  mono?: boolean
  span?: boolean
}) {
  if (!value) return null
  return (
    <div className={cn(span && "col-span-2 sm:col-span-2")}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={cn("text-sm font-semibold text-slate-800 truncate", mono && "font-mono")}>{value}</p>
    </div>
  )
}
