'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, User, Phone, Mail, Car, Clock, Calendar, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/format'
import { toast } from 'sonner'
import type { Enquiry } from '@/lib/types/database'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
]

export default function EnquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('enquiries').select('*').eq('id', id).single()
      if (data) {
        setEnquiry(data)
        setStatus(data.status)
      }
    }
    load()
  }, [id])

  async function handleStatusUpdate() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('enquiries')
        .update({ status: status as Enquiry['status'] })
        .eq('id', id)

      if (error) throw error
      toast.success('Status updated successfully')
      router.refresh()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  if (!enquiry) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/admin/enquiries"
        className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#1E293B] text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to Enquiries
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#1E293B]">
            Enquiry from {enquiry.full_name}
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Submitted on {formatDate(enquiry.created_at)}
          </p>
        </div>

        <div className="flex items-end gap-3">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="min-w-[140px]"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleStatusUpdate}
            loading={loading}
          >
            Update Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] space-y-4">
          <h2 className="font-bold font-heading text-[#1E293B]">Contact Information</h2>
          {[
            { icon: User, label: 'Full Name', value: enquiry.full_name },
            { icon: Mail, label: 'Email', value: enquiry.email, href: `mailto:${enquiry.email}` },
            { icon: Phone, label: 'Phone', value: enquiry.phone, href: `tel:${enquiry.phone}` },
            { icon: Calendar, label: 'Age', value: enquiry.age ? `${enquiry.age} years` : '—' },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex gap-3">
              <Icon className="h-4 w-4 text-[#94A3B8] mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide">{label}</p>
                {href ? (
                  <a href={href} className="font-semibold text-[#2563EB] hover:underline text-sm">{value}</a>
                ) : (
                  <p className="font-semibold text-[#1E293B] text-sm">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enquiry Details */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] space-y-4">
          <h2 className="font-bold font-heading text-[#1E293B]">Enquiry Details</h2>
          {[
            { icon: Car, label: 'Car Interested', value: enquiry.car_name_snapshot ?? '—' },
            { icon: Clock, label: 'Rental Duration', value: enquiry.rental_duration ?? '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <Icon className="h-4 w-4 text-[#94A3B8] mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide">{label}</p>
                <p className="font-semibold text-[#1E293B] text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        {enquiry.message && (
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />
              <h2 className="font-bold font-heading text-[#1E293B]">Message</h2>
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed whitespace-pre-wrap bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
              {enquiry.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
