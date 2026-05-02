export interface IAuthenticateLoginRequest {
  usuario: string;
  senha: string;
}

export interface AuthenticateClaims {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  createdAt: string;
  tipoUsuario: "CLIENTE_CONSULTA" | "ADMINISTRADOR" | "FUNCIONARIO" | "PF" | "EMPRESA_TERCEIRA";
  idEmpresa: string;
  identificador: string;
  statusAcesso: "ATIVO" | "PENDENTE" | "BLOQUEADO";
  idEmpresaVinculada?: string;
  nomeEmpresaVinculada?: string;
}

export interface IAuthenticateLoginResponse {
  token: string;
  claims: AuthenticateClaims;
}
