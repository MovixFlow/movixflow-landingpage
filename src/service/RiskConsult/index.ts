import { apiRiskConsult } from "@/src/service/ApiRiskConsult"
import type {
  CriarConsultaPayload,
  CriarConsultaResponse,
  ConsultaCompletaPayload,
  ConsultaMotoristaPayload,
  ConsultaVeiculoPayload,
  MotoristaPayload,
  VeiculoPayload,
  FormatoConsulta,
} from "./riskConsult.types"

export type {
  CriarConsultaPayload,
  CriarConsultaResponse,
  ConsultaCompletaPayload,
  ConsultaMotoristaPayload,
  ConsultaVeiculoPayload,
  MotoristaPayload,
  VeiculoPayload,
  FormatoConsulta,
}

const ENDPOINT = "/solicitacoes/consulta-risco"

export async function criarConsultaCompleta(
  payload: Omit<ConsultaCompletaPayload, "foco">
): Promise<CriarConsultaResponse> {
  const { data } = await apiRiskConsult.post<CriarConsultaResponse>(ENDPOINT, {
    ...payload,
    foco: "COMPLETO",
  } satisfies ConsultaCompletaPayload)
  return data
}

export async function criarConsultaMotorista(
  payload: Omit<ConsultaMotoristaPayload, "foco" | "veiculos">
): Promise<CriarConsultaResponse> {
  const { data } = await apiRiskConsult.post<CriarConsultaResponse>(ENDPOINT, {
    ...payload,
    foco: "MOTORISTA",
    veiculos: [],
  } satisfies ConsultaMotoristaPayload)
  return data
}

export async function criarConsultaVeiculo(
  payload: Omit<ConsultaVeiculoPayload, "foco" | "motorista">
): Promise<CriarConsultaResponse> {
  const { data } = await apiRiskConsult.post<CriarConsultaResponse>(ENDPOINT, {
    ...payload,
    foco: "VEICULO",
    motorista: null,
  } satisfies ConsultaVeiculoPayload)
  return data
}

export async function criarConsulta(
  payload: CriarConsultaPayload
): Promise<CriarConsultaResponse> {
  const { data } = await apiRiskConsult.post<CriarConsultaResponse>(ENDPOINT, payload)
  return data
}
