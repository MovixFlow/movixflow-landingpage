"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/src/service/Api"

export type TipoCliente = "PF" | "EMPRESA_TERCEIRA" | "EMPRESA_CONSULTAS" | "CLIENTE_CONSULTA"

export type StatusAcesso = "ATIVO" | "APROVADO" | "PENDENTE" | "BLOQUEADO"

export interface ClienteData {
  id?: string
  identificador?: string
  nome: string
  email: string
  telefone?: string
  tipo: TipoCliente
  statusAcesso?: StatusAcesso
  // Empresa do usuário (JWT claim idEmpresa)
  idEmpresa?: string
  // PF
  cpf?: string
  // Empresa
  razaoSocial?: string
  cnpj?: string
  nomeResponsavel?: string
  cidade?: string
  estado?: string
  // Vínculo com empresa parceira
  empresaVinculadaId?: string
  empresaVinculadaNome?: string
}

const AUTH_INFO_KEY = "autenticacao-info"
const USER_DATA_KEY = "autenticacao-dados-usuario"

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch {
    return null
  }
}

function getIdEmpresaFromToken(token: string): string | undefined {
  const payload = decodeJwtPayload(token)
  if (!payload) return undefined
  // o backend pode usar camelCase ou PascalCase
  const id = payload.idEmpresa ?? payload.IdEmpresa ?? payload.empresa_id
  return id && typeof id === "string" && id.length > 0 ? id : undefined
}

interface ClienteContextType {
  isReady: boolean
  isClienteLogado: boolean
  clienteData: ClienteData | null
  loginCliente: (data: ClienteData) => void
  logoutCliente: () => void
  updateClienteData: (data: Partial<ClienteData>) => void
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined)

export function ClienteProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [isClienteLogado, setIsClienteLogado] = useState(false)
  const [clienteData, setClienteData] = useState<ClienteData | null>(null)

  // Restaura sessão do sessionStorage na inicialização
  useEffect(() => {
    try {
      const authRaw = sessionStorage.getItem(AUTH_INFO_KEY)
      const userRaw = sessionStorage.getItem(USER_DATA_KEY)

      if (authRaw && userRaw) {
        const auth = JSON.parse(authRaw) as { token: string }
        const user = JSON.parse(userRaw) as ClienteData

        if (auth.token) {
          const payload = decodeJwtPayload(auth.token)
          if (payload?.exp && Date.now() / 1000 > payload.exp) {
            sessionStorage.removeItem(AUTH_INFO_KEY)
            sessionStorage.removeItem(USER_DATA_KEY)
            return
          }

          api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`
          setIsClienteLogado(true)

          // Preenche idEmpresa via decode do JWT se não estiver na sessão salva
          if (!user.idEmpresa) {
            const idFromToken = getIdEmpresaFromToken(auth.token)
            if (idFromToken) user.idEmpresa = idFromToken
          }

          setClienteData(user)
        }
      }
    } catch {
      sessionStorage.removeItem(AUTH_INFO_KEY)
      sessionStorage.removeItem(USER_DATA_KEY)
    } finally {
      setIsReady(true)
    }
  }, [])

  const loginCliente = (data: ClienteData) => {
    // Se idEmpresa não veio no data, tenta extrair do token já gravado
    if (!data.idEmpresa) {
      try {
        const authRaw = sessionStorage.getItem(AUTH_INFO_KEY)
        if (authRaw) {
          const { token } = JSON.parse(authRaw) as { token: string }
          const idFromToken = getIdEmpresaFromToken(token)
          if (idFromToken) data = { ...data, idEmpresa: idFromToken }
        }
      } catch { /* ignora */ }
    }

    setIsClienteLogado(true)
    setClienteData(data)
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(data))
  }

  const logoutCliente = () => {
    setIsClienteLogado(false)
    setClienteData(null)
    sessionStorage.removeItem(AUTH_INFO_KEY)
    sessionStorage.removeItem(USER_DATA_KEY)
    delete api.defaults.headers.common["Authorization"]
  }

  const updateClienteData = (data: Partial<ClienteData>) => {
    setClienteData((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...data }
      sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <ClienteContext.Provider value={{ isReady, isClienteLogado, clienteData, loginCliente, logoutCliente, updateClienteData }}>
      {children}
    </ClienteContext.Provider>
  )
}

export function useCliente() {
  const ctx = useContext(ClienteContext)
  if (!ctx) throw new Error("useCliente must be used inside ClienteProvider")
  return ctx
}
