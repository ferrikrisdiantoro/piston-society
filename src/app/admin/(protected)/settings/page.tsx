'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const SETTINGS_FIELDS = [
  { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+61423771678', type: 'text' },
  { key: 'business_email', label: 'Business Email', placeholder: 'info@pistonsociety.com.au', type: 'email' },
  { key: 'business_phone', label: 'Business Phone', placeholder: '+61 423 771 678', type: 'text' },
  { key: 'business_address', label: 'Business Address', placeholder: 'Sydney, NSW, Australia', type: 'text' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/pistonsociety', type: 'url' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/pistonsociety', type: 'url' },
  { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/@pistonsociety', type: 'url' },
]

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [mapsEmbed, setMapsEmbed] = useState('')
  const [loading, setLoading] = useState(false)
  const [heroBgUrl, setHeroBgUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient()
      const { data } = await supabase.from('site_settings').select('*')
      const map: Record<string, string> = {}
      data?.forEach(s => { map[s.key] = s.value ?? '' })
      setValues(map)
      setMapsEmbed(map['google_maps_embed'] ?? '')
      setHeroBgUrl(map['hero_bg_url'] ?? '')
    }
    fetchSettings()
  }, [])

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload-hero', { method: 'POST', body: form })
      const result = await res.json() as { url?: string; error?: string }
      if (!res.ok) throw new Error(result.error ?? 'Upload failed')
      setHeroBgUrl(result.url!)
      toast.success('Hero background updated! Changes live immediately.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSave() {
    setLoading(true)
    try {
      const supabase = createClient()
      const upserts = [
        ...SETTINGS_FIELDS.map(f => ({ key: f.key, value: values[f.key] ?? '' })),
        { key: 'google_maps_embed', value: mapsEmbed },
      ]

      for (const item of upserts) {
        await supabase
          .from('site_settings')
          .upsert({ key: item.key, value: item.value }, { onConflict: 'key' })
      }

      toast.success('Settings saved successfully!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-[#1E293B]">Site Settings</h1>
        <p className="text-[#64748B] text-sm mt-1">Configure business information and social media links.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
          <h2 className="font-bold font-heading text-[#1E293B] mb-5">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SETTINGS_FIELDS.map(field => (
              <Input
                key={field.key}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
          <h2 className="font-bold font-heading text-[#1E293B] mb-5">Google Maps Embed</h2>
          <Textarea
            label="Google Maps Embed URL or HTML"
            placeholder="Paste your Google Maps embed URL or iframe HTML here..."
            value={mapsEmbed}
            onChange={e => setMapsEmbed(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-[#94A3B8] mt-2">
            Get the embed URL from Google Maps → Share → Embed a map → Copy HTML
          </p>
        </div>

        {/* Hero Background */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
          <h2 className="font-bold font-heading text-[#1E293B] mb-1">Hero Background Image</h2>
          <p className="text-[#64748B] text-sm mb-5">
            The full-screen photo on the homepage. Recommended: landscape, min 1920×1080px, max 5MB.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Preview */}
            <div className="relative w-full sm:w-64 h-36 rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9] flex-shrink-0">
              {heroBgUrl ? (
                <Image src={heroBgUrl} alt="Hero background preview" fill className="object-cover" unoptimized />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#94A3B8]">
                  <ImageIcon className="h-8 w-8 mb-1" />
                  <span className="text-xs">Current: hero-bg.jpg (local)</span>
                </div>
              )}
            </div>
            {/* Upload */}
            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleHeroUpload}
              />
              <Button
                variant="secondary"
                size="md"
                loading={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {uploading ? 'Uploading…' : 'Upload New Photo'}
              </Button>
              <p className="text-xs text-[#94A3B8]">JPG, PNG, or WebP · Max 5MB</p>
              {heroBgUrl && (
                <p className="text-xs text-[#22C55E] font-semibold">✓ Custom image active</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" size="lg" loading={loading} onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
