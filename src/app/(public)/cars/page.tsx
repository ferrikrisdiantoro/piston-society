import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { CarCard } from '@/components/cars/CarCard'
import { CarFilters } from '@/components/cars/CarFilters'
import type { Car, CarImage } from '@/lib/types/database'

export const metadata: Metadata = {
  title: 'Browse Cars — Car Subscription Fleet',
  description:
    'Browse our full fleet of subscription cars in Australia. Filter by make, body type, fuel, and location. All-inclusive weekly pricing — no hidden fees.',
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getArray(val: string | string[] | undefined): string[] {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

async function CarGrid({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const supabase = await createClient()

  let query = supabase
    .from('cars')
    .select('*, car_images(*)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })

  const makes = getArray(searchParams.make)
  const bodyTypes = getArray(searchParams.body_type)
  const transmissions = getArray(searchParams.transmission)
  const fuelTypes = getArray(searchParams.fuel_type)
  const location = typeof searchParams.location === 'string' ? searchParams.location : undefined

  if (makes.length) query = query.in('make', makes)
  if (bodyTypes.length) query = query.in('body_type', bodyTypes)
  if (transmissions.length) query = query.in('transmission', transmissions)
  if (fuelTypes.length) query = query.in('fuel_type', fuelTypes)
  if (location) query = query.ilike('location', `%${location}%`)

  const { data: cars } = await query

  if (!cars || cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2.5 2.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 6l2 6h4l-2-6h-4z" />
          </svg>
        </div>
        <h3 className="font-bold text-[#1E293B] text-lg mb-2">No cars found</h3>
        <p className="text-[#64748B] text-sm max-w-xs">
          Try adjusting your filters or clearing them to see more vehicles.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {cars.map((car) => {
        const images: CarImage[] = ((car as unknown) as Car & { car_images: CarImage[] }).car_images ?? []
        const primary = images.find((i) => i.is_primary) ?? images[0]
        return <CarCard key={car.id} car={car} primaryImage={primary} />
      })}
    </div>
  )
}

export default async function CarsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: makesData } = await supabase
    .from('cars')
    .select('make')
    .eq('is_available', true)
  const availableMakes = [...new Set((makesData ?? []).map((r) => r.make))].sort()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-[#1E40AF] pt-28 pb-12">
        <div className="container-custom">
          <p className="text-[#93C5FD] font-semibold text-sm tracking-widest uppercase mb-3">Our Fleet</p>
          <h1 className="text-white font-heading font-bold text-4xl md:text-5xl mb-3">
            Browse Available Cars
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            All-inclusive subscription pricing. Pick your car and we handle the rest.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Suspense>
              <CarFilters className="sticky top-24" availableMakes={availableMakes} />
            </Suspense>
          </div>

          {/* Car grid */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-[#E2E8F0]" />
                  ))}
                </div>
              }
            >
              <CarGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
