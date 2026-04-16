import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  return (
    <section
      className="relative overflow-hidden py-24"
      aria-labelledby="cta-heading"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#1E3A8A] to-[#0F1A4F]" />

      {/* Decorative shapes */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 bg-[#0EA5E9]/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container-custom relative z-10 text-center">
        <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-4">
          Get Started Today
        </p>
        <h2 id="cta-heading" className="text-white mb-4 max-w-2xl mx-auto">
          Ready to Hit the Road?
        </h2>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Join hundreds of Australians enjoying the freedom of flexible car
          subscriptions. No commitment required to enquire.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <Button variant="primary" size="lg" className="group">
              Get Started — It&apos;s Free to Enquire
              <ArrowRight
                className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Button>
          </Link>
          <a
            href="https://wa.me/61423771678?text=Hi%2C%20I%27m%20interested%20in%20your%20car%20subscription%20service!"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white hover:text-[#1E40AF]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Chat on WhatsApp
            </Button>
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          {[
            { value: '12+', label: 'Vehicles Available' },
            { value: '5★', label: 'Average Rating' },
            { value: '24hr', label: 'Response Time' },
            { value: '100%', label: 'All-Inclusive' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold font-heading text-[#2563EB]">
                {stat.value}
              </p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
