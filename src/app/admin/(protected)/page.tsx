import { Car, MessageSquare, Star, TrendingUp, Plus, Eye, Settings } from 'lucide-react'
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
    { label: 'Available Cars', value: stats.totalCars, icon: Car, color: 'bg-[#EFF6FF] text-[#2563EB]', href: '/admin/cars' },
    { label: 'Total Enquiries', value: stats.totalEnquiries, icon: MessageSquare, color: 'bg-[#FFF7ED] text-[#EA580C]', href: '/admin/enquiries' },
    { label: 'New Enquiries', value: stats.newEnquiries, icon: TrendingUp, color: 'bg-[#FEF2F2] text-[#DC2626]', href: '/admin/enquiries' },
    { label: 'Featured Cars', value: stats.featuredCars, icon: Star, color: 'bg-[#F0FDF4] text-[#16A34A]', href: '/admin/cars' },
  ]

  const quickActions = [
    { label: 'Add New Car', href: '/admin/cars/new', icon: Plus, variant: 'primary' },
    { label: 'View Enquiries', href: '/admin/enquiries', icon: Eye, variant: 'secondary' },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings, variant: 'outline' },
    { label: 'View Live Site', href: '/', icon: Eye, variant: 'outline', target: '_blank' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-[#1E293B]">Dashboard</h1>
        <p className="text-[#64748B] text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening with Piston Society.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:shadow-md hover:border-[#1E40AF]/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#64748B] font-semibold">{card.label}</p>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <p className="text-3xl font-bold font-heading text-[#1E293B] group-hover:text-[#1E40AF] transition-colors">
                {card.value}
              </p>
            </Link>
          )
        })}
      </div>

      {/* New Enquiry Alert */}
      {stats.newEnquiries > 0 && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <p className="text-[#1E40AF] font-semibold text-sm">
              You have <strong>{stats.newEnquiries}</strong> new {stats.newEnquiries === 1 ? 'enquiry' : 'enquiries'} waiting for a response.
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
          >
            View now →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
            <h2 className="font-bold font-heading text-[#1E293B]">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-[#2563EB] font-semibold hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentEnquiries.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Name</th>
                    <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Car</th>
                    <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Duration</th>
                    <th className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/enquiries/${enq.id}`} className="font-semibold text-[#1E293B] hover:text-[#2563EB]">
                          {enq.full_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[#64748B] text-xs">{enq.car_name_snapshot ?? '—'}</td>
                      <td className="px-6 py-4 text-[#64748B] text-xs">{enq.rental_duration ?? '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[enq.status as keyof typeof STATUS_STYLES] ?? 'bg-[#F1F5F9] text-[#64748B]'}`}>
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
                <p className="text-sm">No enquiries yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h2 className="font-bold font-heading text-[#1E293B] mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              const isOutline = action.variant === 'outline'
              const isPrimary = action.variant === 'primary'
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  target={action.target as '_blank' | undefined}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isPrimary
                      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                      : isOutline
                      ? 'border border-[#E2E8F0] text-[#64748B] hover:border-[#1E40AF] hover:text-[#1E40AF]'
                      : 'bg-[#1E40AF] text-white hover:bg-[#1E3A8A]'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  {action.label}
                </Link>
              )
            })}
          </div>

          {/* Tips */}
          <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-3">Tips</p>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li className="flex gap-2"><span className="text-[#2563EB]">•</span> Reply to new enquiries within 24h</li>
              <li className="flex gap-2"><span className="text-[#2563EB]">•</span> Keep car photos up to date</li>
              <li className="flex gap-2"><span className="text-[#2563EB]">•</span> Mark unavailable cars so clients see accurate listings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
