'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Star, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { CarImage } from '@/lib/types/database'

interface CarImageManagerProps {
  carId: string
}

export function CarImageManager({ carId }: CarImageManagerProps) {
  const [images, setImages] = useState<CarImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('car_images')
      .select('*')
      .eq('car_id', carId)
      .order('display_order', { ascending: true })
    setImages(data ?? [])
  }

  useEffect(() => {
    loadImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('car_id', carId)
      const res = await fetch('/api/admin/upload-car-image', { method: 'POST', body: form })
      const result = await res.json() as { image?: CarImage; error?: string }
      if (!res.ok) throw new Error(result.error ?? 'Upload failed')
      await loadImages()
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm('Delete this image?')) return
    setBusyId(imageId)
    try {
      const res = await fetch('/api/admin/delete-car-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: imageId }),
      })
      const result = await res.json() as { error?: string }
      if (!res.ok) throw new Error(result.error ?? 'Delete failed')
      await loadImages()
      toast.success('Image deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusyId(null)
    }
  }

  async function handleSetPrimary(imageId: string) {
    setBusyId(imageId)
    try {
      const res = await fetch('/api/admin/set-primary-car-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: imageId }),
      })
      const result = await res.json() as { error?: string }
      if (!res.ok) throw new Error(result.error ?? 'Failed to set primary')
      await loadImages()
      toast.success('Primary image updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to set primary')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold font-heading text-[#1E293B]">Car Images</h2>
          <p className="text-sm text-[#64748B] mt-1">
            Upload photos of this car. The primary image is shown first on the site.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          variant="secondary"
          size="md"
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {uploading ? 'Uploading…' : 'Upload Image'}
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-[#94A3B8] bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
          <ImageIcon className="h-10 w-10 mb-2" />
          <p className="text-sm">No images yet — upload one to get started.</p>
          <p className="text-xs mt-1">JPG, PNG or WebP · Max 5MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9]"
            >
              <div className="relative aspect-square">
                <Image
                  src={img.image_url}
                  alt="Car image"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {img.is_primary && (
                <div className="absolute top-2 left-2 bg-[#2563EB] text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                  Primary
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    disabled={busyId === img.id}
                    className="bg-white text-[#1E293B] rounded-lg px-3 py-2 text-xs font-semibold hover:bg-[#F1F5F9] disabled:opacity-50 flex items-center gap-1"
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    Set Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  disabled={busyId === img.id}
                  className="bg-red-600 text-white rounded-lg px-3 py-2 text-xs font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
