import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const BUCKET = 'site-assets'

export async function POST(request: NextRequest) {
  const supabaseServer = await createClient()
  const { data: { user } } = await supabaseServer.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const carId = formData.get('car_id') as string | null
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
  if (!carId) return Response.json({ error: 'car_id required' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return Response.json({ error: 'Only JPG, PNG, WebP allowed' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true })
  }

  const fileName = `cars/${carId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const arrayBuffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName)

  const { data: existing } = await supabase
    .from('car_images')
    .select('id, display_order, is_primary')
    .eq('car_id', carId)

  const nextOrder = existing && existing.length > 0
    ? Math.max(...existing.map((i) => i.display_order)) + 1
    : 0
  const isPrimary = !existing || existing.length === 0

  const { data: inserted, error: insertError } = await supabase
    .from('car_images')
    .insert({
      car_id: carId,
      image_url: publicUrl,
      display_order: nextOrder,
      is_primary: isPrimary,
    })
    .select()
    .single()

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 })
  }

  return Response.json({ image: inserted })
}
