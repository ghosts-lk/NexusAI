"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function createCheckoutSession(priceId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Please sign in to continue" }
    }

    const headersList = await headers()
    const origin = headersList.get("origin") || "http://localhost:3000"

    // Create or retrieve customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    let customerId = customers.data[0]?.id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      })
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: priceId === "price_pro_monthly" ? "NexusAI Pro" : "NexusAI Enterprise",
              description: priceId === "price_pro_monthly" 
                ? "For professionals and small teams" 
                : "For large organizations",
            },
            unit_amount: priceId === "price_pro_monthly" ? 2900 : 9900,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/dashboard/billing?success=true`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      metadata: {
        supabase_user_id: user.id
      }
    })

    return { url: session.url }
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return { error: "Failed to create checkout session" }
  }
}

export async function createCustomerPortalSession() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Please sign in to continue" }
    }

    const headersList = await headers()
    const origin = headersList.get("origin") || "http://localhost:3000"

    // Find customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    if (!customers.data[0]) {
      return { error: "No billing account found" }
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${origin}/dashboard/billing`
    })

    return { url: session.url }
  } catch (error) {
    console.error("Stripe portal error:", error)
    return { error: "Failed to open billing portal" }
  }
}
