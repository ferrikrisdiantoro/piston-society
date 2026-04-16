import Link from 'next/link'
import { Car, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#1E40AF]/10 mb-6">
          <Car className="h-10 w-10 text-[#1E40AF]" aria-hidden="true" />
        </div>
        <h1 className="text-6xl font-bold font-heading text-[#1E40AF] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Page Not Found</h2>
        <p className="text-[#64748B] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" size="md">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Button>
          </Link>
          <Link href="/cars">
            <Button variant="outline" size="md">
              Browse Cars
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
