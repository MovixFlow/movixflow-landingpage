import { api } from "@/src/service/Api"
import type {
  EmpresaPublica,
  SolicitacaoConsultaPayload,
  SolicitacaoConsultaResponse,
  SolicitacaoStatusResponse,
} from "@/src/types/solicitacao-consulta"

export async function getEmpresasPublicas(busca?: string): Promise<EmpresaPublica[]> {
  const params = busca ? { busca } : undefined
  const { data } = await api.get<EmpresaPublica[]>("/empresas/publicas", { params })
  return data
}

export async function criarSolicitacaoConsulta(
  payload: SolicitacaoConsultaPayload
): Promise<SolicitacaoConsultaResponse> {
  const { data } = await api.post<SolicitacaoConsultaResponse>(
    "/consultas/risco/solicitacoes",
    payload
  )
  return data
}

export async function getSolicitacaoStatus(
  codigo: string
): Promise<SolicitacaoStatusResponse> {
  const { data } = await api.get<SolicitacaoStatusResponse>(
    `/consultas/risco/solicitacoes/${codigo}/status`
  )
  return data
}

