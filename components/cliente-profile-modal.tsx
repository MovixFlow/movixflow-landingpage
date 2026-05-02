"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCliente, type ClienteData, type StatusAcesso } from "@/contexts/cliente-context"
import {
  User, Building2, Mail, Phone, ShieldCheck, CheckCircle2,
  Clock, XCircle, Link2, Hash, X, LogOut, Copy, Check,
  KeyRound, BadgeCheck, Calendar, Fingerprint,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { LucideIcon } from "lucide-react"

// ─── Status ───────────────────────────────────────────────────────────────────

type StatusCfg = {
  label: string
  icon: LucideIcon
  dot: string
  badge: string
  banner?: string
  bannerText?: string
}

const STATUS: Record<string, StatusCfg> = {
  ATIVO: {
    label: "Ativo",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  },
  APROVADO: {
    label: "Aprovado",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
  },
  PENDENTE: {
    label: "Em análise",
    icon: Clock,
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
    banner: "bg-amber-50 border border-amber-100 text-amber-800",
    bannerText: "Cadastro em verificação. Você receberá um e-mail quando o acesso for liberado.",
  },
  BLOQUEADO: {
    label: "Bloqueado",
    icon: XCircle,
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
    banner: "bg-red-50 border border-red-100 text-red-800",
    bannerText: "Conta suspensa. Entre em contato com o suporte.",
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

function tipoLabel(tipo: ClienteData["tipo"]) {
  return ({ PF: "Pessoa Física", EMPRESA_TERCEIRA: "Empresa Terceira", EMPRESA_CONSULTAS: "Empresa Solicitante", CLIENTE_CONSULTA: "Cliente Consulta" } as Record<string, string>)[tipo] ?? tipo
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function ClienteProfileModal({ open, onOpenChange }: Props) {
  const { clienteData, logoutCliente } = useCliente()
  const [copied, setCopied] = useState(false)

  if (!clienteData) return null

  const st = STATUS[clienteData.statusAcesso ?? "PENDENTE"] ?? STATUS.PENDENTE
  const StatusIcon = st.icon
  const hasEmpresa = !!(clienteData.razaoSocial || clienteData.cnpj)

  const copyId = () => {
    if (!clienteData.identificador) return
    navigator.clipboard.writeText(clienteData.identificador)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => { logoutCliente(); onOpenChange(false) }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 overflow-hidden rounded-2xl border border-gray-200 shadow-xl shadow-gray-300/20 sm:max-w-[400px] w-[95vw] bg-white"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* ── HEADER ── */}
          <div className="relative bg-gray-50 border-b border-gray-100 px-6 pt-6 pb-5">
            {/* Close */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="w-14 h-14 ring-2 ring-white shadow-md">
                  <AvatarFallback className="bg-indigo-600 text-white text-base font-black">
                    {initials(clienteData.nome)}
                  </AvatarFallback>
                </Avatar>
                <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white", st.dot)} />
              </div>

              {/* Identity */}
              <div className="min-w-0 flex-1 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-gray-900 truncate leading-tight">
                    {clienteData.nome}
                  </h2>
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0", st.badge)}>
                    <StatusIcon className="w-3 h-3" />
                    {st.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">{clienteData.email}</p>

                {clienteData.identificador && (
                  <button
                    type="button"
                    onClick={copyId}
                    className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors group"
                  >
                    <Fingerprint className="w-3 h-3" />
                    <span className="font-mono">{clienteData.identificador}</span>
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-3 h-3 text-emerald-500" />
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="px-4 py-4 space-y-1 max-h-[52vh] overflow-y-auto">

            {/* Banner de status */}
            {st.bannerText && (
              <div className={cn("flex gap-2.5 px-3.5 py-3 rounded-xl text-xs mb-3", st.banner)}>
                <StatusIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{st.bannerText}</p>
              </div>
            )}

            {/* Conta */}
            <SectionLabel icon={ShieldCheck} title="Conta" />
            <SectionCard>
              <InfoRow label="Tipo de acesso" value={tipoLabel(clienteData.tipo)} />
              <InfoRow
                label="Status"
                value={st.label}
                valueClass={
                  ["ATIVO","APROVADO"].includes(clienteData.statusAcesso ?? "")
                    ? "text-emerald-600 font-semibold"
                    : clienteData.statusAcesso === "PENDENTE"
                    ? "text-amber-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              />
            </SectionCard>

            {/* Dados */}
            <div className="pt-2" />
            <SectionLabel icon={hasEmpresa ? Building2 : User} title={hasEmpresa ? "Empresa" : "Dados pessoais"} />
            <SectionCard>
              <InfoRow
                label={hasEmpresa ? "Razão social" : "Nome completo"}
                value={hasEmpresa ? (clienteData.razaoSocial ?? clienteData.nome) : clienteData.nome}
              />
              {clienteData.cpf   && <InfoRow label="CPF"  value={clienteData.cpf} mono />}
              {clienteData.cnpj  && <InfoRow label="CNPJ" value={clienteData.cnpj} mono />}
              {clienteData.nomeResponsavel && <InfoRow label="Responsável" value={clienteData.nomeResponsavel} />}
            </SectionCard>

            {/* Contato */}
            <div className="pt-2" />
            <SectionLabel icon={Mail} title="Contato" />
            <SectionCard>
              <InfoRow label="E-mail"   value={clienteData.email} />
              {clienteData.telefone && <InfoRow label="Telefone" value={clienteData.telefone} />}
            </SectionCard>

            {/* Vínculo */}
            {clienteData.empresaVinculadaNome && (
              <>
                <div className="pt-2" />
                <SectionLabel icon={Link2} title="Vínculo" />
                <div className="flex items-center gap-3 px-3.5 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                    <Link2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-emerald-600 font-semibold truncate">{clienteData.empresaVinculadaNome}</p>
                    <p className="text-[10px] text-emerald-500">Empresa parceira autorizada</p>
                  </div>
                  <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 ml-auto" />
                </div>
              </>
            )}
          </div>

          {/* ── ACTIONS ── */}
          <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2 mt-1">
            <div className="grid grid-cols-2 gap-2">
              <ActionBtn
                icon={KeyRound}
                label="Redefinir senha"
                onClick={() => {}}
                className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100"
              />
              <ActionBtn
                icon={Mail}
                label="Suporte"
                onClick={() => window.open("mailto:suporte@movixflow.com.br")}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100"
              />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 h-9 rounded-xl text-sm font-semibold text-red-600 bg-white border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair da conta
            </button>
          </div>

        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-1.5 px-1 pb-1">
      <Icon className="w-3 h-3 text-gray-400" />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
    </div>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 overflow-hidden">
      {children}
    </div>
  )
}

function InfoRow({ label, value, valueClass, mono }: { label: string; value: string; valueClass?: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 hover:bg-gray-100/50 transition-colors group">
      <span className="text-xs text-gray-400 font-medium shrink-0 w-28">{label}</span>
      <span className={cn(
        "text-xs text-gray-800 font-semibold text-right truncate",
        mono && "font-mono tracking-wide",
        valueClass
      )}>
        {value}
      </span>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, onClick, className }: { icon: LucideIcon; label: string; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold border border-gray-100 bg-white transition-all",
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}
