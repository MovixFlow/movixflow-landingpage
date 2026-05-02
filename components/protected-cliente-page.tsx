"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Clock, ShieldCheck } from "lucide-react"
import { useCliente } from "@/contexts/cliente-context"

interface ProtectedClientePageProps {
  children: React.ReactNode
}

export function ProtectedClientePage({ children }: ProtectedClientePageProps) {
  const { isReady, isClienteLogado, clienteData, logoutCliente } = useCliente()
  const router = useRouter()

  useEffect(() => {
    if (isReady && !isClienteLogado) {
      router.replace("/?cliente=login")
    }
  }, [isReady, isClienteLogado, router])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!isClienteLogado) return null

  // Bloqueia acesso a usuários ainda não aprovados
  if (clienteData?.statusAcesso === "PENDENTE") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Cadastro em análise</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Sua conta está aguardando aprovação da nossa equipe. Você receberá um e-mail assim que o acesso for liberado.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Processamento seguro · LGPD
          </div>
          <button
            type="button"
            onClick={() => { logoutCliente(); router.replace("/") }}
            className="w-full h-11 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
