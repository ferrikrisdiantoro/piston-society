import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CarSpecs } from '@/components/cars/CarSpecs'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, weeklyToMonthly } from '@/lib/utils/format'
import type { Car, CarImage } from '@/lib/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: car } = await supabase.from('cars').select('make, model, year').eq('id', id).single()
  if (!car) return { title: 'Car Not Found' }
  const carName = `${car.year ? `${car.year} ` : ''}${car.make} ${car.model}`
  return {
    title: `${carName} — Subscription`,
    description: `Subscribe to a ${carName}. All-inclusive weekly pricing — insurance, registration, and servicing included.`,
  }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('cars')
    .select('*, car_images(*)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const car = data as unknown as Car & { car_images: CarImage[] }
  const images = (car.car_images ?? []).sort((a, b) => a.display_order - b.display_order)
  const primaryImage = images.find((i) => i.is_primary) ?? images[0]
  const otherImages = images.filter((i) => i !== primaryImage).slice(0, 4)

  const FALLBACK = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8F0] pt-24 pb-4">
        <div className="container-custom">
          <Link href="/cars" className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1E40AF] transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Cars
          </Link>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Images + Specs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div>
              {car.badge_label && (
                <div className="mb-2">
                  <Badge label={car.badge_label} />
                </div>
              )}
              <h1 className="text-3xl font-bold font-heading text-[#1E293B]">
                {car.year ? `${car.year} ` : ''}{car.make} {car.model}
                {car.badge && <span className="text-[#64748B] font-normal"> {car.badge}</span>}
              </h1>
              {car.location && (
                <div className="flex items-center gap-1.5 text-[#64748B] text-sm mt-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {car.location}
                </div>
              )}
            </div>

            {/* Primary image */}
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#F1F5F9]">
              <Image
                src={primaryImage?.image_url ?? FALLBACK}
                alt={`${car.year ? `${car.year} ` : ''}${car.make} ${car.model}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {!car.is_available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white/90 text-[#1E293B] font-bold px-6 py-3 rounded-xl text-base">
                    Not Available
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {otherImages.map((img) => (
                  <div key={img.id} className="relative h-20 rounded-xl overflow-hidden bg-[#F1F5F9]">
                    <Image
                      src={img.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {car.description && (
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                <h2 className="font-bold font-heading text-[#1E293B] text-lg mb-3">About This Car</h2>
                <p className="text-[#64748B] leading-relaxed text-sm">{car.description}</p>
              </div>
            )}

            {/* Specs */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
              <CarSpecs car={car} />
            </div>
          </div>

          {/* Right: Pricing + Enquiry Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Pricing card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
              <p className="text-sm text-[#64748B] mb-1">Weekly Subscription</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold font-heading text-[#2563EB]">
                  {formatCurrency(car.price_weekly)}
                </span>
                <span className="text-[#64748B]">/week</span>
              </div>
              <p className="text-sm text-[#94A3B8] mb-4">
                ~{formatCurrency(weeklyToMonthly(car.price_weekly))}/month
              </p>

              {car.upfront_fee > 0 && (
                <div className="flex justify-between text-sm py-3 border-t border-[#F1F5F9]">
                  <span className="text-[#64748B]">Upfront fee</span>
                  <span className="font-semibold text-[#1E293B]">{formatCurrency(car.upfront_fee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm py-3 border-t border-[#F1F5F9]">
                <span className="text-[#64748B]">Minimum term</span>
                <span className="font-semibold text-[#1E293B]">{car.minimum_term_weeks} weeks</span>
              </div>

              {/* What's included */}
              <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">All Included</p>
                {['Insurance', 'Registration', 'Servicing', 'Roadside Assist'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[#475569] mb-2">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E] flex-shrink-0" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Enquiry form */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
              <h2 className="font-bold font-heading text-[#1E293B] text-lg mb-1">Enquire About This Car</h2>
              <p className="text-sm text-[#64748B] mb-5">
                Fill in your details and we&apos;ll get back to you within 24 hours.
              </p>
              {car.is_available ? (
                <EnquiryForm
                  preselectedCarId={car.id}
                  preselectedCarName={`${car.year ? `${car.year} ` : ''}${car.make} ${car.model}${car.badge ? ` ${car.badge}` : ''}`}
                />
              ) : (
                <div className="text-center py-6">
                  <p className="text-[#64748B] mb-4">This car is currently unavailable.</p>
                  <Link href="/cars">
                    <Button variant="secondary" size="md">Browse Other Cars</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
