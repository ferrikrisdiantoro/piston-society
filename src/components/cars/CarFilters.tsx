'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

const MAKES = ['Toyota', 'Mazda', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Tesla', 'Mitsubishi', 'Honda']
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Ute', 'Van']
const TRANSMISSIONS = ['Automatic', 'Manual']
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const LOCATIONS = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']

interface FilterCheckboxProps {
  label: string
  paramKey: string
  value: string
  checked: boolean
  onChange: (key: string, value: string, checked: boolean) => void
}

function FilterCheckbox({ label, paramKey, value, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] accent-[#2563EB] cursor-pointer"
        checked={checked}
        onChange={(e) => onChange(paramKey, value, e.target.checked)}
      />
      <span className="text-sm text-[#475569] group-hover:text-[#1E293B] transition-colors">
        {label}
      </span>
    </label>
  )
}

interface CarFiltersProps {
  className?: string
}

export function CarFilters({ className }: CarFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const getMultiValues = useCallback(
    (key: string) => searchParams.getAll(key),
    [searchParams]
  )

  const updateFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString())
      const existing = params.getAll(key)

      if (checked) {
        if (!existing.includes(value)) {
          params.append(key, value)
        }
      } else {
        const newValues = existing.filter((v) => v !== value)
        params.delete(key)
        newValues.forEach((v) => params.append(key, v))
      }

      params.delete('page') // reset to page 1
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [searchParams, pathname, router]
  )

  const updateSingle = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [searchParams, pathname, router]
  )

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push(pathname)
    })
  }, [pathname, router])

  const hasFilters = searchParams.toString().length > 0

  const selectedMakes = getMultiValues('make')
  const selectedBodyTypes = getMultiValues('body_type')
  const selectedTransmissions = getMultiValues('transmission')
  const selectedFuelTypes = getMultiValues('fuel_type')
  const selectedLocation = searchParams.get('location') ?? ''

  return (
    <aside
      className={cn('bg-white rounded-2xl border border-[#E2E8F0] p-5', className)}
      aria-label="Car filters"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-[#1E293B] font-bold">
          <SlidersHorizontal className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          Filters
          {isPending && (
            <span className="w-3 h-3 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" aria-hidden="true" />
          )}
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Make */}
        <div>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Make</p>
          <div className="space-y-2.5">
            {MAKES.map((make) => (
              <FilterCheckbox
                key={make}
                label={make}
                paramKey="make"
                value={make}
                checked={selectedMakes.includes(make)}
                onChange={updateFilter}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[#F1F5F9]" />

        {/* Body Type */}
        <div>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Body Type</p>
          <div className="space-y-2.5">
            {BODY_TYPES.map((type) => (
              <FilterCheckbox
                key={type}
                label={type}
                paramKey="body_type"
                value={type}
                checked={selectedBodyTypes.includes(type)}
                onChange={updateFilter}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[#F1F5F9]" />

        {/* Transmission */}
        <div>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Transmission</p>
          <div className="space-y-2.5">
            {TRANSMISSIONS.map((trans) => (
              <FilterCheckbox
                key={trans}
                label={trans}
                paramKey="transmission"
                value={trans}
                checked={selectedTransmissions.includes(trans)}
                onChange={updateFilter}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[#F1F5F9]" />

        {/* Fuel Type */}
        <div>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Fuel Type</p>
          <div className="space-y-2.5">
            {FUEL_TYPES.map((fuel) => (
              <FilterCheckbox
                key={fuel}
                label={fuel}
                paramKey="fuel_type"
                value={fuel}
                checked={selectedFuelTypes.includes(fuel)}
                onChange={updateFilter}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[#F1F5F9]" />

        {/* Location */}
        <div>
          <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Location</p>
          <div className="space-y-2.5">
            {LOCATIONS.map((loc) => (
              <label key={loc} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="location"
                  className="w-4 h-4 accent-[#2563EB] cursor-pointer"
                  checked={selectedLocation === loc}
                  onChange={() => updateSingle('location', selectedLocation === loc ? '' : loc)}
                />
                <span className="text-sm text-[#475569] group-hover:text-[#1E293B] transition-colors">
                  {loc}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
