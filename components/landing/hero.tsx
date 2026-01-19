"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield, Star, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8">
          <Sparkles className="h-4 w-4" />
          <span>Start free. No credit card required.</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6">
          Your AI-Powered
          <span className="block text-primary">Productivity Workspace</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
          NexusAI combines intelligent documents, smart tasks, and AI assistance 
          to help your team work 10x faster. Built for the modern enterprise.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Button asChild size="lg" className="text-lg h-14 px-8">
            <Link href="/auth/sign-up">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8 bg-transparent">
            <Link href="#pricing">
              View Pricing
            </Link>
          </Button>
        </div>

        {/* Early Access Badge */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-amber-200">Early Access Available</span>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>Setup in 2 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>SOC2 compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Free forever plan</span>
          </div>
        </div>
      </div>
    </section>
  )
}
