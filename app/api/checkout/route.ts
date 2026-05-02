import { NextRequest, NextResponse } from "next/server"

const ABACATE_KEY = process.env.ABACATEPAY_API_KEY ?? ""
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "")
const BASE = "https://api.abacatepay.com/v2"

type PlanConfig = {
  externalId: string
  name: string
  price: number
  currency: string
}

const PLANS: Record<string, PlanConfig> = {
  basic: {
    externalId: "movixflow-basic-mensal",
    name: "Plano Basic — MovixFlow",
    price: 6700, // R$ 67,00 em centavos
    currency: "BRL",
  },
  standard: {
    externalId: "movixflow-standard-mensal",
    name: "Plano Standard — MovixFlow",
    price: 67000, // R$ 670,00 em centavos
    currency: "BRL",
  },
}

async function abacate(path: string, init: RequestInit = {}) {
  return fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${ABACATE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  })
}

async function getOrCreateProduct(plan: PlanConfig): Promise<string> {
  // Tenta encontrar produto existente pelo externalId
  const findRes = await abacate(
    `/products/get?externalId=${encodeURIComponent(plan.externalId)}`
  )
  const findData = await findRes.json()

  if (findData.success && findData.data?.id) {
    return findData.data.id as string
  }

  // Cria o produto se não existir
  const createRes = await abacate("/products/create", {
    method: "POST",
    body: JSON.stringify({
      externalId: plan.externalId,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
    }),
  })
  const createData = await createRes.json()

  if (!createData.success || !createData.data?.id) {
    throw new Error(createData.error ?? "Erro ao registrar produto no gateway.")
  }

  return createData.data.id as string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const planKey = body.plan as string

    if (!ABACATE_KEY) {
      return NextResponse.json(
        { error: "Gateway de pagamento não configurado." },
        { status: 503 }
      )
    }

    const plan = PLANS[planKey]
    if (!plan) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 })
    }

    const productId = await getOrCreateProduct(plan)

    const checkoutRes = await abacate("/checkouts/create", {
      method: "POST",
      body: JSON.stringify({
        items: [{ id: productId, quantity: 1 }],
        returnUrl: `${APP_URL}/`,
        completionUrl: `${APP_URL}/pagamento-confirmado`,
        methods: ["PIX", "CARD"],
      }),
    })
    const checkoutData = await checkoutRes.json()

    const url: string | undefined = checkoutData?.data?.url
    if (!url) {
      console.error("[AbacatePay] checkout error:", JSON.stringify(checkoutData))
      return NextResponse.json(
        { error: checkoutData?.error ?? "Erro ao criar checkout." },
        { status: 502 }
      )
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error("[AbacatePay] erro interno:", err)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
