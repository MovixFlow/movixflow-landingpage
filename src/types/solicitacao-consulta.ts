export type TipoConsulta = "MOTORISTA" | "VEICULO" | "COMPLETO"

export type StatusSolicitacao =
  | "AGUARDANDO_ACEITE"
  | "ACEITO"
  | "EM_ANALISE"
  | "CONCLUIDO"
  | "REJEITADO"

export type ResultadoConsulta = "APROVADO" | "REPROVADO" | "RESTRICAO" | null

export interface EmpresaPublica {
  id: string
  nome: string
  cnpj: string
  cidade: string
  estado: string
}

export interface SolicitacaoConsultaPayload {
  idEmpresa: string
  tipoConsulta: TipoConsulta
  nomeCliente: string
  documentoCliente: string
  emailCliente: string
  telefoneCliente: string
  // Motorista / Completo
  nomeMotorista?: string
  cpfMotorista?: string
  cnhMotorista?: string
  categoriaCnh?: string
  validadeCnh?: string
  // Veiculo / Completo
  placaVeiculo?: string
  renavamVeiculo?: string
  marcaVeiculo?: string
  modeloVeiculo?: string
  anoVeiculo?: string
  observacoes?: string
}

export interface SolicitacaoConsultaResponse {
  codigo: string
  status: StatusSolicitacao
  mensagem: string
}

export interface SolicitacaoStatusResponse {
  codigo: string
  status: StatusSolicitacao
  tipoConsulta: TipoConsulta
  nomeEmpresa: string
  resultado?: ResultadoConsulta
  motivoRejeicao?: string
  observacaoOperador?: string
  criadoEm: string
  atualizadoEm: string
}

// ─── Form data per step ───────────────────────────────────────────────────────

export interface StepSolicitanteData {
  nomeCliente: string
  documentoCliente: string
  emailCliente: string
  telefoneCliente: string
}

export interface StepEmpresaData {
  idEmpresa: string
  nomeEmpresa: string
}

export interface StepTipoConsultaData {
  tipoConsulta: TipoConsulta
}

export interface StepDadosConsultaData {
  // Motorista
  nomeMotorista?: string
  cpfMotorista?: string
  cnhMotorista?: string
  categoriaCnh?: string
  validadeCnh?: string
  // Veiculo
  placaVeiculo?: string
  renavamVeiculo?: string
  marcaVeiculo?: string
  modeloVeiculo?: string
  anoVeiculo?: string
  observacoes?: string
}

export interface FormStateCompleto
  extends StepSolicitanteData,
    StepEmpresaData,
    StepTipoConsultaData,
    StepDadosConsultaData {}
