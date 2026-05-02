export type StatusSolicitacaoCliente = "PENDENTE" | "EM_ANALISE" | "APROVADO" | "REPROVADO"

export interface SolicitacaoClienteListagemItem {
  id: string
  codigo: string
  dataSolicitacao: string
  tipo: "MOTORISTA" | "VEICULO" | "COMPLETO"
  nomeMotorista?: string | null
  placaVeiculoPrincipal?: string | null
  status: StatusSolicitacaoCliente
}

export interface PaginacaoResponse<T> {
  page: number
  pageSize: number
  total: number
  items: T[]
}

export interface ListarSolicitacoesFiltro {
  busca?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface MotoristaClienteDetalhe {
  nome?: string | null
  cpf?: string | null
  cnhNumero?: string | null
  categoriaCnh?: string | null
  validadeCnh?: string | null
  dataNascimento?: string | null
}

export interface VeiculoClienteDetalhe {
  placa?: string | null
  renavam?: string | null
  marca?: string | null
  modelo?: string | null
  ano?: number | null
  funcao?: string | null
}

export interface DetalheSolicitacaoCliente {
  id: string
  codigo: string
  dataSolicitacao: string
  foco: string
  formato: string
  status: string
  observacoesCliente?: string | null
  validadeDias?: number | null
  dataInicioValidade?: string | null
  dataFimValidade?: string | null
  estaVencida: boolean
  motorista?: MotoristaClienteDetalhe | null
  veiculos: VeiculoClienteDetalhe[]
}
