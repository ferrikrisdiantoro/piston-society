'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import type { PageContent } from '@/lib/types/database'

const PAGE_SLUGS = [
  { slug: 'home', label: 'Homepage' },
  { slug: 'about', label: 'About Us' },
  { slug: 'how-it-works', label: 'How It Works' },
  { slug: 'faq', label: 'FAQ' },
  { slug: 'contact', label: 'Contact' },
]

interface PageFormData {
  meta_title: string
  meta_description: string
  hero_title: string
  hero_subtitle: string
}

function PageSection({
  slug,
  label,
}: {
  slug: string
  label: string
}) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState<PageContent | null>(null)
  const [form, setForm] = useState<PageFormData>({
    meta_title: '',
    meta_description: '',
    hero_title: '',
    hero_subtitle: '',
  })
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async () => {
    if (loaded) return
    const supabase = createClient()
    const { data } = await supabase
      .from('page_contents')
      .select('*')
      .eq('page_slug', slug)
      .single()
    if (data) {
      setContent(data)
      setForm({
        meta_title: data.meta_title ?? '',
        meta_description: data.meta_description ?? '',
        hero_title: data.hero_title ?? '',
        hero_subtitle: data.hero_subtitle ?? '',
      })
    }
    setLoaded(true)
  }, [slug, loaded])

  useEffect(() => {
    if (open) load()
  }, [open, load])

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    try {
      const payload = {
        page_slug: slug,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        hero_title: form.hero_title || null,
        hero_subtitle: form.hero_subtitle || null,
        updated_at: new Date().toISOString(),
      }

      let error
      if (content) {
        ;({ error } = await supabase
          .from('page_contents')
          .update(payload)
          .eq('id', content.id))
      } else {
        ;({ error } = await supabase.from('page_contents').insert(payload))
      }

      if (error) throw error
      toast.success(`${label} content saved`)
    } catch {
      toast.error('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F8FAFC] transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div>
          <p className="font-bold text-[#1E293B]">{label}</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">/{slug}</p>
        </div>
        {open
          ? <ChevronUp className="h-5 w-5 text-[#64748B]" aria-hidden="true" />
          : <ChevronDown className="h-5 w-5 text-[#64748B]" aria-hidden="true" />
        }
      </button>

      {open && (
        <div className="border-t border-[#F1F5F9] p-5 space-y-4">
          {!loaded ? (
            <p className="text-sm text-[#94A3B8]">Loading…</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Meta Title"
                  value={form.meta_title}
                  onChange={(e) => setForm((p) => ({ ...p, meta_title: e.target.value }))}
                  placeholder={`${label} — Piston Society`}
                  hint="Appears in browser tab and search results (50–60 chars recommended)"
                />
                <Textarea
                  label="Meta Description"
                  value={form.meta_description}
                  onChange={(e) => setForm((p) => ({ ...p, meta_description: e.target.value }))}
                  rows={2}
                  placeholder="A concise description for search engines…"
                  hint="150–160 characters recommended"
                />
                <Input
                  label="Hero Title"
                  value={form.hero_title}
                  onChange={(e) => setForm((p) => ({ ...p, hero_title: e.target.value }))}
                  placeholder="Main headline shown in the hero section"
                />
                <Textarea
                  label="Hero Subtitle"
                  value={form.hero_subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, hero_subtitle: e.target.value }))}
                  rows={2}
                  placeholder="Supporting text below the headline"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  Save {label}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminPagesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1E293B]">Page Content</h1>
        <p className="text-[#64748B] text-sm mt-1">
          Edit meta tags and hero content for each page. Click a page to expand.
        </p>
      </div>

      <div className="space-y-3">
        {PAGE_SLUGS.map(({ slug, label }) => (
          <PageSection key={slug} slug={slug} label={label} />
        ))}
      </div>
    </div>
  )
}
