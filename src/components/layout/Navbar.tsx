'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Car } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/cars', label: 'Cars' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar({ logoUrl }: { logoUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'glass-dark shadow-lg py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Piston Society — Home"
          >
            {logoUrl ? (
              <div className="relative h-10 w-36">
                <Image src={logoUrl} alt="Piston Society" fill className="object-contain object-left" unoptimized />
              </div>
            ) : (
              <>
                <div className="bg-[#2563EB] rounded-lg p-2 group-hover:bg-[#1D4ED8] transition-colors">
                  <Car className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <span className="text-white font-heading font-bold text-lg tracking-wide">
                  PISTON <span className="text-[#2563EB]">SOCIETY</span>
                </span>
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'text-[#2563EB] bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Link href="/contact">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!isOpen}
      >
        <div className="glass-dark border-t border-white/10 mt-3">
          <nav
            className="container-custom py-4 flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 rounded-xl text-base font-semibold transition-colors',
                    isActive
                      ? 'text-[#2563EB] bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-3 pt-3 border-t border-white/10">
              <Link href="/contact" className="block">
                <Button variant="primary" size="md" fullWidth>
                  Get Started — It&apos;s Free to Enquire
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
