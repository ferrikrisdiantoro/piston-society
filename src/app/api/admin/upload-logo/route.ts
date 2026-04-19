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
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  if (!['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext)) {
    return Response.json({ error: 'Only JPG, PNG, WebP, SVG allowed' }, { status: 400 })
  }
  if (file.size > 2 * 1024 * 1024) {
    return Response.json({ error: 'File too large (max 2MB)' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true })
  }

  const fileName = `logo.${ext}`
  const arrayBuffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, arrayBuffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName)

  await supabase
    .from('site_settings')
    .upsert({ key: 'logo_url', value: publicUrl }, { onConflict: 'key' })

  return Response.json({ url: publicUrl })
}
