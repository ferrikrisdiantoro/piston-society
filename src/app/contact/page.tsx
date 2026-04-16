import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/ui/SocialIcons'
import { EnquiryForm } from '@/components/forms/EnquiryForm'

export const metadata: Metadata = {
  title: 'Contact Us — Submit an Enquiry',
  description:
    'Get in touch with Piston Society. Submit a car subscription enquiry, call us, or visit us. We respond within 24 hours.',
}


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <section className="bg-[#1E40AF] pt-28 pb-16">
        <div className="container-custom">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-4">Get in Touch</p>
          <h1 className="text-white font-heading font-bold text-4xl md:text-5xl mb-4">
            Contact Us
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Ready to start your subscription? Submit an enquiry and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enquiry Form */}
            <div>
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm">
                <h2 className="text-2xl font-bold font-heading text-[#1E293B] mb-2">
                  Submit an Enquiry
                </h2>
                <p className="text-[#64748B] text-sm mb-6">
                  Fill in the form below and our team will contact you within 24 hours.
                </p>
                <EnquiryForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                <h3 className="font-bold font-heading text-[#1E293B] text-lg mb-5">Contact Details</h3>
                <div className="space-y-4">
                  <a
                    href="tel:+61423771678"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide">Phone</p>
                      <p className="font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                        +61 423 771 678
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@pistonsociety.com.au"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1E40AF]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-[#1E40AF]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide">Email</p>
                      <p className="font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                        info@pistonsociety.com.au
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-[#0EA5E9]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide">Address</p>
                      <p className="font-semibold text-[#1E293B]">Sydney, NSW, Australia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                  <h3 className="font-bold font-heading text-[#1E293B] text-lg">Business Hours</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  {[
                    { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM AEST' },
                    { day: 'Saturday', hours: '10:00 AM – 4:00 PM AEST' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map((row) => (
                    <div key={row.day} className="flex justify-between items-center py-2 border-b border-[#F1F5F9] last:border-0">
                      <span className="text-[#64748B]">{row.day}</span>
                      <span className={`font-semibold ${row.hours === 'Closed' ? 'text-[#EF4444]' : 'text-[#1E293B]'}`}>
                        {row.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                <h3 className="font-bold font-heading text-[#1E293B] text-lg mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { href: 'https://instagram.com/pistonsociety', icon: InstagramIcon, label: 'Instagram' },
                    { href: 'https://facebook.com/pistonsociety', icon: FacebookIcon, label: 'Facebook' },
                  ].map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-all text-sm font-semibold"
                      aria-label={`Follow us on ${label}`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  ))}
                  <a
                    href="https://tiktok.com/@pistonsociety"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-all text-sm font-semibold"
                    aria-label="Follow us on TikTok"
                  >
                    <TikTokIcon className="h-4 w-4" />
                    TikTok
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-[#F1F5F9] rounded-2xl h-52 flex items-center justify-center border border-[#E2E8F0]">
                <div className="text-center text-[#94A3B8]">
                  <MapPin className="h-8 w-8 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm">Google Maps embed</p>
                  <p className="text-xs">(Configure via Admin Panel)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
