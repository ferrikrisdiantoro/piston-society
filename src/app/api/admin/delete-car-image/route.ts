import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const BUCKET = 'site-assets'

export async function POST(request: NextRequest) {
  const supabaseServer = await createClient()
  const { data: { user } } = await supabaseServer.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null) as { image_id?: string } | null
  const imageId = body?.image_id
  if (!imageId) return Response.json({ error: 'image_id required' }, { status: 400 })

  const supabase = createAdminClient()

  const { data: image } = await supabase
    .from('car_images')
    .select('id, car_id, image_url, is_primary')
    .eq('id', imageId)
    .single()

  if (!image) return Response.json({ error: 'Image not found' }, { status: 404 })

  const url = new URL(image.image_url)
  const pathParts = url.pathname.split(`/${BUCKET}/`)
  const storagePath = pathParts[1]
  if (storagePath) {
    await supabase.storage.from(BUCKET).remove([storagePath])
  }

  const { error: deleteError } = await supabase
    .from('car_images')
    .delete()
    .eq('id', imageId)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  if (image.is_primary) {
    const { data: remaining } = await supabase
      .from('car_images')
      .select('id')
      .eq('car_id', image.car_id)
      .order('display_order', { ascending: true })
      .limit(1)

    if (remaining && remaining.length > 0) {
      await supabase
        .from('car_images')
        .update({ is_primary: true })
        .eq('id', remaining[0].id)
    }
  }

  return Response.json({ success: true })
}
