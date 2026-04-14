'use client'

import { useState, useEffect } from 'react'
import { Star, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Testimonial } from '@/lib/types/database'

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState({ name: '', rating: 5, review: '', location: '' })
  const [loading, setLoading] = useState(false)

  async function fetchTestimonials() {
    const supabase = createClient()
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials(data ?? [])
  }

  useEffect(() => { fetchTestimonials() }, [])

  function openNew() {
    setEditing(null)
    setForm({ name: '', rating: 5, review: '', location: '' })
    setModalOpen(true)
  }

  function openEdit(t: Testimonial) {
    setEditing(t)
    setForm({ name: t.name, rating: t.rating, review: t.review, location: t.location ?? '' })
    setModalOpen(true)
  }

  async function handleSave() {
    setLoading(true)
    try {
      const supabase = createClient()
      if (editing) {
        await supabase.from('testimonials').update({ ...form }).eq('id', editing.id)
        toast.success('Testimonial updated')
      } else {
        await supabase.from('testimonials').insert({ ...form, is_visible: true })
        toast.success('Testimonial added')
      }
      setModalOpen(false)
      fetchTestimonials()
    } catch { toast.error('Failed to save') } finally { setLoading(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    const supabase = createClient()
    await supabase.from('testimonials').delete().eq('id', id)
    toast.success('Deleted')
    fetchTestimonials()
  }

  async function toggleVisibility(t: Testimonial) {
    const supabase = createClient()
    await supabase.from('testimonials').update({ is_visible: !t.is_visible }).eq('id', t.id)
    fetchTestimonials()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1E293B]">Testimonials</h1>
        <Button variant="primary" size="md" onClick={openNew}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add Testimonial
        </Button>
      </div>

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className={`bg-white rounded-2xl p-5 border transition-all ${t.is_visible ? 'border-[#E2E8F0]' : 'border-[#E2E8F0] opacity-60'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[#1E293B]">{t.name}</p>
                  {t.location && <span className="text-xs text-[#94A3B8]">— {t.location}</span>}
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E2E8F0]'}`} aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm text-[#64748B] line-clamp-2">&ldquo;{t.review}&rdquo;</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleVisibility(t)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors" aria-label={t.is_visible ? 'Hide' : 'Show'}>
                  {t.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="py-16 text-center text-[#94A3B8] bg-white rounded-2xl border border-[#E2E8F0]">
            <Star className="h-10 w-10 mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p>No testimonials yet</p>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          <Input label="Location" placeholder="Sydney, NSW" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
          <div>
            <label className="text-sm font-semibold text-[#1E293B] block mb-1.5">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(r => (
                <button key={r} type="button" onClick={() => setForm(p => ({ ...p, rating: r }))}
                  className={`p-1 rounded ${form.rating >= r ? 'text-[#F59E0B]' : 'text-[#E2E8F0]'}`}>
                  <Star className="h-6 w-6 fill-current" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <Textarea label="Review" value={form.review} onChange={e => setForm(p => ({ ...p, review: e.target.value }))} required rows={4} />
          <Button variant="primary" fullWidth loading={loading} onClick={handleSave}>
            {editing ? 'Save Changes' : 'Add Testimonial'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
