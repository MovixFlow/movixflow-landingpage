"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"

export async function startCheckoutSession(productId: string) {
  console.log("[v0] Starting checkout session for product:", productId)

  const product = PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    console.error("[v0] Product not found:", productId)
    throw new Error(`Produto com id "${productId}" não encontrado`)
  }

  console.log("[v0] Product found:", product.name, "Price:", product.priceInCents)

  try {
    // Create Checkout Sessions with server-side price validation
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: [
        {
          price_data: {
            currency: "brl", // Brazilian Real
            product_data: {
              name: `Plano ${product.name}`,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: {
              interval: "month", // Monthly subscription
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription", // Subscription mode for recurring payments
      locale: "pt-BR", // Portuguese (Brazil) locale
    })

    console.log("[v0] Checkout session created successfully:", session.id)
    return session.client_secret
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)
    throw error
  }
}
