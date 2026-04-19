import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, ClipboardCheck, Car, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'

async function getPageContent() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('page_contents')
      .select('meta_title, meta_description, hero_title, hero_subtitle')
      .eq('page_slug', 'how-it-works')
      .single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent()
  return {
    title: content?.meta_title ?? 'How It Works — Car Subscription Process',
    description: content?.meta_description ??
      'Learn how Piston Society\'s car subscription works. Browse cars, submit an enquiry, and drive away — all within 48 hours. All-inclusive pricing, no lock-in contracts.',
  }
}

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse Our Cars',
    description: 'Explore our curated fleet of premium vehicles. Use our filters to find cars by make, body type, fuel type, price range, and location. Each listing shows the full weekly price — no surprises.',
    details: ['Filter by budget, body type, and location', 'View detailed specs and all-inclusive features', 'Compare multiple vehicles side by side'],
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'Submit an Enquiry',
    description: 'Once you\'ve found your ideal car, fill out our quick enquiry form. Our team reviews your application and contacts you within 24 hours to discuss availability and next steps.',
    details: ['Quick 2-minute online form', 'Our team calls within 24 hours', 'No credit check for initial enquiry'],
  },
  {
    number: '03',
    icon: Car,
    title: 'Drive Away',
    description: 'After approval, sign the subscription agreement and collect your keys. Everything is handled — insurance, registration, and servicing are all active from day one.',
    details: ['Vehicle ready within 48 hours of approval', 'Full handover and vehicle walk-through', 'All costs active from your start date'],
  },
]

const included = [
  { label: 'Registration', desc: 'Full vehicle registration is included and managed by us.' },
  { label: 'Comprehensive Insurance', desc: 'Full comprehensive motor vehicle insurance, no excess hassle.' },
  { label: 'CTP Insurance', desc: 'Compulsory Third Party insurance — legally required in Australia, covered by us.' },
  { label: 'Scheduled Servicing', desc: 'All scheduled manufacturer services are arranged and paid by us.' },
  { label: 'Ongoing Maintenance', desc: 'Wear-and-tear maintenance covered — tyres, brakes, and more.' },
  { label: '24/7 Roadside Assistance', desc: 'Stuck on the side of the road? Help is one call away, day or night.' },
]

const eligibility = [
  'Must be 18+ years of age',
  'Valid Australian driver\'s licence',
  'Australian resident or valid visa',
  'Ability to provide proof of address',
  'Mobile phone for contact purposes',
]

export default async function HowItWorksPage() {
  const content = await getPageContent()
  const heroTitle = content?.hero_title ?? 'How Car Subscription Works'
  const heroSubtitle = content?.hero_subtitle ?? 'Getting your subscription car is easier than you think. Three simple steps from browsing to driving.'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-[#1E40AF] pt-28 pb-16">
        <div className="container-custom">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-4">Simple Process</p>
          <h1 className="text-white font-heading font-bold text-4xl md:text-5xl mb-4 max-w-2xl">
            {heroTitle}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-12">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isEven = idx % 2 === 1
              return (
                <div key={step.number} className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 items-start`}>
                  {/* Icon side */}
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 rounded-2xl bg-[#F8FAFC] border-2 border-[#E2E8F0] flex items-center justify-center">
                      <Icon className="h-12 w-12 text-[#1E40AF]" aria-hidden="true" />
                      <span className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-[#2563EB] text-white text-sm font-bold font-heading flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-[#1E293B] text-2xl font-bold font-heading mb-3">
                      {step.title}
                    </h2>
                    <p className="text-[#64748B] leading-relaxed mb-5">{step.description}</p>
                    <ul className="space-y-2.5">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2.5 text-sm text-[#1E293B]">
                          <CheckCircle2 className="h-4 w-4 text-[#22C55E] flex-shrink-0" aria-hidden="true" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-[#F8FAFC]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">All-Inclusive</p>
            <h2 className="text-[#1E293B] mb-4">What&apos;s Included in Your Subscription</h2>
            <p className="text-[#64748B] text-lg">Every subscription comes fully loaded. Pay one weekly price — everything else is our responsibility.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {included.map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-[#22C55E]" aria-hidden="true" />
                  <h3 className="font-bold text-[#1E293B]">{item.label}</h3>
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">Requirements</p>
            <h2 className="text-[#1E293B] mb-4">Eligibility Requirements</h2>
            <p className="text-[#64748B]">To subscribe with Piston Society, you&apos;ll need to meet the following requirements:</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 space-y-3">
            {eligibility.map((req) => (
              <div key={req} className="flex items-center gap-3 text-[#1E293B]">
                <AlertCircle className="h-4 w-4 text-[#F59E0B] flex-shrink-0" aria-hidden="true" />
                <span className="text-sm">{req}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94A3B8] text-center mt-4">
            Full eligibility criteria will be confirmed during the enquiry process.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[#0F1A4F]">
        <div className="container-custom text-center">
          <h2 className="text-white mb-4">Ready to Get Behind the Wheel?</h2>
          <p className="text-white/70 mb-8 text-lg">Browse our full fleet and find your perfect car today.</p>
          <Link href="/cars">
            <Button variant="primary" size="lg">
              Browse Cars Now
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
