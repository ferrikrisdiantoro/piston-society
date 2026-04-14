import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const enquirySchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  age: z.number().min(18).max(100),
  car_interested: z.string().optional(),
  car_name_snapshot: z.string().optional(),
  rental_duration: z.string().min(1),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = enquirySchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const supabase = createAdminClient()

    const { error } = await supabase.from('enquiries').insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      age: data.age,
      car_interested: data.car_interested || null,
      car_name_snapshot: data.car_name_snapshot || null,
      rental_duration: data.rental_duration,
      message: data.message || null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      throw new Error('Failed to save enquiry')
    }

    // TODO: Trigger email notification via Supabase Edge Function or Resend
    // await sendEnquiryNotification(data)

    return Response.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Enquiry API error:', err)
    return Response.json(
      { error: 'Failed to submit enquiry. Please try again.' },
      { status: 500 }
    )
  }
}
