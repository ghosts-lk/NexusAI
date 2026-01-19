import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>NexusAI</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The intelligent workspace for modern teams.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground">Integrations</Link></li>
              <li><Link href="#" className="hover:text-foreground">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">About</Link></li>
              <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/legal/security" className="hover:text-foreground">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>2026 NexusAI. All rights reserved.</p>
          <p>Built with Next.js and Vercel</p>
        </div>
      </div>
    </footer>
  )
}
