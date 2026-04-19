import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Target, Eye, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'

async function getPageContent() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('page_contents')
      .select('meta_title, meta_description, hero_title, hero_subtitle')
      .eq('page_slug', 'about')
      .single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent()
  return {
    title: content?.meta_title ?? 'About Us — Our Story & Mission',
    description: content?.meta_description ??
      'Learn about Piston Society — Australia\'s premium car subscription service. Our mission is to give Australians the freedom to drive great cars without the financial commitment of ownership.',
  }
}

const usps = [
  { title: 'Fully Transparent Pricing', desc: 'One weekly price covers everything. No surprises, no fine print.' },
  { title: 'Premium Vehicle Selection', desc: 'Curated fleet of well-maintained, modern vehicles from top brands.' },
  { title: 'Fast Approval Process', desc: 'Get approved and behind the wheel in as little as 48 hours.' },
  { title: 'Dedicated Support Team', desc: 'Real humans available to help you every step of the way.' },
  { title: 'Australia-Wide Coverage', desc: 'Operating across Sydney, Melbourne, Brisbane, Perth, and Adelaide.' },
  { title: 'Flexible Subscription Terms', desc: 'Start with 1 week — scale up or down as your needs change.' },
]

const serviceAreas = ['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD', 'Perth, WA', 'Adelaide, SA']

export default async function AboutPage() {
  const content = await getPageContent()
  const heroTitle = content?.hero_title ?? 'About Piston Society'
  const heroSubtitle = content?.hero_subtitle ?? 'We\'re on a mission to make premium car access simple, flexible, and stress-free for every Australian.'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative bg-[#1E40AF] pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=60"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-custom relative z-10">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-4">About Us</p>
          <h1 className="text-white font-heading font-bold text-4xl md:text-5xl mb-4 max-w-2xl">
            {heroTitle}
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">Our Story</p>
              <h2 className="text-[#1E293B] mb-6">
                Driven by a Better Idea
              </h2>
              <div className="space-y-4 text-[#64748B] leading-relaxed">
                <p>
                  Piston Society was born out of frustration with the traditional car ownership model. Our founders — passionate car enthusiasts — saw that Australians were being forced into expensive, long-term financial commitments just to access reliable transportation.
                </p>
                <p>
                  We asked ourselves: <em>What if driving a great car could be as simple as a monthly subscription?</em> No lengthy finance contracts, no depreciation worries, no expensive insurance renewals. Just a single weekly payment that covers everything.
                </p>
                <p>
                  Today, Piston Society operates across five major Australian cities, helping hundreds of subscribers enjoy the freedom of premium car access without the financial burden of ownership.
                </p>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80"
                alt="Car on Australian road — representing freedom and flexibility"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-[#F8FAFC]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0]">
              <div className="inline-flex p-3 rounded-xl bg-[#2563EB]/10 mb-5">
                <Target className="h-6 w-6 text-[#2563EB]" aria-hidden="true" />
              </div>
              <h3 className="text-[#1E293B] font-bold text-xl mb-3 font-heading">Our Mission</h3>
              <p className="text-[#64748B] leading-relaxed">
                To give every Australian the freedom to drive a premium vehicle without the financial strain of ownership — through transparent, all-inclusive subscription packages that flex with your life.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0]">
              <div className="inline-flex p-3 rounded-xl bg-[#1E40AF]/10 mb-5">
                <Eye className="h-6 w-6 text-[#1E40AF]" aria-hidden="true" />
              </div>
              <h3 className="text-[#1E293B] font-bold text-xl mb-3 font-heading">Our Vision</h3>
              <p className="text-[#64748B] leading-relaxed">
                To become Australia&apos;s most trusted car subscription platform — where every customer knows exactly what they&apos;re paying, loves their vehicle, and never has to worry about the hassle of traditional ownership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">Why Us</p>
            <h2 className="text-[#1E293B]">Why Choose Piston Society?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {usps.map((usp) => (
              <div key={usp.title} className="flex gap-4 p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#2563EB]/30 hover:shadow-md transition-all">
                <CheckCircle2 className="h-5 w-5 text-[#22C55E] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="font-bold text-[#1E293B] mb-1">{usp.title}</h4>
                  <p className="text-sm text-[#64748B] leading-relaxed">{usp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-[#F8FAFC]">
        <div className="container-custom">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">Coverage</p>
            <h2 className="text-[#1E293B] mb-4">Where We Operate</h2>
            <p className="text-[#64748B]">We currently service the following major Australian cities, with expansion planned for 2026.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {serviceAreas.map((city) => (
              <div key={city} className="flex items-center gap-2.5 bg-white border border-[#E2E8F0] rounded-xl px-5 py-3 shadow-sm">
                <MapPin className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                <span className="font-semibold text-[#1E293B] text-sm">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[#1E40AF]">
        <div className="container-custom text-center">
          <h2 className="text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
            Browse our fleet and find the perfect car for your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button variant="primary" size="lg">
                Browse Our Cars
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white hover:text-[#1E40AF]">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
