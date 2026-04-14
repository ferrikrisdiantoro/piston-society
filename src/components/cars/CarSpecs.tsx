import { CheckCircle2 } from 'lucide-react'
import type { Car } from '@/lib/types/database'

interface CarSpecsProps {
  car: Car
}

const SPEC_LABELS: Record<string, string> = {
  body_type: 'Body Type',
  transmission: 'Transmission',
  fuel_type: 'Fuel Type',
  engine: 'Engine',
  seats: 'Seats',
  drivetrain: 'Drivetrain',
  colour: 'Colour',
  location: 'Location',
  year: 'Year',
}

export function CarSpecs({ car }: CarSpecsProps) {
  const specs: { label: string; value: string | number | null }[] = [
    { label: 'Body Type', value: car.body_type },
    { label: 'Transmission', value: car.transmission },
    { label: 'Fuel Type', value: car.fuel_type },
    { label: 'Engine', value: car.engine },
    { label: 'Seats', value: car.seats ? `${car.seats} seats` : null },
    { label: 'Drivetrain', value: car.drivetrain },
    { label: 'Colour', value: car.colour },
    { label: 'Location', value: car.location },
  ].filter((s) => s.value !== null && s.value !== undefined)

  return (
    <div>
      <h3 className="text-lg font-bold text-[#1E293B] mb-4 font-heading">
        Specifications
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="bg-[#F8FAFC] rounded-xl p-3.5 border border-[#E2E8F0]"
          >
            <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">
              {spec.label}
            </p>
            <p className="text-sm font-semibold text-[#1E293B]">{spec.value}</p>
          </div>
        ))}
      </div>

      {/* What's Included */}
      {car.features_included && car.features_included.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-[#1E293B] mb-4 font-heading">
            What&apos;s Included
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {car.features_included.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2.5 text-sm text-[#1E293B]"
              >
                <CheckCircle2
                  className="h-4.5 w-4.5 text-[#22C55E] flex-shrink-0"
                  aria-hidden="true"
                />
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
