"use client"

import { useCallback } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { startCheckoutSession } from "@/app/actions/stripe"

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
console.log("[v0] Stripe publishable key available:", !!stripeKey)
console.log("[v0] Stripe key prefix:", stripeKey?.substring(0, 10))

const stripePromise = loadStripe(stripeKey!)

interface CheckoutProps {
  productId: string
}

export default function Checkout({ productId }: CheckoutProps) {
  console.log("[v0] Checkout component mounted for product:", productId)

  const startCheckoutSessionForProduct = useCallback(async () => {
    console.log("[v0] Fetching client secret for product:", productId)
    try {
      const clientSecret = await startCheckoutSession(productId)
      console.log("[v0] Client secret received:", !!clientSecret)
      if (!clientSecret) throw new Error("Client secret não retornado pela sessão de checkout")
      return clientSecret
    } catch (error) {
      console.error("[v0] Error fetching client secret:", error)
      throw error
    }
  }, [productId])

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckoutSessionForProduct }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
