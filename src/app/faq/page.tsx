import type { Metadata } from 'next'
import Link from 'next/link'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'
import { generateFAQJsonLd } from '@/lib/utils/seo'
import type { FAQ } from '@/lib/types/database'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description:
    'Got questions about car subscriptions? Find answers to our most frequently asked questions about pricing, insurance, vehicles, how to get started, and more.',
}

const FALLBACK_FAQS: FAQ[] = [
  { id: '1', question: 'What is a car subscription?', answer: 'A car subscription is a flexible way to drive a car without the commitment of buying or leasing. You pay a weekly fee that covers everything — insurance, registration, servicing, and roadside assist.', category: 'General', display_order: 1, is_visible: true, created_at: '' },
  { id: '2', question: 'How is this different from traditional car rental?', answer: 'Unlike short-term rental, our subscriptions are designed for long-term use with all costs bundled in. No surprise bills, no hidden fees. Think of it as having your own car, without the hassle of ownership.', category: 'General', display_order: 2, is_visible: true, created_at: '' },
  { id: '3', question: 'Are there any hidden fees?', answer: 'No. The weekly price you see includes registration, insurance, CTP, servicing, maintenance, and roadside assistance. The only additional cost is fuel.', category: 'Pricing', display_order: 3, is_visible: true, created_at: '' },
  { id: '4', question: 'What is the upfront fee?', answer: "The upfront fee is a one-time payment when you start your subscription. It covers administrative and vehicle preparation costs. The amount varies by vehicle — check each car's listing for details.", category: 'Pricing', display_order: 4, is_visible: true, created_at: '' },
  { id: '5', question: 'What is the minimum subscription period?', answer: 'Our minimum subscription period varies by vehicle, starting from as little as 1 week. You can see the minimum term on each car\'s listing page.', category: 'Pricing', display_order: 5, is_visible: true, created_at: '' },
  { id: '6', question: 'Can I cancel anytime?', answer: 'After your minimum term, you can give notice to end your subscription. We require advance notice as per the subscription agreement — our team will confirm the exact notice period for your plan.', category: 'General', display_order: 6, is_visible: true, created_at: '' },
  { id: '7', question: 'Can I switch cars during my subscription?', answer: "Please contact our team to discuss switching options. We'll do our best to accommodate your needs, subject to vehicle availability.", category: 'Vehicles', display_order: 7, is_visible: true, created_at: '' },
  { id: '8', question: 'What happens if the car breaks down?', answer: '24/7 roadside assistance is included in your subscription. If the vehicle has a mechanical issue covered by our maintenance policy, we will repair it at no cost to you.', category: 'Vehicles', display_order: 8, is_visible: true, created_at: '' },
  { id: '9', question: 'What insurance is included?', answer: 'Comprehensive motor vehicle insurance is included in your subscription, along with CTP (Compulsory Third Party) insurance. You do not need to arrange your own insurance.', category: 'Insurance', display_order: 9, is_visible: true, created_at: '' },
  { id: '10', question: 'What if I have an accident?', answer: 'Contact us immediately if you are involved in an accident. Comprehensive insurance is included, but an excess may apply depending on circumstances. Our team will guide you through the claims process.', category: 'Insurance', display_order: 10, is_visible: true, created_at: '' },
  { id: '11', question: 'Can I extend my subscription?', answer: 'Absolutely! You can extend your subscription at any time by contacting our team. We\'ll confirm the rate and update your agreement accordingly.', category: 'General', display_order: 11, is_visible: true, created_at: '' },
  { id: '12', question: 'What documents do I need?', answer: 'You\'ll need a valid Australian driver\'s licence, proof of address, and a phone number for contact. Additional documentation may be requested during the approval process.', category: 'General', display_order: 12, is_visible: true, created_at: '' },
]

const CATEGORIES = ['General', 'Pricing', 'Vehicles', 'Insurance']

async function getFAQs() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
    return data && data.length > 0 ? data : FALLBACK_FAQS
  } catch {
    return FALLBACK_FAQS
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs()
  const faqJsonLd = generateFAQJsonLd(faqs)

  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    items: faqs
      .filter((f) => f.category === cat)
      .map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
  })).filter((c) => c.items.length > 0)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Hero */}
        <section className="bg-[#1E3A5F] pt-28 pb-16">
          <div className="container-custom">
            <p className="text-[#E85D2A] font-semibold text-sm tracking-widest uppercase mb-4">FAQ</p>
            <h1 className="text-white font-heading font-bold text-4xl md:text-5xl mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-white/70 text-lg max-w-xl leading-relaxed">
              Everything you need to know about Piston Society&apos;s car subscription service.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="section-padding">
          <div className="container-custom max-w-3xl">
            {byCategory.map((group) => (
              <div key={group.category} className="mb-12">
                <h2 className="text-xl font-bold font-heading text-[#1E293B] mb-5 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-[#E85D2A] inline-block" aria-hidden="true" />
                  {group.category}
                </h2>
                <Accordion items={group.items} />
              </div>
            ))}

            {/* Still have questions */}
            <div className="mt-10 p-8 rounded-2xl bg-[#1E3A5F] text-center">
              <h3 className="text-white font-bold text-xl mb-2 font-heading">
                Still have questions?
              </h3>
              <p className="text-white/70 text-sm mb-5">
                Our team is happy to help. Reach out and we&apos;ll get back to you within 24 hours.
              </p>
              <Link href="/contact">
                <Button variant="primary" size="md">
                  Contact Our Team
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
