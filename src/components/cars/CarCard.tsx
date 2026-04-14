import Link from 'next/link'
import Image from 'next/image'
import { Fuel, Gauge, Users, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, weeklyToMonthly } from '@/lib/utils/format'
import type { Car, CarImage } from '@/lib/types/database'

interface CarCardProps {
  car: Car
  primaryImage?: CarImage
}

export function CarCard({ car, primaryImage }: CarCardProps) {
  const imageUrl =
    primaryImage?.image_url ??
    `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80`

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-[#1E3A5F]/20 transition-all duration-300 group card-hover flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badge */}
        {car.badge_label && (
          <div className="absolute top-3 left-3 z-10">
            <Badge label={car.badge_label} />
          </div>
        )}
        {/* Availability */}
        {!car.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-white/90 text-[#1E293B] font-bold px-4 py-2 rounded-lg text-sm">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-heading font-bold text-[#1E293B] text-lg leading-snug mb-1 group-hover:text-[#1E3A5F] transition-colors">
          {car.year} {car.make} {car.model}
          {car.badge && (
            <span className="text-[#64748B] font-normal"> {car.badge}</span>
          )}
        </h3>

        {/* Location */}
        {car.location && (
          <div className="flex items-center gap-1 text-[#94A3B8] text-xs mb-3">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {car.location}
          </div>
        )}

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-[#64748B] mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            {car.transmission}
          </span>
          <span className="text-[#CBD5E1]" aria-hidden="true">•</span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            {car.fuel_type}
          </span>
          <span className="text-[#CBD5E1]" aria-hidden="true">•</span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            {car.seats} seats
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold font-heading text-[#E85D2A]">
              {formatCurrency(car.price_weekly)}
            </span>
            <span className="text-[#64748B] text-sm">/week</span>
          </div>
          <p className="text-[#94A3B8] text-xs mb-4">
            ~{formatCurrency(weeklyToMonthly(car.price_weekly))}/month
          </p>

          {/* CTA */}
          <Link href={`/cars/${car.id}`} className="block">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              disabled={!car.is_available}
              className="text-sm"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
