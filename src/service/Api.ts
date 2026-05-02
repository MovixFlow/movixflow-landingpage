import axios from "axios";
import { apiConfigs } from "../../api";
import { ApiException } from "./ApiException";

interface ApiCustomMessage {
    mensagem: string;
}

export const API_RISK_CONSULT_URL = process.env.NODE_ENV === "production"
  ? apiConfigs.API_URL_RISK_CONSULT_PRODUCTION
  : apiConfigs.API_URL_RISK_CONSULT;

export const API_BASE_URL = process.env.NODE_ENV === "production"
    ? apiConfigs.API_URL_PRODUCTION
    : apiConfigs.API_URL;


const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

export const apiRiskConsult = axios.create({
  baseURL: API_RISK_CONSULT_URL,
  timeout: 15000,
});

const AUTH_ENDPOINTS = ["/usuario/autenticar"];

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const requestUrl: string = error?.config?.url ?? "";
        const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep));

        if (error?.response?.status === 401 && !isAuthEndpoint) {
            sessionStorage.removeItem("autenticacao-info");
            sessionStorage.removeItem("autenticacao-dados-usuario");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

function isApiCustomMessage(
    unknownObject: any
): unknownObject is ApiCustomMessage {
    return (
        typeof unknownObject === "object" &&
        unknownObject !== null &&
        "mensagem" in unknownObject
    );
}

function getErrorMessage(unknownError: any): ApiException {
    return unknownError as ApiException;
}

export { api, isApiCustomMessage, getErrorMessage };
