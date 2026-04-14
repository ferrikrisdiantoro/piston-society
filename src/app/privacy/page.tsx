import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Piston Society Privacy Policy — how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#1E3A5F] pt-28 pb-12">
        <div className="container-custom">
          <h1 className="text-white font-heading font-bold text-4xl mb-2">Privacy Policy</h1>
          <p className="text-white/60 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      <div className="container-custom py-12 max-w-4xl">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#E2E8F0]">
          <div className="space-y-8 text-[#475569] text-sm leading-relaxed">

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">1. Our Commitment to Privacy</h2>
              <p>Piston Society is committed to protecting your privacy. This policy explains how we collect, use, disclose, and safeguard your personal information in accordance with the Australian Privacy Act 1988 and the Australian Privacy Principles (APPs).</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">2. Information We Collect</h2>
              <p>We may collect the following personal information:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Name, email address, phone number, and date of birth</li>
                <li>Driver&apos;s licence details for verification</li>
                <li>Address and location information</li>
                <li>Payment information (processed securely via our payment providers)</li>
                <li>Vehicle usage and subscription history</li>
                <li>Website usage data via cookies and analytics tools</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">3. How We Use Your Information</h2>
              <p>We use your personal information to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Process and manage your car subscription</li>
                <li>Communicate with you about your enquiry or subscription</li>
                <li>Verify your identity and eligibility</li>
                <li>Process payments and manage billing</li>
                <li>Improve our services and website</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">4. Disclosure of Information</h2>
              <p>We do not sell your personal information. We may disclose your information to trusted third parties including insurance providers, vehicle maintenance companies, and technology service providers — only as necessary to deliver our services.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">5. Cookies</h2>
              <p>Our website uses cookies and similar technologies to enhance your browsing experience and analyse site traffic. You may disable cookies through your browser settings, though this may affect site functionality.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">6. Data Security</h2>
              <p>We implement reasonable security measures to protect your personal information from unauthorised access, disclosure, or misuse. Data is stored securely using industry-standard encryption and access controls.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">7. Your Rights</h2>
              <p>You have the right to access, correct, or request deletion of your personal information. To exercise these rights, contact us at <a href="mailto:info@pistonsociety.com.au" className="text-[#E85D2A] hover:underline">info@pistonsociety.com.au</a>. We will respond within 30 days.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify subscribers of significant changes via email. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">9. Contact Us</h2>
              <p>For privacy enquiries or complaints, contact our Privacy Officer at <a href="mailto:info@pistonsociety.com.au" className="text-[#E85D2A] hover:underline">info@pistonsociety.com.au</a> or <a href="tel:+61422663888" className="text-[#E85D2A] hover:underline">+61 422 663 888</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
