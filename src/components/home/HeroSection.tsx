import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Hero">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
          alt="Premium car on the road"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-[#E85D2A]/20 border border-[#E85D2A]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#E85D2A] animate-pulse" aria-hidden="true" />
            <span className="text-[#E85D2A] text-sm font-semibold tracking-wide">
              Australia&apos;s Premium Car Subscription
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-white font-heading font-bold leading-tight mb-6">
            Drive Your Dream Car.{' '}
            <span className="text-[#E85D2A]">No Lock-In.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
            Flexible car subscriptions in Australia. All-inclusive — insurance,
            registration, servicing &amp; roadside assist included. Start driving
            from as little as{' '}
            <span className="text-white font-semibold">$179/week.</span>
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            {[
              'No hidden fees',
              'Cancel anytime',
              '5-star service',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                <svg className="h-4 w-4 text-[#22C55E] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/cars">
              <Button variant="primary" size="lg" className="group">
                Browse Cars
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-[#1E3A5F]">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
      </div>
    </section>
  )
}
