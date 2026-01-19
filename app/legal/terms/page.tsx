import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export const metadata = {
  title: "Terms of Service - NexusAI",
  description: "Read the terms and conditions for using NexusAI services."
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 20, 2026</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using NexusAI, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              NexusAI is an AI-powered productivity platform that provides document management, 
              task organization, team collaboration, and AI assistance features. We reserve the 
              right to modify, suspend, or discontinue any part of the service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              To use certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              You retain ownership of content you create using NexusAI. We retain ownership of 
              the service, including all software, designs, and documentation. You grant us a 
              limited license to use your content solely to provide the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payment and Billing</h2>
            <p className="text-muted-foreground mb-4">
              For paid plans:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fees are billed in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable unless required by law</li>
              <li>You authorize us to charge your payment method</li>
              <li>Prices may change with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXUSAI SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS 
              OF PROFITS OR REVENUES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account at any time for violation of these terms. 
              Upon termination, your right to use the service will immediately cease. You may 
              export your data before termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these terms from time to time. We will notify you of significant 
              changes via email or through the service. Continued use after changes constitutes 
              acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us at 
              legal@nexusai.app or through our support channels.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
