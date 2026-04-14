import { Car, MessageSquare, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function getDashboardStats() {
  try {
    const supabase = await createClient()

    const [carsRes, enquiriesRes, featuredRes, newEnquiriesRes] = await Promise.all([
      supabase.from('cars').select('id', { count: 'exact', head: true }).eq('is_available', true),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }),
      supabase.from('cars').select('id', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    ])

    return {
      totalCars: carsRes.count ?? 0,
      totalEnquiries: enquiriesRes.count ?? 0,
      featuredCars: featuredRes.count ?? 0,
      newEnquiries: newEnquiriesRes.count ?? 0,
    }
  } catch {
    return { totalCars: 0, totalEnquiries: 0, featuredCars: 0, newEnquiries: 0 }
  }
}

async function getRecentEnquiries() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('enquiries')
      .select('id, full_name, email, car_name_snapshot, rental_duration, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_STYLES = {
  new: 'bg-[#EFF6FF] text-[#2563EB]',
  contacted: 'bg-[#FFFBEB] text-[#D97706]',
  closed: 'bg-[#F0FDF4] text-[#16A34A]',
}

export default async function AdminDashboard() {
  const [stats, recentEnquiries] = await Promise.all([
    getDashboardStats(),
    getRecentEnquiries(),
  ])

  const statCards = [
    {
      label: 'Available Cars',
      value: stats.totalCars,
      icon: Car,
      color: 'bg-[#EFF6FF] text-[#2563EB]',
      href: '/admin/cars',
    },
    {
      label: 'Total Enquiries',
      value: stats.totalEnquiries,
      icon: MessageSquare,
      color: 'bg-[#FFF7ED] text-[#EA580C]',
      href: '/admin/enquiries',
    },
    {
      label: 'New Enquiries',
      value: stats.newEnquiries,
      icon: TrendingUp,
      color: 'bg-[#FEF2F2] text-[#DC2626]',
      href: '/admin/enquiries',
    },
    {
      label: 'Featured Cars',
      value: stats.featuredCars,
      icon: Star,
      color: 'bg-[#F0FDF4] text-[#16A34A]',
      href: '/admin/cars',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-[#1E293B]">Dashboard</h1>
        <p className="text-[#64748B] text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#64748B] font-semibold">{card.label}</p>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <p className="text-3xl font-bold font-heading text-[#1E293B]">
                {card.value}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
          <h2 className="font-bold font-heading text-[#1E293B]">Recent Enquiries</h2>
          <Link
            href="/admin/enquiries"
            className="text-sm text-[#E85D2A] font-semibold hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentEnquiries.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Car</th>
                  <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Duration</th>
                  <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#1E293B]">{enq.full_name}</td>
                    <td className="px-6 py-4 text-[#64748B]">{enq.email}</td>
                    <td className="px-6 py-4 text-[#64748B]">{enq.car_name_snapshot ?? '—'}</td>
                    <td className="px-6 py-4 text-[#64748B]">{enq.rental_duration ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[enq.status as keyof typeof STATUS_STYLES]}`}>
                        {enq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-[#94A3B8]">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" aria-hidden="true" />
              <p>No enquiries yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
