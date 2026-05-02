import { api } from "@/src/service/Api";
import type {
  IAuthenticateLoginRequest,
  IAuthenticateLoginResponse,
} from "./authenticate-types";
import type { IForgotPasswordRequest } from "./forgot-password-types";
import type { IRegisterNewUserRequest } from "./register-types";

const AUTH_INFO_KEY = "autenticacao-info";
const USER_DATA_KEY = "autenticacao-dados-usuario";

export class AuthService {
  /** Efetua login na aplicação */
  static authenticateLogin = async (
    request: IAuthenticateLoginRequest
  ): Promise<IAuthenticateLoginResponse> => {
    const { data } = await api.post<IAuthenticateLoginResponse>(
      "/usuario/autenticar",
      request
    );

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    sessionStorage.setItem(
      AUTH_INFO_KEY,
      JSON.stringify({ token: data.token })
    );

    return data;
  };

  /** Cadastra um novo usuário */
  static registerNewUser = async (
    request: IRegisterNewUserRequest
  ): Promise<void> => {
    await api.post("/usuario/cadastrar", request);
  };

  /** Altera a senha do usuário */
  static forgotPassword = async (
    request: IForgotPasswordRequest
  ): Promise<void> => {
    await api.put("/usuario/alterar", request);
  };

  static logout(): void {
    sessionStorage.removeItem(AUTH_INFO_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
    delete api.defaults.headers.common["Authorization"];
  }

  static getStoredToken(): string | null {
    try {
      const raw = sessionStorage.getItem(AUTH_INFO_KEY);
      return raw ? (JSON.parse(raw) as { token: string }).token : null;
    } catch {
      return null;
    }
  }
}
