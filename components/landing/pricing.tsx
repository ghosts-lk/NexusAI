"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: 0,
    description: "Perfect for trying out NexusAI",
    features: [
      "Up to 3 workspaces",
      "Basic AI assistance",
      "5 GB storage",
      "Email support",
      "Community access"
    ],
    cta: "Get Started Free",
    popular: false,
    priceId: "free"
  },
  {
    name: "Pro",
    price: 29,
    description: "For professionals and small teams",
    features: [
      "Unlimited workspaces",
      "Advanced AI features",
      "100 GB storage",
      "Priority support",
      "API access",
      "Custom integrations",
      "Analytics dashboard"
    ],
    cta: "Start Free Trial",
    popular: true,
    priceId: "pro_monthly"
  },
  {
    name: "Enterprise",
    price: 99,
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "SSO & SAML",
      "Dedicated support",
      "Custom AI models",
      "SLA guarantee",
      "Advanced security",
      "Audit logs"
    ],
    cta: "Contact Sales",
    popular: false,
    priceId: "enterprise_monthly"
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-balance">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-xl border ${
                plan.popular 
                  ? "border-primary bg-card shadow-lg shadow-primary/10" 
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild
                className={`w-full ${plan.popular ? "" : "bg-transparent"}`}
                variant={plan.popular ? "default" : "outline"}
              >
                <Link href={plan.price === 0 ? "/auth/sign-up" : `/auth/sign-up?plan=${plan.priceId}`}>
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
