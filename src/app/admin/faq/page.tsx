'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import type { FAQ } from '@/lib/types/database'

interface FAQFormData {
  question: string
  answer: string
  category: string
  is_visible: boolean
}

const EMPTY_FORM: FAQFormData = {
  question: '',
  answer: '',
  category: '',
  is_visible: true,
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [form, setForm] = useState<FAQFormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchFaqs = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true })
    setFaqs(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  function openCreate() {
    setEditingFaq(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(faq: FAQ) {
    setEditingFaq(faq)
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category ?? '',
      is_visible: faq.is_visible,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error('Question and answer are required')
      return
    }

    setSaving(true)
    const supabase = createClient()

    try {
      if (editingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update({
            question: form.question,
            answer: form.answer,
            category: form.category || null,
            is_visible: form.is_visible,
          })
          .eq('id', editingFaq.id)
        if (error) throw error
        toast.success('FAQ updated')
      } else {
        const maxOrder = faqs.length > 0
          ? Math.max(...faqs.map((f) => f.display_order))
          : 0
        const { error } = await supabase.from('faqs').insert({
          question: form.question,
          answer: form.answer,
          category: form.category || null,
          is_visible: form.is_visible,
          display_order: maxOrder + 1,
        })
        if (error) throw error
        toast.success('FAQ created')
      }

      setModalOpen(false)
      fetchFaqs()
    } catch {
      toast.error('Failed to save FAQ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    const supabase = createClient()
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete FAQ')
    } else {
      toast.success('FAQ deleted')
      setFaqs((prev) => prev.filter((f) => f.id !== id))
    }
  }

  async function toggleVisibility(faq: FAQ) {
    const supabase = createClient()
    const { error } = await supabase
      .from('faqs')
      .update({ is_visible: !faq.is_visible })
      .eq('id', faq.id)
    if (error) {
      toast.error('Failed to update visibility')
    } else {
      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, is_visible: !faq.is_visible } : f))
      )
    }
  }

  const categories = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#1E293B]">FAQ Management</h1>
          <p className="text-[#64748B] text-sm mt-1">{faqs.length} questions</p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add FAQ
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[#94A3B8]">Loading…</div>
        ) : faqs.length === 0 ? (
          <div className="py-16 text-center text-[#94A3B8]">No FAQs yet. Add your first one!</div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {faqs.map((faq) => (
              <div key={faq.id} className="flex items-start gap-4 p-5 hover:bg-[#F8FAFC] transition-colors">
                <GripVertical className="h-5 w-5 text-[#CBD5E1] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-[#1E293B] text-sm leading-snug">
                      {faq.question}
                    </p>
                    {faq.category && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#F1F5F9] text-[#64748B] font-semibold">
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <p className="text-[#64748B] text-xs line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleVisibility(faq)}
                    className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                    aria-label={faq.is_visible ? 'Hide FAQ' : 'Show FAQ'}
                    title={faq.is_visible ? 'Visible' : 'Hidden'}
                  >
                    {faq.is_visible
                      ? <Eye className="h-4 w-4 text-[#22C55E]" />
                      : <EyeOff className="h-4 w-4 text-[#94A3B8]" />
                    }
                  </button>
                  <button
                    onClick={() => openEdit(faq)}
                    className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E3A5F] transition-colors"
                    aria-label="Edit FAQ"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 rounded-lg text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
                    aria-label="Delete FAQ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
      >
        <div className="space-y-4">
          <Input
            label="Question"
            required
            value={form.question}
            onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
            placeholder="What is car subscription?"
          />
          <Textarea
            label="Answer"
            required
            value={form.answer}
            onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
            rows={5}
            placeholder="A car subscription is a flexible alternative to car ownership…"
          />
          <Input
            label="Category (optional)"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            placeholder="e.g. Pricing, Subscriptions, Insurance"
            hint={categories.length > 0 ? `Existing: ${categories.join(', ')}` : undefined}
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#E2E8F0] text-[#E85D2A]"
              checked={form.is_visible}
              onChange={(e) => setForm((p) => ({ ...p, is_visible: e.target.checked }))}
            />
            <span className="text-sm text-[#1E293B] font-medium">Visible on FAQ page</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
              {editingFaq ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
