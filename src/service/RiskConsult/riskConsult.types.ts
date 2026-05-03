export type FocoConsulta = "COMPLETO" | "MOTORISTA" | "VEICULO"
export type FormatoConsulta = "TERCEIRO" | "AGREGADO" | "FROTA"
export type StatusConsulta =
  | "PENDENTE"
  | "EM_ANALISE"
  | "CONCLUIDA"
  | "REJEITADA"
  | "CANCELADA"

export interface MotoristaPayload {
  nome: string
  cpf: string
  cnhNumero: string
  categoriaCnh: string
  validadeCnh: string // ISO 8601: "YYYY-MM-DD"
  dataNascimento?: string // ISO 8601: "YYYY-MM-DD" ou Date
  nomeMae?: string
  nomePai?: string
  ufNascimento?: string
  codigoSeguranca?: string
}

export interface VeiculoPayload {
  placa: string
  renavam: string
  marca: string
  modelo: string
  ano: number
  funcao: string // ex: "CAVALO" | "CARRETA"
  cpfProprietario?: string
  cnpjProprietario?: string
  rntrcProprietario?: string
}

// ─── Payload por foco ────────────────────────────────────────────────────────

export interface ConsultaCompletaPayload {
  foco: "COMPLETO"
  formato: FormatoConsulta
  observacoesCliente?: string
  idEmpresaExecutor: string
  idEmpresaSolicitante: string
  nomeEmpresaSolicitante?: string
  clienteUsuarioId: string
  motorista: MotoristaPayload
  veiculos: VeiculoPayload[]
}

export interface ConsultaMotoristaPayload {
  foco: "MOTORISTA"
  formato: FormatoConsulta
  observacoesCliente?: string
  idEmpresaExecutor: string
  idEmpresaSolicitante: string
  nomeEmpresaSolicitante?: string
  clienteUsuarioId: string
  motorista: MotoristaPayload
  veiculos: []
}

export interface ConsultaVeiculoPayload {
  foco: "VEICULO"
  formato: FormatoConsulta
  observacoesCliente?: string
  idEmpresaExecutor: string
  idEmpresaSolicitante: string
  nomeEmpresaSolicitante?: string
  clienteUsuarioId: string
  motorista: null
  veiculos: VeiculoPayload[]
}

export type CriarConsultaPayload =
  (ConsultaCompletaPayload | ConsultaMotoristaPayload | ConsultaVeiculoPayload) & {
    idempotencyKey?: string
  }

// ─── Response ────────────────────────────────────────────────────────────────

export interface CriarConsultaResponse {
  id: string
  foco: FocoConsulta
  formato: FormatoConsulta
  status: StatusConsulta
  observacoesCliente?: string
  idEmpresaExecutor: string
  idEmpresaSolicitante: string
  clienteUsuarioId: string
  criadoEm: string
}
