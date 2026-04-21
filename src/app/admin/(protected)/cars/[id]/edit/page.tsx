'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'

const carSchema = z.object({
  make: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  year: z.number().min(2000).max(2030).optional().nullable(),
  badge: z.string().optional(),
  body_type: z.string().min(1, 'Required'),
  transmission: z.string().min(1, 'Required'),
  fuel_type: z.string().min(1, 'Required'),
  engine: z.string().optional(),
  seats: z.number().min(1).max(12),
  drivetrain: z.string().optional(),
  colour: z.string().optional(),
  location: z.string().optional(),
  price_weekly: z.number().min(1, 'Required'),
  upfront_fee: z.number().min(0),
  minimum_term_weeks: z.number().min(1),
  description: z.string().optional(),
  badge_label: z.string().optional(),
  is_featured: z.boolean(),
  is_available: z.boolean(),
})

type CarFormValues = z.infer<typeof carSchema>

const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Ute', 'Van'].map(v => ({ value: v, label: v }))
const TRANSMISSIONS = ['Automatic', 'Manual'].map(v => ({ value: v, label: v }))
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(v => ({ value: v, label: v }))
const DRIVETRAINS = ['FWD', 'RWD', 'AWD'].map(v => ({ value: v, label: v }))
const LOCATIONS = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'].map(v => ({ value: v, label: v }))
const BADGE_LABELS = [
  { value: '', label: 'None' },
  { value: 'New', label: 'New' },
  { value: 'Popular', label: 'Popular' },
  { value: 'Best Value', label: 'Best Value' },
]
const DEFAULT_FEATURES = ['Registration', 'Insurance', 'CTP', 'Servicing', 'Maintenance', 'Roadside Assist']

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditCarPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [features, setFeatures] = useState<string[]>(DEFAULT_FEATURES)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
  })

  useEffect(() => {
    async function fetchCar() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      reset({
        make: data.make,
        model: data.model,
        year: data.year ?? undefined,
        badge: data.badge ?? '',
        body_type: data.body_type,
        transmission: data.transmission,
        fuel_type: data.fuel_type,
        engine: data.engine ?? '',
        seats: data.seats,
        drivetrain: data.drivetrain ?? '',
        colour: data.colour ?? '',
        location: data.location ?? '',
        price_weekly: data.price_weekly,
        upfront_fee: data.upfront_fee,
        minimum_term_weeks: data.minimum_term_weeks,
        description: data.description ?? '',
        badge_label: data.badge_label ?? '',
        is_featured: data.is_featured,
        is_available: data.is_available,
      })

      setFeatures(data.features_included ?? DEFAULT_FEATURES)
      setLoading(false)
    }

    fetchCar()
  }, [id, reset])

  const onSubmit = async (data: CarFormValues) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('cars')
        .update({
          ...data,
          year: data.year ?? null,
          badge: data.badge || null,
          engine: data.engine || null,
          drivetrain: data.drivetrain || null,
          colour: data.colour || null,
          location: data.location || null,
          badge_label: data.badge_label || null,
          description: data.description || null,
          features_included: features,
          price_monthly: data.price_weekly * 4.33,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      toast.success('Car updated successfully!')
      router.push('/admin/cars')
    } catch {
      toast.error('Failed to update car. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-[#94A3B8]">Loading car details…</div>
    )
  }

  if (notFound) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#1E293B] font-semibold mb-4">Car not found</p>
        <Link href="/admin/cars">
          <Button variant="outline" size="sm">Back to Cars</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/admin/cars"
        className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#1E293B] text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to Cars
      </Link>

      <h1 className="text-2xl font-bold font-heading text-[#1E293B] mb-6">Edit Car</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Vehicle Details */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
            <h2 className="font-bold font-heading text-[#1E293B] mb-5">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Make" placeholder="Toyota" required {...register('make')} error={errors.make?.message} />
              <Input label="Model" placeholder="Corolla" required {...register('model')} error={errors.model?.message} />
              <Input label="Year" type="number" placeholder="2024" {...register('year', { valueAsNumber: true, setValueAs: v => v === '' || isNaN(v) ? null : Number(v) })} error={errors.year?.message} />
              <Input label="Badge / Variant" placeholder="Ascent Sport" {...register('badge')} />
              <Select label="Body Type" required options={BODY_TYPES} placeholder="Select..." {...register('body_type')} error={errors.body_type?.message} />
              <Select label="Transmission" required options={TRANSMISSIONS} placeholder="Select..." {...register('transmission')} error={errors.transmission?.message} />
              <Select label="Fuel Type" required options={FUEL_TYPES} placeholder="Select..." {...register('fuel_type')} error={errors.fuel_type?.message} />
              <Input label="Engine" placeholder="2.0L 4-Cylinder" {...register('engine')} />
              <Input label="Seats" type="number" required {...register('seats', { valueAsNumber: true })} error={errors.seats?.message} />
              <Select label="Drivetrain" options={[{ value: '', label: 'Not specified' }, ...DRIVETRAINS]} {...register('drivetrain')} />
              <Input label="Colour" placeholder="Pearl White" {...register('colour')} />
              <Select label="Location" options={[{ value: '', label: 'Not specified' }, ...LOCATIONS]} {...register('location')} />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
            <h2 className="font-bold font-heading text-[#1E293B] mb-5">Pricing & Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Weekly Price (AUD)" type="number" required placeholder="179" {...register('price_weekly', { valueAsNumber: true })} error={errors.price_weekly?.message} />
              <Input label="Upfront Fee (AUD)" type="number" placeholder="0" {...register('upfront_fee', { valueAsNumber: true })} />
              <Input label="Minimum Term (weeks)" type="number" placeholder="1" {...register('minimum_term_weeks', { valueAsNumber: true })} />
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
            <h2 className="font-bold font-heading text-[#1E293B] mb-5">Features Included</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {DEFAULT_FEATURES.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[#2563EB] w-4 h-4"
                    checked={features.includes(f)}
                    onChange={(e) => {
                      setFeatures(prev =>
                        e.target.checked ? [...prev, f] : prev.filter(x => x !== f)
                      )
                    }}
                  />
                  <span className="text-sm text-[#475569]">{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
            <h2 className="font-bold font-heading text-[#1E293B] mb-5">Display Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Badge Label" options={BADGE_LABELS} {...register('badge_label')} />
              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#2563EB] w-4 h-4" {...register('is_featured')} />
                  <span className="text-sm font-semibold text-[#1E293B]">Featured on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#2563EB] w-4 h-4" {...register('is_available')} />
                  <span className="text-sm font-semibold text-[#1E293B]">Available</span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <Textarea
                label="Description"
                placeholder="Write a description of this vehicle..."
                rows={4}
                {...register('description')}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link href="/admin/cars">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
