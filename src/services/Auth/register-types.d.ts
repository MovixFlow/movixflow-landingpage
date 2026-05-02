export type TipoConta =
  | "ADMINISTRADOR"
  | "FUNCIONARIO"
  | "CLIENTE_CONSULTA";

export interface IRegisterNewUserRequest {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  tipoConta: TipoConta;

  // Empresa (CLIENTE_CONSULTA / ADMINISTRADOR)
  nomeEmpresa?: string | null;
  cnpjEmpresa?: string | null;
  telefoneEmpresa?: string | null;
  enderecoEmpresa?: string | null;
  cepEmpresa?: string | null;

  // Funcionário / Administrador interno
  empresaId?: string | null;
  departamentoId?: string | null;
  nomeDepartamento?: string[] | null;

  // Pessoa Física
  cpf?: string | null;
  dataNascimento?: string | null;
}

export type StatusSolicitacao = "PENDENTE" | "EM_ANALISE" | "APROVADA" | "REJEITADA";
export type StatusAcessoUsuario = "PENDENTE" | "ATIVO" | "BLOQUEADO";

export interface IUsuarioSolicitacao {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  statusAcesso: StatusAcessoUsuario;
}

export interface IEmpresaSolicitacao {
  id?: string;
  nome: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  cep: string;
  statusConsulta: StatusSolicitacao;
}

export interface IRegistroResponse {
  solicitacaoId: string;
  status: StatusSolicitacao;
  observacao: string;
  criadoEm: string; // ISO 8601 Date
  usuario: IUsuarioSolicitacao;
  empresa: IEmpresaSolicitacao;
}
