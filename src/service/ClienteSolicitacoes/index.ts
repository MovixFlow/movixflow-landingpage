import { apiRiskConsult } from "@/src/service/ApiRiskConsult"
import type {
  DetalheSolicitacaoCliente,
  ListarSolicitacoesFiltro,
  PaginacaoResponse,
  SolicitacaoClienteListagemItem,
} from "./clienteSolicitacoes.types"

export type {
  DetalheSolicitacaoCliente,
  ListarSolicitacoesFiltro,
  PaginacaoResponse,
  SolicitacaoClienteListagemItem,
  MotoristaClienteDetalhe,
  VeiculoClienteDetalhe,
  StatusSolicitacaoCliente,
} from "./clienteSolicitacoes.types"

const ENDPOINT = "/clientes/solicitacoes-consulta-risco"

export async function listarSolicitacoesCliente(
  filtro?: ListarSolicitacoesFiltro
): Promise<PaginacaoResponse<SolicitacaoClienteListagemItem>> {
  const params: Record<string, string | number> = {
    page: filtro?.page ?? 1,
    pageSize: filtro?.pageSize ?? 10,
  }

  if (filtro?.status && filtro.status !== "TODOS") params.status = filtro.status
  if (filtro?.busca?.trim()) params.busca = filtro.busca.trim()

  const { data } = await apiRiskConsult.get<PaginacaoResponse<SolicitacaoClienteListagemItem>>(
    ENDPOINT,
    { params }
  )
  return data
}

export async function getDetalheSolicitacaoCliente(id: string): Promise<DetalheSolicitacaoCliente> {
  const { data } = await apiRiskConsult.get<DetalheSolicitacaoCliente>(`${ENDPOINT}/${id}`)
  return data
}
