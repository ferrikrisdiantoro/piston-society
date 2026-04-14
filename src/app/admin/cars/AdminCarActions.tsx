'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface AdminCarActionsProps {
  carId: string
}

export function AdminCarActions({ carId }: AdminCarActionsProps) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from('cars').delete().eq('id', carId)
      if (error) throw error
      toast.success('Car deleted successfully')
      router.refresh()
    } catch {
      toast.error('Failed to delete car')
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/cars/${carId}/edit`}
        className="p-2 rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
        aria-label="Edit car"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
      <button
        onClick={handleDelete}
        className="p-2 rounded-lg text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
        aria-label="Delete car"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
