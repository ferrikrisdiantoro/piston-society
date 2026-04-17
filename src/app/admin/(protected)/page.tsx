import { Car, MessageSquare, Star, TrendingUp, Plus, Eye, Settings } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EnquiriesTrendChart } from '@/components/admin/charts/EnquiriesTrendChart'
import { StatusDonutChart } from '@/components/admin/charts/StatusDonutChart'
import { TopCarsChart } from '@/components/admin/charts/TopCarsChart'
import { DurationChart } from '@/components/admin/charts/DurationChart'

const DURATION_ORDER = ['1 Week', '2 Weeks', '1 Month', '3 Months', '6 Months', '12 Months', 'Other']

async function getDashboardData() {
  try {
    const supabase = await createClient()

    const [carsRes, featuredRes, enquiriesRes] = await Promise.all([
      supabase.from('cars').select('id', { count: 'exact', head: true }).eq('is_available', true),
      supabase.from('cars').select('id', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('enquiries').select('id, status, car_name_snapshot, rental_duration, created_at').order('created_at', { ascending: false }),
    ])

    const enquiries = enquiriesRes.data ?? []
    const totalEnquiries = enquiries.length
    const newEnquiries = enquiries.filter((e) => e.status === 'new').length

    // --- Trend: last 30 days ---
    const now = new Date()
    const trendMap: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      trendMap[d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })] = 0
    }
    enquiries.forEach((e) => {
      const d = new Date(e.created_at)
      const key = d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })
      if (key in trendMap) trendMap[key]++
    })
    const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, count }))

    // --- Status donut ---
    const statusCount: Record<string, number> = { new: 0, contacted: 0, closed: 0 }
    enquiries.forEach((e) => { if (e.status in statusCount) statusCount[e.status]++ })
    const statusData = [
      { name: 'New', value: statusCount.new, color: '#2563EB' },
      { name: 'Contacted', value: statusCount.contacted, color: '#F59E0B' },
      { name: 'Closed', value: statusCount.closed, color: '#22C55E' },
    ]

    // --- Top cars (top 5) ---
    const carCount: Record<string, number> = {}
    enquiries.forEach((e) => {
      if (e.car_name_snapshot) carCount[e.car_name_snapshot] = (carCount[e.car_name_snapshot] ?? 0) + 1
    })
    const topCarsData = Object.entries(carCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([car, count]) => ({ car: car.replace(/^\d{4}\s/, ''), count }))

    // --- Duration distribution ---
    const durationCount: Record<string, number> = {}
    enquiries.forEach((e) => {
      if (e.rental_duration) durationCount[e.rental_duration] = (durationCount[e.rental_duration] ?? 0) + 1
    })
    const durationData = DURATION_ORDER
      .filter((d) => durationCount[d])
      .map((duration) => ({ duration, count: durationCount[duration] }))

    return {
      totalCars: carsRes.count ?? 0,
      featuredCars: featuredRes.count ?? 0,
      totalEnquiries,
      newEnquiries,
      trendData,
      statusData,
      topCarsData,
      durationData,
      recentEnquiries: enquiries.slice(0, 5) as { id: string; status: string; car_name_snapshot: string | null; rental_duration: string | null; created_at: string; full_name?: string }[],
    }
  } catch {
    return {
      totalCars: 0, featuredCars: 0, totalEnquiries: 0, newEnquiries: 0,
      trendData: [], statusData: [], topCarsData: [], durationData: [], recentEnquiries: [],
    }
  }
}

async function getRecentEnquiries() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('enquiries')
      .select('id, full_name, email, car_name_snapshot, rental_duration, status')
      .order('created_at', { ascending: false })
      .limit(5)
    return data ?? []
  } catch { return [] }
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-[#EFF6FF] text-[#2563EB]',
  contacted: 'bg-[#FFFBEB] text-[#D97706]',
  closed: 'bg-[#F0FDF4] text-[#16A34A]',
}

export default async function AdminDashboard() {
  const [chartData, recentEnquiries] = await Promise.all([
    getDashboardData(),
    getRecentEnquiries(),
  ])

  const statCards = [
    { label: 'Available Cars', value: chartData.totalCars, icon: Car, color: 'bg-[#EFF6FF] text-[#2563EB]', href: '/admin/cars' },
    { label: 'Total Enquiries', value: chartData.totalEnquiries, icon: MessageSquare, color: 'bg-[#FFF7ED] text-[#EA580C]', href: '/admin/enquiries' },
    { label: 'New Enquiries', value: chartData.newEnquiries, icon: TrendingUp, color: 'bg-[#FEF2F2] text-[#DC2626]', href: '/admin/enquiries' },
    { label: 'Featured Cars', value: chartData.featuredCars, icon: Star, color: 'bg-[#F0FDF4] text-[#16A34A]', href: '/admin/cars' },
  ]

  const quickActions = [
    { label: 'Add New Car', href: '/admin/cars/new', icon: Plus, primary: true },
    { label: 'View Enquiries', href: '/admin/enquiries', icon: Eye, primary: false },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings, primary: false },
    { label: 'View Live Site', href: '/', icon: Eye, outline: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#1E293B]">Dashboard</h1>
        <p className="text-[#64748B] text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening with Piston Society.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href}
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
      {chartData.newEnquiries > 0 && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <p className="text-[#1E40AF] font-semibold text-sm">
              You have <strong>{chartData.newEnquiries}</strong> new {chartData.newEnquiries === 1 ? 'enquiry' : 'enquiries'} waiting for a response.
            </p>
          </div>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap">
            View now →
          </Link>
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries Trend - wide */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h2 className="font-bold font-heading text-[#1E293B] mb-1">Enquiries Trend</h2>
          <p className="text-xs text-[#94A3B8] mb-4">Last 30 days</p>
          <EnquiriesTrendChart data={chartData.trendData} />
        </div>

        {/* Status Donut */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h2 className="font-bold font-heading text-[#1E293B] mb-1">Enquiry Pipeline</h2>
          <p className="text-xs text-[#94A3B8] mb-4">By status</p>
          <StatusDonutChart data={chartData.statusData} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cars */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h2 className="font-bold font-heading text-[#1E293B] mb-1">Most Enquired Cars</h2>
          <p className="text-xs text-[#94A3B8] mb-4">Top 5 by enquiry count</p>
          <TopCarsChart data={chartData.topCarsData} />
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <h2 className="font-bold font-heading text-[#1E293B] mb-1">Rental Duration Preference</h2>
          <p className="text-xs text-[#94A3B8] mb-4">What customers are looking for</p>
          <DurationChart data={chartData.durationData} />
        </div>
      </div>

      {/* Bottom row: Recent Enquiries + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
            <h2 className="font-bold font-heading text-[#1E293B]">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-[#2563EB] font-semibold hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            {recentEnquiries.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    {['Name', 'Car', 'Duration', 'Status'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">{h}</th>
                    ))}
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
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[enq.status] ?? 'bg-[#F1F5F9] text-[#64748B]'}`}>
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
              return (
                <Link key={action.label} href={action.href}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    action.primary
                      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                      : action.outline
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
          <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-3">Tips</p>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li className="flex gap-2"><span className="text-[#2563EB]">•</span>Reply to new enquiries within 24h</li>
              <li className="flex gap-2"><span className="text-[#2563EB]">•</span>Keep car photos up to date</li>
              <li className="flex gap-2"><span className="text-[#2563EB]">•</span>Mark unavailable cars accurately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
