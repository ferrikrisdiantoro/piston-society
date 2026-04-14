import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Calendar, DollarSign, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { ImageGallery } from '@/components/ui/ImageGallery'
import { CarSpecs } from '@/components/cars/CarSpecs'
import { CarCard } from '@/components/cars/CarCard'
import { Badge } from '@/components/ui/Badge'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, weeklyToMonthly } from '@/lib/utils/format'
import { generateCarMetadata, generateCarJsonLd } from '@/lib/utils/seo'
import type { Car, CarImage } from '@/lib/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCar(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*, car_images(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as unknown as Car & { car_images: CarImage[] }
}

async function getRelatedCars(car: Car) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('cars')
    .select('*, car_images(*)')
    .neq('id', car.id)
    .eq('is_available', true)
    .or(`body_type.eq.${car.body_type},make.eq.${car.make}`)
    .limit(3)

  return (data ?? []) as unknown as (Car & { car_images: CarImage[] })[]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const car = await getCar(id)
  if (!car) return { title: 'Car Not Found' }
  return generateCarMetadata(car)
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params
  const car = await getCar(id)
  if (!car) notFound()

  const relatedCars = await getRelatedCars(car)
  const primaryImage = car.car_images.find((img) => img.is_primary) ?? car.car_images[0]
  const carJsonLd = generateCarJsonLd(car, primaryImage?.image_url)

  const carName = `${car.year} ${car.make} ${car.model}${car.badge ? ` ${car.badge}` : ''}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd) }}
      />

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Header bar */}
        <div className="bg-[#1E3A5F] pt-28 pb-10">
          <div className="container-custom">
            <nav
              className="flex items-center gap-2 text-white/60 text-sm mb-6 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <Link href="/cars" className="hover:text-white transition-colors">Cars</Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-white font-medium truncate max-w-[200px]">{carName}</span>
            </nav>
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-white font-heading font-bold text-3xl md:text-4xl">
                {carName}
              </h1>
              {car.badge_label && <Badge label={car.badge_label} />}
            </div>
          </div>
        </div>

        <div className="container-custom py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Gallery + Specs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <ImageGallery images={car.car_images} carName={carName} />

              {/* Specs */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                <CarSpecs car={car} />
              </div>

              {/* Description */}
              {car.description && (
                <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                  <h3 className="text-lg font-bold text-[#1E293B] mb-3 font-heading">
                    About This Vehicle
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed whitespace-pre-line">
                    {car.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Price + Enquiry */}
            <div className="space-y-5">
              {/* Price Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                {/* Weekly price */}
                <div className="mb-4">
                  <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">
                    From
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-heading text-[#E85D2A]">
                      {formatCurrency(car.price_weekly)}
                    </span>
                    <span className="text-[#64748B]">/week</span>
                  </div>
                  <p className="text-[#94A3B8] text-sm mt-1">
                    ~{formatCurrency(weeklyToMonthly(car.price_weekly))}/month
                  </p>
                </div>

                <div className="border-t border-[#F1F5F9] my-4" />

                {/* Details */}
                <div className="space-y-3 text-sm">
                  {car.upfront_fee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[#64748B]">
                        <DollarSign className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />
                        Upfront Fee
                      </span>
                      <span className="font-semibold text-[#1E293B]">
                        {formatCurrency(car.upfront_fee)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#64748B]">
                      <Clock className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />
                      Minimum Term
                    </span>
                    <span className="font-semibold text-[#1E293B]">
                      {car.minimum_term_weeks}{' '}
                      {car.minimum_term_weeks === 1 ? 'week' : 'weeks'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#64748B]">
                      <Calendar className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />
                      Year
                    </span>
                    <span className="font-semibold text-[#1E293B]">{car.year}</span>
                  </div>
                </div>

                {/* Availability badge */}
                <div
                  className={`mt-4 text-center py-2 rounded-xl text-sm font-semibold ${
                    car.is_available
                      ? 'bg-[#F0FDF4] text-[#22C55E]'
                      : 'bg-[#FEF2F2] text-[#EF4444]'
                  }`}
                >
                  {car.is_available ? '✓ Available Now' : '✗ Not Available'}
                </div>
              </div>

              {/* Enquiry Form */}
              {car.is_available && (
                <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                  <h3 className="text-lg font-bold text-[#1E293B] mb-4 font-heading">
                    Enquire About This Car
                  </h3>
                  <EnquiryForm
                    preselectedCarId={car.id}
                    preselectedCarName={carName}
                    compact
                  />
                </div>
              )}
            </div>
          </div>

          {/* Related Cars */}
          {relatedCars.length > 0 && (
            <section className="mt-16" aria-labelledby="related-heading">
              <h2
                id="related-heading"
                className="text-2xl font-bold text-[#1E293B] font-heading mb-6"
              >
                Similar Vehicles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedCars.map((related) => {
                  const img =
                    related.car_images.find((i) => i.is_primary) ??
                    related.car_images[0]
                  return <CarCard key={related.id} car={related} primaryImage={img} />
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
