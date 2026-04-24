import { createClient } from '@/lib/supabase/server'

export interface SiteSettings {
  whatsapp_number?: string
  business_email?: string
  business_phone?: string
  business_address?: string
  instagram_url?: string
  facebook_url?: string
  tiktok_url?: string
  logo_url?: string
  hero_bg_url?: string
  google_maps_embed?: string
}

export const DEFAULT_SETTINGS: Required<Omit<SiteSettings, 'logo_url' | 'hero_bg_url' | 'google_maps_embed'>> = {
  whatsapp_number: '+61423771678',
  business_email: 'info@pistonsociety.com.au',
  business_phone: '+61 423 771 678',
  business_address: 'Sydney, NSW, Australia',
  instagram_url: 'https://instagram.com/pistonsociety',
  facebook_url: 'https://facebook.com/pistonsociety',
  tiktok_url: 'https://tiktok.com/@pistonsociety',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    const map: SiteSettings = {}
    data?.forEach((s) => {
      if (s.value) map[s.key as keyof SiteSettings] = s.value
    })
    return map
  } catch {
    return {}
  }
}

export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '')
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits}${text}`
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`
}

export interface PageContentFields {
  meta_title: string | null
  meta_description: string | null
  hero_title: string | null
  hero_subtitle: string | null
}

export async function getPageContent(slug: string): Promise<PageContentFields | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('page_contents')
      .select('meta_title, meta_description, hero_title, hero_subtitle')
      .eq('page_slug', slug)
      .single()
    return data
  } catch {
    return null
  }
}
