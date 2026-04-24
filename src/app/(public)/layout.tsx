import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppWidget } from '@/components/layout/WhatsAppWidget'
import { getSiteSettings } from '@/lib/utils/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <>
      <Navbar logoUrl={settings.logo_url} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppWidget whatsappNumber={settings.whatsapp_number} />
    </>
  )
}
