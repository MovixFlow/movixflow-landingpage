import axios from "axios";
import { apiConfigs } from "../../api";
import { ApiException } from "./ApiException";

interface ApiCustomMessage {
    mensagem: string;
}

export const API_BASE_URL = process.env.NODE_ENV === "production"
    ? apiConfigs.API_URL_PRODUCTION
    : apiConfigs.API_URL;


const api = axios.create({
    baseURL: API_BASE_URL,
});

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
