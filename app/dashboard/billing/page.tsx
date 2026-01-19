"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, CreditCard, Loader2, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createCheckoutSession, createCustomerPortalSession } from "@/app/actions/stripe"

const plans = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    description: "Perfect for trying out NexusAI",
    features: [
      "Up to 3 workspaces",
      "Basic AI assistance",
      "5 GB storage",
      "Email support"
    ],
    priceId: null
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "For professionals and small teams",
    features: [
      "Unlimited workspaces",
      "Advanced AI features",
      "100 GB storage",
      "Priority support",
      "API access"
    ],
    priceId: "price_pro_monthly",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "SSO & SAML",
      "Dedicated support",
      "Custom AI models"
    ],
    priceId: "price_enterprise_monthly"
  }
]

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [currentPlan] = useState("free")

  const handleUpgrade = async (priceId: string, planName: string) => {
    setIsLoading(planName)
    try {
      const { url, error } = await createCheckoutSession(priceId)
      if (error) {
        toast({ title: error, variant: "destructive" })
        return
      }
      if (url) {
        window.location.href = url
      }
    } catch {
      toast({ title: "Failed to start checkout", variant: "destructive" })
    } finally {
      setIsLoading(null)
    }
  }

  const handleManageBilling = async () => {
    setIsLoading("portal")
    try {
      const { url, error } = await createCustomerPortalSession()
      if (error) {
        toast({ title: error, variant: "destructive" })
        return
      }
      if (url) {
        window.location.href = url
      }
    } catch {
      toast({ title: "Failed to open billing portal", variant: "destructive" })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Current Plan
          </CardTitle>
          <CardDescription>
            You are currently on the <strong className="text-foreground">Starter</strong> plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleManageBilling}
            disabled={isLoading === "portal"}
            className="bg-transparent"
          >
            {isLoading === "portal" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Manage Billing"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Plans */}
      <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-2">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.priceId ? (
                <Button 
                  className={`w-full ${!plan.popular ? "bg-transparent" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.priceId!, plan.name)}
                  disabled={isLoading === plan.name || currentPlan === plan.id}
                >
                  {isLoading === plan.name ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : currentPlan === plan.id ? (
                    "Current Plan"
                  ) : (
                    "Upgrade"
                  )}
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full bg-transparent">
                  Current Plan
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
