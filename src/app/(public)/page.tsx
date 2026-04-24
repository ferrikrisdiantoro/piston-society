import { Suspense } from 'react'
import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { BenefitsGrid } from '@/components/home/BenefitsGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FeaturedCars } from '@/components/home/FeaturedCars'
import { TestimonialsClient } from '@/components/home/Testimonials'
import { CTASection } from '@/components/home/CTASection'
import { CarCardSkeleton } from '@/components/ui/Skeleton'
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/utils/seo'
import { createClient } from '@/lib/supabase/server'
import { getPageContent } from '@/lib/utils/settings'

const DEFAULT_META_TITLE = 'Car Subscription & Long-Term Rental Australia | Piston Society'
const DEFAULT_META_DESC = 'Flexible car subscriptions across Australia from $179/week. All-inclusive — insurance, registration, CTP, servicing & roadside assist. No lock-in contracts. Browse our fleet today.'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('home')
  return {
    title: content?.meta_title || DEFAULT_META_TITLE,
    description: content?.meta_description || DEFAULT_META_DESC,
    openGraph: {
      title: content?.meta_title || 'Piston Society | Car Subscription Australia',
      description: content?.meta_description || 'Drive your dream car from $179/week. All-inclusive car subscription. No lock-in contracts.',
      url: 'https://www.pistonsociety.com.au',
    },
  }
}

async function getTestimonials() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(8)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [testimonials, content] = await Promise.all([
    getTestimonials(),
    getPageContent('home'),
  ])

  const orgJsonLd = generateOrganizationJsonLd()
  const webJsonLd = generateWebSiteJsonLd()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webJsonLd) }}
      />

      <HeroSection heroTitle={content?.hero_title} heroSubtitle={content?.hero_subtitle} />
      <BenefitsGrid />
      <HowItWorks />

      <Suspense
        fallback={
          <section className="section-padding bg-white">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <FeaturedCars />
      </Suspense>

      <TestimonialsClient testimonials={testimonials} />
      <CTASection />
    </>
  )
}
