import axios from "axios"

const RISK_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://risk.movixflow.com.br/api"
    : "http://localhost:5043/api"

export const apiRiskConsult = axios.create({
  baseURL: RISK_API_URL,
})

apiRiskConsult.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      sessionStorage.removeItem("autenticacao-info")
      sessionStorage.removeItem("autenticacao-dados-usuario")
      window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

apiRiskConsult.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem("autenticacao-info")
      if (raw) {
        const { token } = JSON.parse(raw) as { token: string }
        if (token) {
          config.headers = config.headers ?? {}
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch {
      // sessionStorage indisponível — ignora
    }
  }
  return config
})
