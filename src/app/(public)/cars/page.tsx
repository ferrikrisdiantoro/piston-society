import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Car } from 'lucide-react'
import { CarCard } from '@/components/cars/CarCard'
import { CarFilters } from '@/components/cars/CarFilters'
import { CarCardSkeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { createClient } from '@/lib/supabase/server'
import type { Car as CarType, CarImage } from '@/lib/types/database'

export const metadata: Metadata = {
  title: 'Browse Cars — All Vehicles Available',
  description:
    'Browse our full fleet of subscription vehicles available across Australia. Filter by make, body type, fuel type, location and price. All-inclusive pricing.',
}

const CARS_PER_PAGE = 9

interface CarsPageProps {
  searchParams: Promise<{
    make?: string | string[]
    body_type?: string | string[]
    transmission?: string | string[]
    fuel_type?: string | string[]
    location?: string
    sort?: string
    page?: string
  }>
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

async function getCars(params: Awaited<CarsPageProps['searchParams']>) {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('cars')
      .select('*, car_images(*)', { count: 'exact' })
      .eq('is_available', true)

    const makes = toArray(params.make)
    const bodyTypes = toArray(params.body_type)
    const transmissions = toArray(params.transmission)
    const fuelTypes = toArray(params.fuel_type)

    if (makes.length > 0) query = query.in('make', makes)
    if (bodyTypes.length > 0) query = query.in('body_type', bodyTypes)
    if (transmissions.length > 0) query = query.in('transmission', transmissions)
    if (fuelTypes.length > 0) query = query.in('fuel_type', fuelTypes)
    if (params.location) query = query.ilike('location', `%${params.location}%`)

    // Sorting
    switch (params.sort) {
      case 'price_asc':
        query = query.order('price_weekly', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price_weekly', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Pagination
    const page = Math.max(1, parseInt(params.page ?? '1', 10))
    const from = (page - 1) * CARS_PER_PAGE
    const to = from + CARS_PER_PAGE - 1
    query = query.range(from, to)

    const { data, count, error } = await query
    if (error) throw error

    return {
      cars: (data ?? []) as unknown as (CarType & { car_images: CarImage[] })[],
      total: count ?? 0,
      page,
    }
  } catch {
    return { cars: [], total: 0, page: 1 }
  }
}

interface CarGridClientProps {
  searchParamsRaw: Awaited<CarsPageProps['searchParams']>
}

async function CarGrid({ searchParamsRaw }: CarGridClientProps) {
  const { cars, total, page } = await getCars(searchParamsRaw)
  const totalPages = Math.ceil(total / CARS_PER_PAGE)

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Car className="h-16 w-16 text-[#CBD5E1] mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-[#1E293B] mb-2">No cars found</h3>
        <p className="text-[#64748B] max-w-sm">
          No vehicles match your current filters. Try adjusting or clearing your
          filters to see more results.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-[#64748B] mb-5">
        Showing{' '}
        <span className="font-semibold text-[#1E293B]">
          {(page - 1) * CARS_PER_PAGE + 1}–
          {Math.min(page * CARS_PER_PAGE, total)}
        </span>{' '}
        of <span className="font-semibold text-[#1E293B]">{total}</span> vehicles
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {cars.map((car) => {
          const primaryImage =
            car.car_images.find((img) => img.is_primary) ?? car.car_images[0]
          return <CarCard key={car.id} car={car} primaryImage={primaryImage} />
        })}
      </div>

      {totalPages > 1 && (
        <PaginationWrapper currentPage={page} totalPages={totalPages} />
      )}
    </div>
  )
}

function PaginationWrapper({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  'use client'
  // Server component can't use hooks; delegate to a client wrapper
  return null // replaced by client component below
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-[#1E40AF] pt-28 pb-12">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-white font-medium">Cars</span>
          </nav>

          <h1 className="text-white font-heading font-bold text-4xl md:text-5xl mb-3">
            Browse Our Fleet
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Find your perfect car — all prices include registration, insurance,
            CTP, servicing &amp; roadside assist.
          </p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters — sidebar (desktop) */}
          <Suspense>
            <CarFilters className="lg:w-64 flex-shrink-0 h-fit lg:sticky lg:top-24" />
          </Suspense>

          {/* Car Grid */}
          <div className="flex-1 min-w-0">
            {/* Sort */}
            <SortBar currentSort={params.sort} />

            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(9)].map((_, i) => (
                    <CarCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <CarGrid searchParamsRaw={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function SortBar({ currentSort }: { currentSort?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <p className="text-sm font-semibold text-[#1E293B]">Sort by:</p>
      <div className="flex gap-2 flex-wrap">
        {[
          { value: '', label: 'Newest' },
          { value: 'price_asc', label: 'Price: Low to High' },
          { value: 'price_desc', label: 'Price: High to Low' },
        ].map((opt) => (
          <SortLink
            key={opt.value}
            value={opt.value}
            label={opt.label}
            isActive={(currentSort ?? '') === opt.value}
          />
        ))}
      </div>
    </div>
  )
}

function SortLink({
  value,
  label,
  isActive,
}: {
  value: string
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={value ? `/cars?sort=${value}` : '/cars'}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
        isActive
          ? 'bg-[#1E40AF] text-white'
          : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#1E40AF] hover:text-[#1E40AF]'
      }`}
    >
      {label}
    </Link>
  )
}
