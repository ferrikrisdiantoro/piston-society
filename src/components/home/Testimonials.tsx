'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Testimonial } from '@/lib/types/database'

// Static fallback testimonials for when DB is not connected
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Liam Thompson',
    rating: 5,
    review:
      "Absolutely love the service! Got my RAV4 sorted within 2 days and everything was included. No more dealing with insurance renewals or rego — it's all done for me. Highly recommend Piston Society.",
    location: 'Sydney, NSW',
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    rating: 5,
    review:
      "As someone who travels for work, having a reliable car without the commitment of buying was a game-changer. The team was super responsive and the whole process took less than a week. 10/10.",
    location: 'Melbourne, VIC',
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'James Nguyen',
    rating: 5,
    review:
      "I was sceptical at first, but the transparency of the pricing won me over. What you see is what you pay — no nasty surprises at the end of the month. Great selection of cars too!",
    location: 'Brisbane, QLD',
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Emma Williams',
    rating: 5,
    review:
      "The Tesla Model 3 subscription was perfect for my 3-month contract work in Sydney. Roadside assist saved me once too — they were there within 30 minutes. Outstanding service.",
    location: 'Sydney, NSW',
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Daniel Okafor',
    rating: 5,
    review:
      "Way better than traditional leasing. I switched from a traditional 3-year lease to Piston Society and I'm saving money while having more flexibility. Should have done this years ago!",
    location: 'Perth, WA',
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Olivia Chen',
    rating: 5,
    review:
      "The booking process is seamless and the team is always available to help. I've been a subscriber for 6 months now and just renewed. The car is always clean and well-maintained.",
    location: 'Melbourne, VIC',
    is_visible: true,
    created_at: new Date().toISOString(),
  },
]

interface TestimonialsClientProps {
  testimonials: Testimonial[]
}

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const items = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, next])

  const getVisibleItems = () => {
    // Show 3 cards on desktop, 1 on mobile
    const indices = []
    for (let i = 0; i < Math.min(3, items.length); i++) {
      indices.push((current + i) % items.length)
    }
    return indices
  }

  return (
    <section
      className="section-padding bg-[#0F1A4F]"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[#2563EB] font-semibold text-sm tracking-widest uppercase mb-3">
            Customer Reviews
          </p>
          <h2 id="testimonials-heading" className="text-white mb-4">
            What Our Customers{' '}
            <span className="text-[#2563EB]">Are Saying</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]"
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-[#64748B] text-sm">
            5.0 average rating from our subscribers
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleItems().map((index, pos) => {
              const item = items[index]
              return (
                <div
                  key={`${item.id}-${pos}`}
                  className={cn(
                    'bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-500',
                    pos === 0
                      ? 'opacity-100 scale-100'
                      : 'opacity-70 scale-[0.98] hidden md:block'
                  )}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < item.rating
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-[#334155]'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <blockquote className="text-[#CBD5E1] text-sm leading-relaxed mb-6 italic">
                    &ldquo;{item.review}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {item.name}
                      </p>
                      {item.location && (
                        <p className="text-[#64748B] text-xs">{item.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="p-2.5 rounded-full border border-white/20 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    i === current
                      ? 'bg-[#2563EB] w-6'
                      : 'bg-white/30 hover:bg-white/50'
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2.5 rounded-full border border-white/20 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
