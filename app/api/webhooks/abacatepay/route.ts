import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET ?? ""

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true // sem segredo configurado, aceita (dev mode)
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
      case "checkout.completed":
      case "billing.paid":
        // Pagamento confirmado — aqui você pode:
        // - Ativar a conta do cliente no banco de dados
        // - Enviar e-mail de boas-vindas
        // - Provisionar o acesso ao plano
        console.info("[AbacatePay] Pagamento confirmado:", event.data)
        break

      case "checkout.refunded":
      case "billing.refunded":
        console.info("[AbacatePay] Reembolso processado:", event.data)
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
