import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CarCard } from '@/components/cars/CarCard'
import { CarCardSkeleton } from '@/components/ui/Skeleton'
import { createClient } from '@/lib/supabase/server'

async function getFeaturedCars() {
  try {
    const supabase = await createClient()
    const { data: cars, error } = await supabase
      .from('cars')
      .select('*, car_images(*)')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) throw error
    return cars ?? []
  } catch {
    return []
  }
}

export async function FeaturedCars() {
  const cars = await getFeaturedCars()

  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="featured-cars-heading"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
              Featured Vehicles
            </p>
            <h2 id="featured-cars-heading" className="text-[#1E293B]">
              Our <span className="text-[#2563EB]">Top Picks</span> for You
            </h2>
          </div>
          <Link href="/cars" className="flex-shrink-0">
            <Button variant="ghost" size="sm" className="text-[#1E40AF] hover:bg-[#1E40AF]/5">
              View All Cars
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(cars as unknown as import('@/lib/types/database').CarWithImages[]).map((car) => {
              const primaryImage = car.car_images.find((img) => img.is_primary) ?? car.car_images[0]
              return (
                <CarCard key={car.id} car={car} primaryImage={primaryImage} />
              )
            })}
          </div>
        ) : (
          /* Skeleton fallback while DB is not connected */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CarCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link href="/cars">
            <Button variant="primary" size="lg">
              Browse Full Fleet
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
