import Link from 'next/link'
import { Search, ClipboardCheck, Car } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse & Choose',
    description:
      'Explore our curated fleet of premium vehicles. Filter by body type, budget, location, and fuel type to find your perfect match.',
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'Submit Enquiry',
    description:
      "Fill out our quick enquiry form with your details and preferred car. Our team will reach out within 24 hours to finalise everything.",
  },
  {
    number: '03',
    icon: Car,
    title: 'Drive Away',
    description:
      "Once approved, sign the subscription agreement and collect your keys. You're on the road — all costs handled by us.",
  },
]

export function HowItWorks() {
  return (
    <section
      className="section-padding bg-[#F8FAFC]"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#E85D2A] font-semibold text-sm tracking-widest uppercase mb-3">
            Simple Process
          </p>
          <h2 id="how-it-works-heading" className="text-[#1E293B] mb-4">
            On the Road in{' '}
            <span className="text-[#E85D2A]">3 Easy Steps</span>
          </h2>
          <p className="text-[#64748B] text-lg">
            We&apos;ve made getting your subscription car as simple as possible. No
            complicated paperwork, no long waits.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div
            className="hidden lg:block absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-gradient-to-r from-[#E85D2A]/30 via-[#E85D2A] to-[#E85D2A]/30"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Step icon + number */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-white border-4 border-[#E85D2A]/20 flex items-center justify-center shadow-lg z-10 relative">
                      <Icon className="h-10 w-10 text-[#1E3A5F]" aria-hidden="true" />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-[#E85D2A] text-white text-sm font-bold font-heading flex items-center justify-center shadow-md"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="text-[#1E293B] font-bold text-xl mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link href="/how-it-works">
            <Button variant="secondary" size="lg">
              Learn More About the Process
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
