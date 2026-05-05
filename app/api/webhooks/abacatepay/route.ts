import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET ?? ""

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex")
  return expected === signature
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
      data: Record<string, unknown>
    }

    switch (event.event) {
      // Assinatura ativada — primeira cobrança paga
      case "subscription.completed":
        console.info("[AbacatePay] Assinatura ativada:", event.data)
        // TODO: ativar acesso do cliente no banco de dados
        break

      // Renovação mensal paga com sucesso
      case "subscription.renewed":
        console.info("[AbacatePay] Assinatura renovada:", event.data)
        // TODO: registrar renovação e garantir que o acesso continua ativo
        break

      // Assinatura cancelada
      case "subscription.cancelled":
        console.info("[AbacatePay] Assinatura cancelada:", event.data)
        // TODO: revogar acesso do cliente no banco de dados
        break

      // Plano trocado (aplica no próximo ciclo)
      case "subscription.plan_changed":
        console.info("[AbacatePay] Plano alterado:", event.data)
        // TODO: atualizar plano do cliente no banco de dados
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
