'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle2, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import type { Car } from '@/lib/types/database'

const schema = z.object({
  full_name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(8, 'Please enter a valid phone number')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Please enter a valid phone number'),
  age: z
    .number()
    .min(18, 'You must be at least 18 years old')
    .max(100, 'Please enter a valid age'),
  car_interested: z.string().optional(),
  rental_duration: z.string().min(1, 'Please select a rental duration'),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const DURATION_OPTIONS = [
  { value: '1 Week', label: '1 Week' },
  { value: '2 Weeks', label: '2 Weeks' },
  { value: '1 Month', label: '1 Month' },
  { value: '3 Months', label: '3 Months' },
  { value: '6 Months', label: '6 Months' },
  { value: '12 Months', label: '12 Months' },
  { value: 'Other', label: 'Other' },
]

interface EnquiryFormProps {
  preselectedCarId?: string
  preselectedCarName?: string
  compact?: boolean
}

export function EnquiryForm({
  preselectedCarId,
  preselectedCarName,
  compact = false,
}: EnquiryFormProps) {
  const [cars, setCars] = useState<Pick<Car, 'id' | 'make' | 'model' | 'year'>[]>([])
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      car_interested: preselectedCarId ?? '',
      rental_duration: '',
    },
  })

  // Load available cars for the dropdown
  useEffect(() => {
    async function fetchCars() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('cars')
          .select('id, make, model, year')
          .eq('is_available', true)
          .order('make', { ascending: true })
        setCars(data ?? [])
      } catch {
        // Cars list is optional; silently fail
      }
    }
    fetchCars()
  }, [])

  const onSubmit = async (data: FormValues) => {
    try {
      const selectedCar = cars.find((c) => c.id === data.car_interested)
      const carNameSnapshot =
        preselectedCarName ??
        (selectedCar
          ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`
          : undefined)

      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          car_name_snapshot: carNameSnapshot,
        }),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(result.error ?? 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to submit. Please try again.'
      )
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 px-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-[#22C55E]" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-[#1E293B] font-heading mb-2">
          Enquiry Received!
        </h3>
        <p className="text-[#64748B] text-sm leading-relaxed">
          Thank you! Our team will contact you within{' '}
          <strong className="text-[#1E293B]">24 hours</strong> to discuss your car
          subscription.
        </p>
      </div>
    )
  }

  const carOptions = [
    { value: '', label: 'Select a car (optional)' },
    ...cars.map((c) => ({
      value: c.id,
      label: `${c.year} ${c.make} ${c.model}`,
    })),
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {/* Full Name */}
        <Input
          label="Full Name"
          placeholder="John Smith"
          required
          {...register('full_name')}
          error={errors.full_name?.message}
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          required
          {...register('email')}
          error={errors.email?.message}
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="04XX XXX XXX"
          required
          {...register('phone')}
          error={errors.phone?.message}
        />

        {/* Age */}
        <Input
          label="Age"
          type="number"
          placeholder="25"
          required
          min={18}
          max={100}
          {...register('age', { valueAsNumber: true })}
          error={errors.age?.message}
        />

        {/* Car Interested — full width */}
        <div className={compact ? '' : 'md:col-span-2'}>
          <Select
            label="Car Interested"
            options={carOptions}
            defaultValue={preselectedCarId ?? ''}
            {...register('car_interested')}
            error={errors.car_interested?.message}
          />
        </div>

        {/* Duration */}
        <div className={compact ? '' : 'md:col-span-2'}>
          <Select
            label="Rental Duration"
            placeholder="Select duration"
            options={DURATION_OPTIONS}
            required
            {...register('rental_duration')}
            error={errors.rental_duration?.message}
          />
        </div>

        {/* Message — full width */}
        <div className={compact ? '' : 'md:col-span-2'}>
          <Textarea
            label="Message"
            placeholder="Any questions or specific requirements? Let us know..."
            rows={compact ? 3 : 4}
            {...register('message')}
            error={errors.message?.message}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size={compact ? 'md' : 'lg'}
        fullWidth
        loading={isSubmitting}
        className="mt-5"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? 'Sending…' : 'Send Enquiry'}
      </Button>

      <p className="text-xs text-[#94A3B8] text-center mt-3">
        We respect your privacy. Your details are never shared with third parties.
      </p>
    </form>
  )
}
