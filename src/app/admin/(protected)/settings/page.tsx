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

interface UploadFieldProps {
  label: string
  hint: string
  currentUrl: string
  apiEndpoint: string
  accept: string
  maxMbLabel: string
  previewClass: string
  onUploaded: (url: string) => void
}

function UploadImageField({ label, hint, currentUrl, apiEndpoint, accept, maxMbLabel, previewClass, onUploaded }: UploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(apiEndpoint, { method: 'POST', body: form })
      const result = await res.json() as { url?: string; error?: string }
      if (!res.ok) throw new Error(result.error ?? 'Upload failed')
      onUploaded(result.url!)
      toast.success(`${label} updated!`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
      <h2 className="font-bold font-heading text-[#1E293B] mb-1">{label}</h2>
      <p className="text-[#64748B] text-sm mb-5">{hint}</p>
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className={`relative ${previewClass} rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center`}>
          {currentUrl ? (
            <Image src={currentUrl} alt={label} fill className="object-contain p-2" unoptimized />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#94A3B8]">
              <ImageIcon className="h-8 w-8 mb-1" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleChange} />
          <Button variant="secondary" size="md" loading={uploading} onClick={() => ref.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            {uploading ? 'Uploading…' : 'Upload'}
          </Button>
          <p className="text-xs text-[#94A3B8]">{maxMbLabel}</p>
          {currentUrl && <p className="text-xs text-[#22C55E] font-semibold">✓ Custom image active</p>}
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [mapsEmbed, setMapsEmbed] = useState('')
  const [loading, setLoading] = useState(false)
  const [heroBgUrl, setHeroBgUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient()
      const { data } = await supabase.from('site_settings').select('*')
      const map: Record<string, string> = {}
      data?.forEach(s => { map[s.key] = s.value ?? '' })
      setValues(map)
      setMapsEmbed(map['google_maps_embed'] ?? '')
      setHeroBgUrl(map['hero_bg_url'] ?? '')
      setLogoUrl(map['logo_url'] ?? '')
    }
    fetchSettings()
  }, [])

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
        <p className="text-[#64748B] text-sm mt-1">Configure business information, branding, and social media links.</p>
      </div>

      <div className="space-y-6">
        {/* Logo */}
        <UploadImageField
          label="Site Logo"
          hint="Shown in the navbar and browser tab. Recommended: PNG/SVG with transparent background, min 200px wide, max 2MB."
          currentUrl={logoUrl}
          apiEndpoint="/api/admin/upload-logo"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          maxMbLabel="PNG, SVG, or WebP · Max 2MB"
          previewClass="w-48 h-16"
          onUploaded={setLogoUrl}
        />

        {/* Hero Background */}
        <UploadImageField
          label="Hero Background Image"
          hint="The full-screen photo on the homepage. Recommended: landscape, min 1920×1080px, max 5MB."
          currentUrl={heroBgUrl}
          apiEndpoint="/api/admin/upload-hero"
          accept="image/jpeg,image/png,image/webp"
          maxMbLabel="JPG, PNG, or WebP · Max 5MB"
          previewClass="w-64 h-36"
          onUploaded={setHeroBgUrl}
        />

        {/* Contact Information */}
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

        {/* Google Maps */}
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

        <div className="flex justify-end">
          <Button variant="primary" size="lg" loading={loading} onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
