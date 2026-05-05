import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET ?? ""
const BILLING_API_URL = process.env.BILLING_API_URL ?? ""
const BILLING_API_TOKEN = process.env.BILLING_API_TOKEN ?? ""

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex")
  return expected === signature
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
    const empresaId: string | undefined = data?.metadata?.empresaId
    const assinaturaId: string = data?.id ?? ""
    const plano: string = data?.items?.[0]?.product?.externalId
      ?.replace("movixflow-", "")
      ?.replace("-mensal", "") ?? ""

    switch (event.event) {
      case "subscription.completed":
        // Assinatura ativada — primeira cobrança paga
        await atualizarAssinaturaBilling(
          empresaId!,
          assinaturaId,
          plano,
          "ativa",
          data?.nextBillingDate
        )
        break

      case "subscription.renewed":
        // Renovação mensal paga com sucesso
        await atualizarAssinaturaBilling(
          empresaId!,
          assinaturaId,
          plano,
          "ativa",
          data?.nextBillingDate
        )
        break

      case "subscription.cancelled":
        // Assinatura cancelada
        await atualizarAssinaturaBilling(
          empresaId!,
          assinaturaId,
          plano,
          "cancelada"
        )
        break

      case "subscription.plan_changed":
        // Plano alterado (aplica no próximo ciclo)
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
