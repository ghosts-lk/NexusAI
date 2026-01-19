import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Shield, Lock, Eye, Server, Key, CheckCircle } from "lucide-react"

export const metadata = {
  title: "Security - NexusAI",
  description: "Learn about NexusAI's security practices and how we protect your data."
}

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption."
  },
  {
    icon: Shield,
    title: "Row Level Security",
    description: "Database-level policies ensure users can only access their own data, preventing unauthorized access."
  },
  {
    icon: Key,
    title: "Secure Authentication",
    description: "Industry-standard authentication with secure password hashing, session management, and optional 2FA."
  },
  {
    icon: Server,
    title: "SOC 2 Infrastructure",
    description: "Hosted on Vercel and Supabase, both SOC 2 Type II certified with enterprise-grade security."
  },
  {
    icon: Eye,
    title: "Privacy by Design",
    description: "We collect minimal data and never sell your information. Your data remains yours."
  },
  {
    icon: CheckCircle,
    title: "Regular Audits",
    description: "Continuous security monitoring, vulnerability scanning, and regular third-party audits."
  }
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Security at NexusAI</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your security is our top priority. We implement industry-leading practices 
              to protect your data and privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {securityFeatures.map((feature) => (
              <div 
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Data Protection Practices</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Infrastructure Security</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Deployed on Vercel's globally distributed edge network</li>
              <li>Database hosted on Supabase with automated backups</li>
              <li>DDoS protection and Web Application Firewall (WAF)</li>
              <li>Automatic security patches and updates</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Application Security</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Input validation and sanitization on all endpoints</li>
              <li>Protection against SQL injection and XSS attacks</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Secure HTTP headers (HSTS, CSP, X-Frame-Options)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Compliance</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>GDPR compliant data handling</li>
              <li>CCPA compliant for California residents</li>
              <li>Data Processing Agreements available</li>
              <li>Right to data portability and deletion</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Report a Vulnerability</h3>
            <p className="text-muted-foreground">
              We take security seriously. If you discover a security vulnerability, please 
              report it responsibly to security@nexusai.app. We appreciate your help in 
              keeping NexusAI secure.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
