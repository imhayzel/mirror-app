import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'wardrobe-images'

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Use service role key if available (allows bucket creation); fall back to anon key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const db = getStorageClient()

  // Ensure bucket exists (no-op if already created or if permissions are insufficient)
  try {
    await db.storage.createBucket(BUCKET, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 10485760, // 10 MB
    })
  } catch {
    // Already exists or no admin permissions — continue to upload attempt
  }

  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `${userId}/${filename}`

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await db.storage.from(BUCKET).upload(path, arrayBuffer, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })

  if (error) {
    console.error('[upload] Storage error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = db.storage.from(BUCKET).getPublicUrl(path)
  return NextResponse.json({ url: publicUrl })
}
