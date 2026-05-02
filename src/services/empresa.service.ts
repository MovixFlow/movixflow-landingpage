import { api } from "@/src/service/Api"

export interface Empresa {
  id: string
  nome: string
  cnpj: string
  telefone: string
  endereco: string
  cep: string
  aceitamentoAutomatico: boolean
}

export async function getTodasEmpresas(): Promise<Empresa[]> {
  const { data } = await api.get<Empresa[]>("/empresa/todas")
  return data
}

export async function getParceiras(termo?: string): Promise<Empresa[]> {
  const params = termo ? { termo } : {}
  const { data } = await api.get<Empresa[]>("/empresa/parceiras", { params })
  return data
}
