"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  User,
  Car,
  FileText,
  Calendar,
  Badge,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ProtectedClientePage } from "@/components/protected-cliente-page"
import { cn } from "@/lib/utils"
import { getDetalheSolicitacaoCliente, type DetalheSolicitacaoCliente } from "@/src/service/ClienteSolicitacoes"

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; icon: typeof Clock }> = {
  PENDENTE: {
    label: "Pendente",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Clock,
  },
  EM_ANALISE: {
    label: "Em Análise",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Loader2,
  },
  APROVADO: {
    label: "Aprovado",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  REPROVADO: {
    label: "Reprovado",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
}

const FOCO_LABEL: Record<string, string> = {
  MOTORISTA: "Somente Motorista",
  VEICULO: "Somente Veículo",
  COMPLETO: "Motorista + Veículo",
}

const FORMATO_LABEL: Record<string, string> = {
  TERCEIRO: "Terceiro",
  AGREGADO: "Agregado",
  FROTA: "Frota",
}

export default function AcompanharDetalhe({ params }: { params: { codigo: string } }) {
  const { codigo } = params
  const isGuid = GUID_REGEX.test(codigo)

  const [detalhe, setDetalhe] = useState<DetalheSolicitacaoCliente | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const FINAL_STATUSES = ["APROVADO", "REPROVADO"]

  const fetchDetalhe = useCallback(async (silent = false) => {
    if (!silent) setCarregando(true)
    setErro(null)
    try {
      if (isGuid) {
        const data = await getDetalheSolicitacaoCliente(codigo)
        setDetalhe(data)
      } else {
        setErro("Código inválido. Acesse via lista de consultas.")
      }
    } catch (err: any) {
      if (!silent)
        setErro(
          err?.response?.status === 404
            ? "Solicitação não encontrada ou não pertence à sua empresa."
            : "Não foi possível carregar os detalhes. Tente novamente."
        )
    } finally {
      if (!silent) setCarregando(false)
    }
  }, [codigo, isGuid])

  useEffect(() => {
    fetchDetalhe()
  }, [fetchDetalhe])

  useEffect(() => {
    if (detalhe && FINAL_STATUSES.includes(detalhe.status)) return
    const interval = setInterval(() => fetchDetalhe(true), 15_000)
    return () => clearInterval(interval)
  }, [detalhe, fetchDetalhe])

  const statusInfo = detalhe ? (STATUS_CONFIG[detalhe.status] ?? STATUS_CONFIG.PENDENTE) : null
  const Icon = statusInfo?.icon ?? Clock

  return (
    <ProtectedClientePage>
      <div className="min-h-screen bg-white">
        <Header />

        <main className="pt-28 pb-24 px-4">
          <div className="max-w-2xl mx-auto">
            <Link
              href="/acompanhar"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full mb-4 border border-indigo-100 text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Detalhe da solicitação
              </div>
              {detalhe && (
                <h1 className="text-2xl font-black text-gray-900 font-mono tracking-widest">
                  {detalhe.codigo}
                </h1>
              )}
            </div>

            {carregando && (
              <div className="flex flex-col items-center py-16 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-gray-400 text-sm">Carregando detalhes...</p>
              </div>
            )}

            {!carregando && erro && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center space-y-4">
                <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                <p className="text-red-600 font-medium">{erro}</p>
                <Button variant="outline" className="rounded-xl" onClick={() => fetchDetalhe()}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {!carregando && detalhe && statusInfo && (
              <div className="space-y-5">
                {/* Status + info principal */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold",
                        statusInfo.badgeClass
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          detalhe.status === "EM_ANALISE" && "animate-spin"
                        )}
                      />
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-gray-400 text-xs mb-0.5">Tipo</p>
                      <p className="font-semibold text-gray-800">
                        {FOCO_LABEL[detalhe.foco] ?? detalhe.foco}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-gray-400 text-xs mb-0.5">Formato</p>
                      <p className="font-semibold text-gray-800">
                        {FORMATO_LABEL[detalhe.formato] ?? detalhe.formato}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-gray-400 text-xs mb-0.5">Data</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(detalhe.dataSolicitacao).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {detalhe.validadeDias && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-400 text-xs mb-0.5">Validade</p>
                        <p className={cn("font-semibold", detalhe.estaVencida ? "text-red-600" : "text-gray-800")}>
                          {detalhe.validadeDias} dias
                          {detalhe.estaVencida && " (vencida)"}
                        </p>
                      </div>
                    )}
                    {detalhe.dataFimValidade && (
                      <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                        <p className="text-gray-400 text-xs mb-0.5">Válido até</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(detalhe.dataFimValidade).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    )}
                  </div>

                  {detalhe.observacoesCliente && (
                    <div className="mt-4 bg-slate-50 rounded-xl p-3">
                      <p className="text-gray-400 text-xs mb-0.5">Observações</p>
                      <p className="text-sm text-gray-700">{detalhe.observacoesCliente}</p>
                    </div>
                  )}
                </div>

                {/* Motorista */}
                {detalhe.motorista && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-indigo-500" />
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Motorista</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {detalhe.motorista.nome && (
                        <div className="col-span-2 bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-0.5">Nome</p>
                          <p className="font-semibold text-gray-800">{detalhe.motorista.nome}</p>
                        </div>
                      )}
                      {detalhe.motorista.cpf && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-0.5">CPF</p>
                          <p className="font-semibold text-gray-800">{detalhe.motorista.cpf}</p>
                        </div>
                      )}
                      {detalhe.motorista.cnhNumero && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-0.5">CNH</p>
                          <p className="font-semibold text-gray-800">{detalhe.motorista.cnhNumero}</p>
                        </div>
                      )}
                      {detalhe.motorista.categoriaCnh && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-0.5">Categoria</p>
                          <p className="font-semibold text-gray-800">{detalhe.motorista.categoriaCnh}</p>
                        </div>
                      )}
                      {detalhe.motorista.validadeCnh && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-0.5">Validade CNH</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(detalhe.motorista.validadeCnh).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Veículos */}
                {detalhe.veiculos.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="w-4 h-4 text-indigo-500" />
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Veículos ({detalhe.veiculos.length})
                      </p>
                    </div>
                    <div className="space-y-3">
                      {detalhe.veiculos.map((v, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-2 text-sm">
                          {v.placa && (
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Placa</p>
                              <p className="font-mono font-bold text-gray-800">{v.placa}</p>
                            </div>
                          )}
                          {v.funcao && (
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Função</p>
                              <p className="font-semibold text-gray-800">{v.funcao}</p>
                            </div>
                          )}
                          {v.marca && (
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Marca / Modelo</p>
                              <p className="font-semibold text-gray-800">
                                {[v.marca, v.modelo].filter(Boolean).join(" ")}
                                {v.ano ? ` (${v.ano})` : ""}
                              </p>
                            </div>
                          )}
                          {v.renavam && (
                            <div>
                              <p className="text-gray-400 text-xs mb-0.5">Renavam</p>
                              <p className="font-semibold text-gray-800">{v.renavam}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <Link href="/solicitar-consulta" className="text-sm text-indigo-600 hover:underline">
                    Criar nova solicitação
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedClientePage>
  )
}
