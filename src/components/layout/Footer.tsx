import Link from 'next/link'
import { Car, Phone, Mail, MapPin } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/ui/SocialIcons'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/cars', label: 'Browse Cars' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About Us' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const legalLinks = [
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
]


export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0F172A] text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group" aria-label="Piston Society">
              <div className="bg-[#E85D2A] rounded-lg p-2">
                <Car className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-heading font-bold text-lg tracking-wide">
                PISTON <span className="text-[#E85D2A]">SOCIETY</span>
              </span>
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
              Flexible car subscriptions across Australia. Drive your dream car — all costs included, no lock-in contracts.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/pistonsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 text-[#94A3B8] hover:bg-[#E85D2A] hover:text-white transition-all duration-200"
                aria-label="Follow us on Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/pistonsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 text-[#94A3B8] hover:bg-[#E85D2A] hover:text-white transition-all duration-200"
                aria-label="Follow us on Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com/@pistonsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 text-[#94A3B8] hover:bg-[#E85D2A] hover:text-white transition-all duration-200"
                aria-label="Follow us on TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#94A3B8] text-sm hover:text-[#E85D2A] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Service Areas</h3>
            <ul className="space-y-2.5 text-[#94A3B8] text-sm" role="list">
              {['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD', 'Perth, WA', 'Adelaide, SA'].map((city) => (
                <li key={city} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85D2A] flex-shrink-0" aria-hidden="true" />
                  {city}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3" role="list">
              <li>
                <a
                  href="tel:+61422663888"
                  className="flex items-start gap-3 text-[#94A3B8] text-sm hover:text-[#E85D2A] transition-colors group"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-[#E85D2A]" aria-hidden="true" />
                  +61 422 663 888
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@pistonsociety.com.au"
                  className="flex items-start gap-3 text-[#94A3B8] text-sm hover:text-[#E85D2A] transition-colors group"
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 group-hover:text-[#E85D2A]" aria-hidden="true" />
                  info@pistonsociety.com.au
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-[#94A3B8] text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>Sydney, NSW, Australia</span>
                </div>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-[#64748B] font-semibold uppercase tracking-wide mb-1">Business Hours</p>
              <p className="text-[#94A3B8] text-xs">Mon – Fri: 9am – 6pm AEST</p>
              <p className="text-[#94A3B8] text-xs">Sat: 10am – 4pm AEST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#64748B] text-xs text-center sm:text-left">
            © {currentYear} Piston Society. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#64748B] text-xs hover:text-[#94A3B8] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
