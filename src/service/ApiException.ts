import axios from "axios";
import { apiConfigs } from "../../api";
import { isApiCustomMessage } from "./Api";

const statusCodeTreated = [400, 404, 409];

export class ApiException extends Error {
    public readonly message: string;

    public readonly name: string;

    constructor(error: any, personalizedMessage: string) {
        super();

        this.name = error.name;

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                if (error.response.data && isApiCustomMessage(error.response.data))
                    this.message = error.response.data.mensagem;
                else this.message = personalizedMessage;

                Redirect.toLoginPageComponent();

                const isOnLoginRoute = window.location.href
                    .toLowerCase()
                    ;

                // if (!isOnLoginRoute) Authentication.logout();
            } else if (
                error.response?.status &&
                statusCodeTreated.includes(error.response.status)
            ) {
                if (typeof error.response.data === "string" && error.response.data)
                    this.message = error.response.data;
                else if (isApiCustomMessage(error.response.data))
                    this.message = error.response.data.mensagem;
                else this.message = personalizedMessage;
            } else if (
                (error.response?.status === 400 ||
                    error.response?.status === 403 ||
                    error.response?.status === 500) &&
                isApiCustomMessage(error.response.data)
            ) {
                this.message = error.response.data.mensagem;
            } else {
                if (error.code === "ERR_NETWORK")
                    this.message = process.env.NODE_ENV === "development"
                        ? `Verifique se a API está ligada no endereço: ${apiConfigs.API_URL}`
                        : "Houve um problema ao tentar estabelecer conexão com o servidor. Por favor, verifique sua conexão com a internet e tente novamente mais tarde.";
                else this.message = personalizedMessage;
            }
        } else this.message = personalizedMessage;
    }
}


const toLoginPageComponent = () => (window.location.href = `/entrar`);

export const Redirect = { toLoginPageComponent };
