import { api } from "@/src/service/Api"
import type { CrlvDadosBasicos } from "@/src/types/veiculo"

export async function extrairDadosCrlv(arquivo: File): Promise<CrlvDadosBasicos> {
  const form = new FormData()
  form.append("arquivo", arquivo)

  const { data } = await api.post<CrlvDadosBasicos>(
    "/veiculo/extrair-dados-basicos-crlv",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  )

  return data
}
