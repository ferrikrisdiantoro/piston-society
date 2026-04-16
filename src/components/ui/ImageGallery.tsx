'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { CarImage } from '@/lib/types/database'

interface ImageGalleryProps {
  images: CarImage[]
  carName: string
}

export function ImageGallery({ images, carName }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  })

  const fallbackImage =
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'

  const displayImages =
    sortedImages.length > 0
      ? sortedImages
      : [
          {
            id: 'placeholder',
            car_id: '',
            image_url: fallbackImage,
            display_order: 0,
            is_primary: true,
            created_at: '',
          } satisfies CarImage,
        ]

  const prev = () =>
    setCurrent((c) => (c - 1 + displayImages.length) % displayImages.length)
  const next = () =>
    setCurrent((c) => (c + 1) % displayImages.length)

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-3">
        {/* Primary Image */}
        <div
          className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-[#F1F5F9] group cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label={`View ${carName} image ${current + 1} of ${displayImages.length} — click to enlarge`}
          onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
        >
          <Image
            src={displayImages[current]?.image_url ?? fallbackImage}
            alt={`${carName} — image ${current + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" aria-hidden="true" />
          </div>

          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
              {current + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
            {displayImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setCurrent(idx)}
                className={cn(
                  'relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all snap-start',
                  idx === current
                    ? 'border-[#2563EB] opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
                aria-label={`Select image ${idx + 1}`}
                aria-current={idx === current}
              >
                <Image
                  src={img.image_url}
                  alt={`${carName} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${carName} image gallery`}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close gallery"
          >
            <X className="h-7 w-7" />
          </button>

          <div className="relative w-full max-w-4xl aspect-video mx-4">
            <Image
              src={displayImages[current]?.image_url ?? fallbackImage}
              alt={`${carName} — image ${current + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {displayImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 text-white/60 text-sm">
            {current + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  )
}
