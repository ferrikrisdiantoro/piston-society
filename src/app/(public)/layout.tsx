import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppWidget } from '@/components/layout/WhatsAppWidget'
import { createClient } from '@/lib/supabase/server'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let logoUrl: string | undefined
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'logo_url')
      .single()
    logoUrl = data?.value ?? undefined
  } catch {
    logoUrl = undefined
  }

  return (
    <>
      <Navbar logoUrl={logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </>
  )
}
