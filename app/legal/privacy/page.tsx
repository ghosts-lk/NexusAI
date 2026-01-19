import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export const metadata = {
  title: "Privacy Policy - NexusAI",
  description: "Learn how NexusAI collects, uses, and protects your personal information."
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 20, 2026</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Account information (name, email address, password)</li>
              <li>Profile information (job title, company name)</li>
              <li>Content you create, upload, or share within the platform</li>
              <li>Payment information (processed securely via Stripe)</li>
              <li>Communications with our support team</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent security incidents</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
            <p className="text-muted-foreground mb-4">
              Your data is stored securely using industry-standard encryption. We use Supabase 
              for database hosting with Row Level Security (RLS) policies to ensure data isolation. 
              All data transfers are encrypted using TLS 1.3.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Supabase</strong> - Database and authentication</li>
              <li><strong>Stripe</strong> - Payment processing</li>
              <li><strong>Vercel</strong> - Application hosting and analytics</li>
              <li><strong>OpenAI</strong> - AI features and assistance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access, correct, or delete your personal information</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Request restriction of processing</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as 
              needed to provide services. You may delete your account at any time, and we will 
              delete your data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at 
              privacy@nexusai.app or through our support channels.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
