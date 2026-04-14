import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Piston Society Terms and Conditions for car subscription services in Australia.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#1E3A5F] pt-28 pb-12">
        <div className="container-custom">
          <h1 className="text-white font-heading font-bold text-4xl mb-2">Terms &amp; Conditions</h1>
          <p className="text-white/60 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      <div className="container-custom py-12 max-w-4xl">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#E2E8F0] prose prose-slate max-w-none">
          <div className="space-y-8 text-[#475569] text-sm leading-relaxed">

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">1. Introduction</h2>
              <p>Welcome to Piston Society (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). These Terms and Conditions govern your use of our car subscription and long-term rental services. By accessing or using our services, you agree to be bound by these terms. Please read them carefully before subscribing.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">2. Subscription Agreement</h2>
              <p>A car subscription with Piston Society is a flexible vehicle access arrangement. Upon approval of your application, you will be required to sign a Subscription Agreement which forms a binding contract between you and Piston Society. The Subscription Agreement will detail the specific vehicle, pricing, and terms applicable to your subscription.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">3. Eligibility</h2>
              <p>To subscribe with Piston Society, you must:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Be at least 18 years of age</li>
                <li>Hold a valid Australian driver&apos;s licence</li>
                <li>Be an Australian resident or hold a valid visa</li>
                <li>Provide accurate and complete personal information</li>
                <li>Pass our eligibility assessment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">4. Pricing and Payments</h2>
              <p>Weekly subscription fees are charged in advance. Prices are displayed in Australian Dollars (AUD) inclusive of GST. The upfront fee, if applicable, is payable upon commencement of your subscription. All pricing is subject to change upon renewal.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">5. What&apos;s Included</h2>
              <p>Your subscription includes comprehensive motor vehicle insurance, CTP insurance, vehicle registration, scheduled servicing, routine maintenance, and 24/7 roadside assistance. Fuel is not included and remains your responsibility.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">6. Vehicle Use</h2>
              <p>You agree to use the vehicle in accordance with Australian road laws, manufacturer guidelines, and our policies. The vehicle must not be used for commercial hire, racing, off-road driving (unless specified), or any illegal activity.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">7. Cancellation and Termination</h2>
              <p>After your minimum term, you may cancel your subscription by providing written notice as specified in your Subscription Agreement. Piston Society reserves the right to terminate subscriptions for breach of these terms or the Subscription Agreement.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">8. Liability</h2>
              <p>To the maximum extent permitted by Australian Consumer Law, Piston Society&apos;s liability is limited to the resupply of services or payment of the cost of resupply. We are not liable for indirect or consequential losses.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">9. Governing Law</h2>
              <p>These Terms are governed by the laws of New South Wales, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of New South Wales.</p>
            </section>

            <section>
              <h2 className="text-[#1E293B] text-xl font-bold font-heading mb-3">10. Contact</h2>
              <p>For questions about these Terms, please contact us at <a href="mailto:info@pistonsociety.com.au" className="text-[#E85D2A] hover:underline">info@pistonsociety.com.au</a> or call <a href="tel:+61422663888" className="text-[#E85D2A] hover:underline">+61 422 663 888</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
