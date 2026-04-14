import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils/format'
import Link from 'next/link'
import { Plus, Car } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AdminCarActions } from './AdminCarActions'

async function getCars() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminCarsPage() {
  const cars = await getCars()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#1E293B]">Cars</h1>
          <p className="text-[#64748B] text-sm mt-1">{cars.length} vehicles in fleet</p>
        </div>
        <Link href="/admin/cars/new">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Car
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          {cars.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Vehicle</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Location</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Price/Week</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Badge</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-[#94A3B8] font-semibold text-xs uppercase tracking-wide">Featured</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#1E293B]">
                        {car.year} {car.make} {car.model}
                      </p>
                      {car.badge && (
                        <p className="text-xs text-[#94A3B8]">{car.badge}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#64748B]">{car.body_type}</td>
                    <td className="px-5 py-4 text-[#64748B]">{car.location ?? '—'}</td>
                    <td className="px-5 py-4 font-semibold text-[#E85D2A]">
                      {formatCurrency(car.price_weekly)}
                    </td>
                    <td className="px-5 py-4">
                      {car.badge_label ? (
                        <Badge label={car.badge_label} />
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${car.is_available ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}>
                        {car.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${car.is_featured ? 'bg-[#FFFBEB] text-[#D97706]' : 'bg-[#F8FAFC] text-[#94A3B8]'}`}>
                        {car.is_featured ? 'Featured' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <AdminCarActions carId={car.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center text-[#94A3B8]">
              <Car className="h-10 w-10 mx-auto mb-3 opacity-50" aria-hidden="true" />
              <p className="mb-3">No cars added yet</p>
              <Link href="/admin/cars/new">
                <Button variant="primary" size="sm">Add Your First Car</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
