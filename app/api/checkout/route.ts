import { NextRequest, NextResponse } from "next/server"

const ABACATE_KEY = process.env.ABACATEPAY_API_KEY ?? ""
const BASE = "https://api.abacatepay.com/v2"

function resolveAppUrl(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  const host = req.headers.get("host") ?? "localhost:3000"
  const proto = host.startsWith("localhost") ? "http" : "https"
  return `${proto}://${host}`
}

type PlanConfig = {
  externalId: string
  name: string
  price: number
  currency: string
  frequency: "MONTHLY" | "WEEKLY" | "YEARLY"
}

const PLANS: Record<string, PlanConfig> = {
  basic: {
    externalId: "movixflow-starter-mensal",
    name: "Plano Starter — MovixFlow",
    price: 19700, // R$ 197,00 em centavos
    currency: "BRL",
    frequency: "MONTHLY",
  },
  standard: {
    externalId: "movixflow-growth-mensal",
    name: "Plano Growth — MovixFlow",
    price: 67000, // R$ 670,00 em centavos
    currency: "BRL",
    frequency: "MONTHLY",
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
  const findRes = await abacate(
    `/products/get?externalId=${encodeURIComponent(plan.externalId)}`
  )
  const findData = await findRes.json()

  if (findData.success && findData.data?.id) {
    return findData.data.id as string
  }

  const createRes = await abacate("/products/create", {
    method: "POST",
    body: JSON.stringify({
      externalId: plan.externalId,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      frequency: plan.frequency,
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

    // Existing user flow: empresaId is known
    const empresaId = body.empresaId as string | undefined

    // New user flow: registration data passed so webhook can provision automatically
    const registration = body.registration as {
      nome: string
      email: string
      senha: string
      nomeEmpresa: string
      cnpjEmpresa?: string
      telefone?: string
    } | undefined

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

    if (!empresaId && !registration) {
      return NextResponse.json(
        { error: "É necessário informar empresaId ou dados de cadastro." },
        { status: 400 }
      )
    }

    const appUrl = resolveAppUrl(req)

    if (appUrl.startsWith("http://localhost")) {
      return NextResponse.json(
        { error: "Checkout indisponível em ambiente local. Acesse via URL pública para testar o pagamento." },
        { status: 422 }
      )
    }

    const productId = await getOrCreateProduct(plan)

    const metadata: Record<string, string> = {}
    if (empresaId) {
      metadata.empresaId = empresaId
    }
    if (registration) {
      metadata.reg_nome = registration.nome
      metadata.reg_email = registration.email
      metadata.reg_senha = registration.senha
      metadata.reg_nomeEmpresa = registration.nomeEmpresa
      if (registration.cnpjEmpresa) metadata.reg_cnpjEmpresa = registration.cnpjEmpresa
      if (registration.telefone) metadata.reg_telefone = registration.telefone
      metadata.reg_plano = planKey
    }

    const subscriptionRes = await abacate("/subscriptions/create", {
      method: "POST",
      body: JSON.stringify({
        items: [{ id: productId, quantity: 1 }],
        returnUrl: `${appUrl}/`,
        completionUrl: `${appUrl}/pagamento-confirmado`,
        methods: ["CARD"],
        metadata,
      }),
    })
    const subscriptionData = await subscriptionRes.json()

    const url: string | undefined = subscriptionData?.data?.url
    if (!url) {
      console.error("[AbacatePay] subscription error:", JSON.stringify(subscriptionData))
      return NextResponse.json(
        { error: subscriptionData?.error ?? "Erro ao criar assinatura." },
        { status: 502 }
      )
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error("[AbacatePay] erro interno:", err)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
