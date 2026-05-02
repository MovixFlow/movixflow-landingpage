"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  User,
  Car,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { ProtectedClientePage } from "@/components/protected-cliente-page"
import { cn } from "@/lib/utils"
import {
  listarSolicitacoesCliente,
  type SolicitacaoClienteListagemItem,
  type PaginacaoResponse,
} from "@/src/service/ClienteSolicitacoes"

const PAGE_SIZE = 10

export default function AcompanharPage() {
  const router = useRouter()
  const [filtroStatus, setFiltroStatus] = useState("TODOS")
  const [busca, setBusca] = useState("")
  const [buscaInput, setBuscaInput] = useState("")
  const [page, setPage] = useState(1)
  const [dados, setDados] = useState<PaginacaoResponse<SolicitacaoClienteListagemItem> | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const fetchDados = useCallback(async (silent = false) => {
    if (!silent) setCarregando(true)
    setErro(null)
    try {
      const resultado = await listarSolicitacoesCliente({
        status: filtroStatus === "TODOS" ? undefined : filtroStatus,
        busca: busca || undefined,
        page,
        pageSize: PAGE_SIZE,
      })
      setDados(resultado)
    } catch {
      if (!silent) setErro("Não foi possível carregar as consultas. Tente novamente.")
    } finally {
      if (!silent) setCarregando(false)
    }
  }, [filtroStatus, busca, page])

  useEffect(() => {
    fetchDados()
    const interval = setInterval(() => fetchDados(true), 30_000)
    return () => clearInterval(interval)
  }, [fetchDados])

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1)
  }, [filtroStatus, busca])

  const handleBuscar = () => {
    setBusca(buscaInput)
  }

  const totalPages = dados ? Math.ceil(dados.total / PAGE_SIZE) : 0
  const items = dados?.items ?? []

  return (
    <ProtectedClientePage>
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Minhas Consultas
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Gerencie e acompanhe as análises de risco solicitadas.
              </p>
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold rounded-xl"
              onClick={() => router.push("/solicitar-consulta")}
            >
              Nova Consulta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Buscar por código, motorista ou placa..."
                  className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl"
                  value={buscaInput}
                  onChange={(e) => setBuscaInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                />
              </div>
              <Button
                variant="outline"
                className="h-11 rounded-xl shrink-0"
                onClick={handleBuscar}
              >
                Buscar
              </Button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {["TODOS", "EM_ANALISE", "APROVADO", "REPROVADO"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border",
                    filtroStatus === status
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {status === "TODOS"
                    ? "Todas"
                    : status === "EM_ANALISE"
                    ? "Em Análise"
                    : status === "APROVADO"
                    ? "Aprovados"
                    : "Reprovados"}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {carregando ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-slate-500 text-sm">Carregando consultas...</p>
              </div>
            ) : erro ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
                <AlertTriangle className="w-10 h-10 text-red-400" />
                <p className="text-slate-600 font-medium">{erro}</p>
                <Button variant="outline" className="rounded-xl" onClick={() => fetchDados()}>
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                        <th className="px-6 py-4">Código / Data</th>
                        <th className="px-6 py-4">Tipo</th>
                        <th className="px-6 py-4">Motorista / Veículo</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((consulta) => (
                        <tr
                          key={consulta.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <p className="font-mono font-bold text-slate-900">{consulta.codigo}</p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(consulta.dataSolicitacao).toLocaleString("pt-BR")}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                              {consulta.tipo === "MOTORISTA" && <User className="w-3.5 h-3.5" />}
                              {consulta.tipo === "VEICULO" && <Car className="w-3.5 h-3.5" />}
                              {consulta.tipo === "COMPLETO" && <FileText className="w-3.5 h-3.5" />}
                              {consulta.tipo}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">
                              {consulta.nomeMotorista ?? "—"}
                            </div>
                            <div className="text-sm text-slate-500 mt-0.5">
                              {consulta.placaVeiculoPrincipal ?? "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={consulta.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold"
                              onClick={() => router.push(`/acompanhar/${consulta.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" /> Ver Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {items.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <Search className="w-10 h-10 mb-3 text-slate-300" />
                              <p className="text-base font-semibold text-slate-600">
                                Nenhuma consulta encontrada
                              </p>
                              <p className="text-sm">Tente ajustar os filtros ou os termos da busca.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                      {dados?.total} resultado{dados?.total !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium text-slate-700">
                        {page} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedClientePage>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0",
        status === "EM_ANALISE" && "bg-amber-100 text-amber-700",
        status === "APROVADO" && "bg-emerald-100 text-emerald-700",
        status === "REPROVADO" && "bg-red-100 text-red-700",
        status === "PENDENTE" && "bg-slate-100 text-slate-600",
      )}
    >
      {status === "EM_ANALISE" && <Clock className="w-3.5 h-3.5" />}
      {status === "APROVADO" && <CheckCircle2 className="w-3.5 h-3.5" />}
      {status === "REPROVADO" && <XCircle className="w-3.5 h-3.5" />}
      {status === "PENDENTE" && <Clock className="w-3.5 h-3.5" />}
      {status === "EM_ANALISE"
        ? "Em Análise"
        : status === "APROVADO"
        ? "Aprovado"
        : status === "REPROVADO"
        ? "Reprovado"
        : "Pendente"}
    </div>
  )
}
