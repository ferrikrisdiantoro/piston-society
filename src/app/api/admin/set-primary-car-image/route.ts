import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

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
    .select('id, car_id')
    .eq('id', imageId)
    .single()

  if (!image) return Response.json({ error: 'Image not found' }, { status: 404 })

  await supabase
    .from('car_images')
    .update({ is_primary: false })
    .eq('car_id', image.car_id)

  const { error } = await supabase
    .from('car_images')
    .update({ is_primary: true })
    .eq('id', imageId)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
