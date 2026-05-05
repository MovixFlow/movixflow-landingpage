import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET ?? ""
const BILLING_API_URL = process.env.BILLING_API_URL ?? ""
const BILLING_API_TOKEN = process.env.BILLING_API_TOKEN ?? ""
const BACKEND_API_URL = process.env.BACKEND_API_URL ?? ""

const PLAN_LIMITS: Record<string, number> = {
  starter: 30,
  growth: 9999,
}

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex")
  return expected === signature
}

async function provisionarNovaEmpresa(
  metadata: Record<string, string>,
  plano: string
): Promise<string | null> {
  if (!BACKEND_API_URL) {
    console.error("[AbacatePay] BACKEND_API_URL não configurado")
    return null
  }

  const nome = metadata.reg_nome
  const email = metadata.reg_email
  const senha = metadata.reg_senha
  const nomeEmpresa = metadata.reg_nomeEmpresa
  const cnpjEmpresa = metadata.reg_cnpjEmpresa ?? ""
  const telefone = metadata.reg_telefone ?? ""

  if (!nome || !email || !senha || !nomeEmpresa) {
    console.error("[AbacatePay] Dados de registro incompletos no metadata")
    return null
  }

  const res = await fetch(`${BACKEND_API_URL}/api/usuario/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      email,
      senha,
      tipoConta: 1, // TipoConta.ADMINISTRADOR
      nomeEmpresa,
      cnpjEmpresa,
      telefone,
    }),
  })

  const json = await res.json()

  if (!res.ok) {
    console.error("[AbacatePay] Erro ao criar usuário:", JSON.stringify(json))
    return null
  }

  const empresaId: string | undefined = json?.data?.empresaId ?? json?.empresaId
  if (!empresaId) {
    console.error("[AbacatePay] empresaId não retornado pelo backend:", JSON.stringify(json))
    return null
  }

  console.info(`[AbacatePay] Empresa provisionada: ${empresaId} (plano: ${plano})`)

  // Atualiza limite de usuários no billing conforme o plano
  await atualizarLimiteBilling(empresaId, plano)

  return empresaId
}

async function atualizarLimiteBilling(empresaId: string, plano: string): Promise<void> {
  if (!BILLING_API_URL) return
  const limite = PLAN_LIMITS[plano] ?? 30

  await fetch(`${BILLING_API_URL}/api/empresa_usuario_limite/cadastrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BILLING_API_TOKEN}`,
    },
    body: JSON.stringify({
      empresaId,
      limiteUsuarios: limite,
      usuariosAtivos: 0,
      valorPorUsuario: 0,
      diaCobranca: 10,
    }),
  }).catch((err) => console.warn("[AbacatePay] Erro ao atualizar limite:", err))
}

async function atualizarAssinaturaBilling(
  empresaId: string,
  assinaturaId: string,
  plano: string,
  status: string,
  dataProximaCobranca?: string
) {
  if (!BILLING_API_URL || !empresaId) return

  await fetch(`${BILLING_API_URL}/api/empresa/${empresaId}/assinatura`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BILLING_API_TOKEN}`,
    },
    body: JSON.stringify({
      assinaturaId,
      plano,
      status,
      dataProximaCobranca: dataProximaCobranca ?? null,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-webhook-signature") ?? ""

    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 })
    }

    const event = JSON.parse(rawBody) as {
      event: string
      data: Record<string, any>
    }

    const data = event.data
    const metadata: Record<string, string> = data?.metadata ?? {}

    let empresaId: string | undefined = metadata.empresaId
    const assinaturaId: string = data?.id ?? ""
    const plano: string = data?.items?.[0]?.product?.externalId
      ?.replace("movixflow-", "")
      ?.replace("-mensal", "") ?? ""

    switch (event.event) {
      case "subscription.completed": {
        // Se não tem empresaId mas tem dados de registro → provisionar automaticamente
        if (!empresaId && metadata.reg_email) {
          const novaEmpresaId = await provisionarNovaEmpresa(metadata, plano)
          if (novaEmpresaId) empresaId = novaEmpresaId
        }

        await atualizarAssinaturaBilling(
          empresaId!,
          assinaturaId,
          plano,
          "ativa",
          data?.nextBillingDate
        )
        break
      }

      case "subscription.renewed":
        await atualizarAssinaturaBilling(
          empresaId!,
          assinaturaId,
          plano,
          "ativa",
          data?.nextBillingDate
        )
        break

      case "subscription.cancelled":
        await atualizarAssinaturaBilling(
          empresaId!,
          assinaturaId,
          plano,
          "cancelada"
        )
        break

      case "subscription.plan_changed":
        console.info("[AbacatePay] Plano alterado:", data)
        break

      default:
        console.info("[AbacatePay] Evento não tratado:", event.event)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("[AbacatePay] Erro no webhook:", err)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
