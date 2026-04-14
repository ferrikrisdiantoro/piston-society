import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/format'
import Link from 'next/link'
import { MessageSquare, Eye } from 'lucide-react'

const STATUS_STYLES = {
  new: 'bg-[#EFF6FF] text-[#2563EB]',
  contacted: 'bg-[#FFFBEB] text-[#D97706]',
  closed: 'bg-[#F0FDF4] text-[#16A34A]',
}

async function getEnquiries(status?: string) {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status as 'new' | 'contacted' | 'closed')
    }

    const { data } = await query
    return data ?? []
  } catch {
    return []
  }
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function EnquiriesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const enquiries = await getEnquiries(params.status)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#1E293B]">Enquiries</h1>
          <p className="text-[#64748B] text-sm mt-1">{enquiries.length} total enquiries</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'new', 'contacted', 'closed'].map((s) => (
          <Link
            key={s}
            href={s === 'all' ? '/admin/enquiries' : `/admin/enquiries?status=${s}`}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
              (params.status ?? 'all') === s
                ? 'bg-[#1E3A5F] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#1E3A5F]'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          {enquiries.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Contact</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Age</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Car</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Duration</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#1E293B]">{enq.full_name}</td>
                    <td className="px-5 py-4">
                      <p className="text-[#64748B]">{enq.email}</p>
                      <p className="text-[#94A3B8] text-xs">{enq.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-[#64748B]">{enq.age ?? '—'}</td>
                    <td className="px-5 py-4 text-[#64748B] max-w-[140px] truncate">
                      {enq.car_name_snapshot ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-[#64748B]">{enq.rental_duration ?? '—'}</td>
                    <td className="px-5 py-4 text-[#64748B] whitespace-nowrap">
                      {formatDate(enq.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[enq.status as keyof typeof STATUS_STYLES]}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/enquiries/${enq.id}`}
                        className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors inline-flex"
                        aria-label={`View enquiry from ${enq.full_name}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center text-[#94A3B8]">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" aria-hidden="true" />
              <p>No enquiries found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
