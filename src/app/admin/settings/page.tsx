'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const SETTINGS_FIELDS = [
  { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+61422663888', type: 'text' },
  { key: 'business_email', label: 'Business Email', placeholder: 'info@pistonsociety.com.au', type: 'email' },
  { key: 'business_phone', label: 'Business Phone', placeholder: '+61 422 663 888', type: 'text' },
  { key: 'business_address', label: 'Business Address', placeholder: 'Sydney, NSW, Australia', type: 'text' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/pistonsociety', type: 'url' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/pistonsociety', type: 'url' },
  { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/@pistonsociety', type: 'url' },
]

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [mapsEmbed, setMapsEmbed] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient()
      const { data } = await supabase.from('site_settings').select('*')
      const map: Record<string, string> = {}
      data?.forEach(s => { map[s.key] = s.value ?? '' })
      setValues(map)
      setMapsEmbed(map['google_maps_embed'] ?? '')
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

        <div className="flex justify-end">
          <Button variant="primary" size="lg" loading={loading} onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
